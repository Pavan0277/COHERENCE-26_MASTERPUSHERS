import {
    listTranscriptsByUser,
    getTranscriptByCallId,
    getTranscriptByVapiId,
    updateCallStatusByVapiId,
    addTranscriptEntryByVapiId,
    setFullTranscriptByVapiId,
    syncCallFromVapi,
} from "../services/transcriptService.js";
import { UserSettings } from "../models/userSettings.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/calls/transcripts
 * List all call transcripts for the authenticated user.
 * Auto-syncs calls that are stuck in non-terminal states.
 * Query params: workflowId, page, limit
 */
export const listTranscripts = asyncHandler(async (req, res) => {
    const userId     = req.user._id;
    const workflowId = req.query.workflowId || null;
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await listTranscriptsByUser(userId, { workflowId, page, limit });

    // Fire-and-forget: auto-sync calls that have a vapiId but are not yet terminal
    const TERMINAL = new Set(["completed", "failed", "no-answer"]);
    const stuckCalls = result.records.filter(
        (r) => r.vapiId && !TERMINAL.has(r.status)
    );
    if (stuckCalls.length > 0) {
        const settings = await UserSettings.findOne({ userId }).lean().catch(() => null);
        const vapiApiKey = settings?.vapi?.apiKey || null;
        // Sync all stuck calls in parallel, ignore errors
        Promise.all(
            stuckCalls.map((r) => syncCallFromVapi(r.vapiId, vapiApiKey).catch(() => null))
        ).then(() => {
            console.log(`[AutoSync] Synced ${stuckCalls.length} stuck call(s) for user ${userId}`);
        }).catch(() => null);
    }

    res.json(result);
});

/**
 * GET /api/calls/transcripts/:callId
 * Fetch a single transcript by callId.
 * Auto-syncs from VAPI if the call is not yet terminal.
 */
export const getTranscript = asyncHandler(async (req, res) => {
    const transcript = await getTranscriptByCallId(req.params.callId);
    if (!transcript) {
        return res.status(404).json({ message: "Transcript not found" });
    }
    // Ensure user can only access their own transcripts
    if (transcript.userId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
    }

    const TERMINAL = new Set(["completed", "failed", "no-answer"]);
    if (transcript.vapiId && !TERMINAL.has(transcript.status)) {
        // Sync and return refreshed data
        const settings = await UserSettings.findOne({ userId: req.user._id }).lean().catch(() => null);
        const vapiApiKey = settings?.vapi?.apiKey || null;
        const updated = await syncCallFromVapi(transcript.vapiId, vapiApiKey).catch(() => null);
        if (updated) return res.json(updated);
    }

    res.json(transcript);
});

/**
 * POST /api/calls/sync/:vapiId
 * Manually sync a call's status and transcript from VAPI API.
 * Useful when the webhook was not reachable (e.g., localhost dev).
 */
export const syncCall = asyncHandler(async (req, res) => {
    const { vapiId } = req.params;

    // Verify the call belongs to this user
    const existing = await getTranscriptByVapiId(vapiId);
    if (!existing) {
        return res.status(404).json({ message: "Call not found" });
    }
    if (existing.userId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
    }

    const settings  = await UserSettings.findOne({ userId: req.user._id }).lean().catch(() => null);
    const vapiApiKey = settings?.vapi?.apiKey || null;

    const updated = await syncCallFromVapi(vapiId, vapiApiKey);
    if (!updated) {
        return res.status(404).json({ message: "No record found for this vapiId" });
    }
    res.json(updated);
});

/**
 * POST /api/calls/webhook/vapi
 * VAPI webhook — receives call status updates and transcript entries.
 * No JWT required (VAPI posts to this endpoint directly).
 *
 * VAPI event types we handle:
 *   status-update      → ringing / in-progress / ended
 *   end-of-call-report → final transcript + duration
 *   transcript         → incremental final-only lines
 *   hang               → treat as completed
 */
export const vapiWebhook = asyncHandler(async (req, res) => {
    const msg    = req.body?.message || req.body;
    const type   = msg?.type;
    const call   = msg?.call || {};
    const vapiId = call?.id || msg?.callId;

    // Always ack immediately so VAPI doesn't retry
    res.json({ received: true });

    if (!type || !vapiId) return;

    console.log(`[VAPI Webhook] type=${type} vapiId=${vapiId}`);

    // ── Status updates (status-update / call-update) ───────────────
    if (type === "status-update" || type === "call-update") {
        const STATUS_MAP = {
            queued:           "initiated",
            ringing:          "ringing",
            "in-progress":    "in-progress",
            forwarding:       "in-progress",
            ended:            "completed",
        };
        const rawStatus = msg?.status || call?.status || "";
        const status = STATUS_MAP[rawStatus];
        if (status) {
            await updateCallStatusByVapiId(vapiId, status).catch(console.error);
        }
        return;
    }

    // ── End-of-call report — has the complete transcript and duration ───
    if (type === "end-of-call-report") {
        const messages      = msg?.artifact?.messages || msg?.messages || [];
        const duration      = msg?.durationSeconds || call?.duration || msg?.duration || 0;
        // VAPI places the AI-generated summary in analysis.summary (newer API)
        const summary       = msg?.analysis?.summary || msg?.summary || msg?.artifact?.summary || null;
        const rawTranscript = msg?.artifact?.transcript || msg?.transcript || "";

        if (messages.length > 0) {
            // Structured messages — preferred
            await setFullTranscriptByVapiId(vapiId, messages, duration, summary).catch(console.error);
        } else if (typeof rawTranscript === "string" && rawTranscript.trim()) {
            // VAPI sent a plain-text transcript like:
            // "User: hi\nAI: hello\nUser: bye"
            const entries = rawTranscript
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                    const lower = line.toLowerCase();
                    if (lower.startsWith("user:") || lower.startsWith("caller:")) {
                        return { role: "caller", content: line.replace(/^[^:]+:\s*/i, ""), timestamp: new Date() };
                    }
                    return { role: "ai", content: line.replace(/^[^:]+:\s*/i, ""), timestamp: new Date() };
                })
                .filter((e) => e.content.length > 0);

            const update = { status: "completed" };
            if (entries.length) update.transcript = entries;
            if (duration)       update.duration   = duration;
            if (summary)        update.summary    = String(summary);
            await updateCallStatusByVapiId(vapiId, "completed", update).catch(console.error);
        } else {
            await updateCallStatusByVapiId(vapiId, "completed", { duration }).catch(console.error);
        }
        return;
    }

    // ── Incremental transcript lines (only store "final" to avoid noise) ──
    if (type === "transcript") {
        // transcriptType can be "partial" or "final" — only persist final
        if (msg?.transcriptType && msg.transcriptType !== "final") return;
        const role    = msg?.role === "user" ? "caller" : "ai";
        const content = msg?.transcript || "";
        if (content.trim()) {
            await addTranscriptEntryByVapiId(vapiId, role, content).catch(console.error);
        }
        return;
    }

    // ── Hang up ──────────────────────────────────────────────────
    if (type === "hang") {
        await updateCallStatusByVapiId(vapiId, "completed").catch(console.error);
    }
});

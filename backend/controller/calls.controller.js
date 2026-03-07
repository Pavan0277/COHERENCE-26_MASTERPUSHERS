import {
    listTranscriptsByUser,
    getTranscriptByCallId,
    updateCallStatusByVapiId,
    addTranscriptEntryByVapiId,
    setFullTranscriptByVapiId,
} from "../services/transcriptService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/calls/transcripts
 * List all call transcripts for the authenticated user.
 * Query params: workflowId, page, limit
 */
export const listTranscripts = asyncHandler(async (req, res) => {
    const userId     = req.user._id;
    const workflowId = req.query.workflowId || null;
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await listTranscriptsByUser(userId, { workflowId, page, limit });
    res.json(result);
});

/**
 * GET /api/calls/transcripts/:callId
 * Fetch a single transcript by callId.
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
    res.json(transcript);
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
    // Always ack immediately so VAPI doesn't retry
    res.json({ received: true });

    const msg    = req.body?.message || req.body;
    const type   = msg?.type;
    const call   = msg?.call || {};
    const vapiId = call?.id || msg?.callId;

    if (!type || !vapiId) return;

    console.log(`[VAPI Webhook] type=${type} vapiId=${vapiId}`);

    // ── Status updates ─────────────────────────────────────────────
    if (type === "status-update") {
        const STATUS_MAP = {
            queued:     "initiated",
            ringing:    "ringing",
            "in-progress": "in-progress",
            forwarding: "in-progress",
            ended:      "completed",
        };
        const status = STATUS_MAP[msg?.status];
        if (status) {
            await updateCallStatusByVapiId(vapiId, status).catch(console.error);
        }
        return;
    }

    // ── End-of-call report — has the complete transcript and duration ───
    if (type === "end-of-call-report") {
        const messages    = msg?.artifact?.messages || msg?.messages || [];
        const duration    = call?.duration || msg?.duration || 0;
        const summary     = msg?.summary   || msg?.artifact?.summary || null;
        const rawTranscript = msg?.artifact?.transcript || msg?.transcript || "";

        if (messages.length > 0) {
            // Structured messages — preferred
            await setFullTranscriptByVapiId(vapiId, messages, duration, summary).catch(console.error);
        } else if (typeof rawTranscript === "string" && rawTranscript.trim()) {
            // VAPI sent a plain-text transcript like:
            // "User: hi\nAI: hello\nUser: bye"
            // Parse each line into entries
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
            if (entries.length)   update.transcript = entries;
            if (duration)         update.duration   = duration;
            if (summary)          update.summary    = String(summary);
            await updateCallStatusByVapiId(vapiId, "completed", update).catch(console.error);
        } else {
            await updateCallStatusByVapiId(vapiId, "completed", { duration }).catch(console.error);
        }
        return;
    }

    // ── Incremental transcript lines (only store "final" to avoid noise) ──
    if (type === "transcript") {
        // transcriptType can be "partial" or "final" — only persist final
        if (msg?.transcriptType !== "final" && msg?.transcriptType) return;
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

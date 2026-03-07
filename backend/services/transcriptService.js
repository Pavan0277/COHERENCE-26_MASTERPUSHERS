import { CallTranscript } from "../models/CallTranscript.model.js";
import { fetchCallFromVapi } from "./vapi.service.js";

export async function createInitialTranscript(callId, vapiId, phoneNumber, userId, workflowId, leadId, options = {}) {
    return CallTranscript.create({
        callId,
        vapiId:      vapiId ? String(vapiId) : undefined,
        phoneNumber,
        userId,
        workflowId,
        leadId,
        status:      "initiated",
        transcript:  [],
        metadata:    options,   // stores { isFollowUp, assistantId } when provided
    });
}

export async function upsertTranscript(callId, update) {
    return CallTranscript.findOneAndUpdate(
        { callId },
        { $set: update },
        { upsert: true, new: true }
    );
}

export async function addTranscriptEntry(callId, role, content, metadata = {}) {
    return CallTranscript.findOneAndUpdate(
        { callId },
        { $push: { transcript: { role, content, timestamp: new Date(), ...metadata } } },
        { new: true }
    );
}

export async function updateCallStatus(callId, status, metadata = {}) {
    return CallTranscript.findOneAndUpdate(
        { callId },
        { $set: { status, ...metadata } },
        { new: true }
    );
}

/** Update status by VAPI call ID (used in webhook) */
export async function updateCallStatusByVapiId(vapiId, status, metadata = {}) {
    return CallTranscript.findOneAndUpdate(
        { vapiId },
        { $set: { status, ...metadata } },
        { new: true }
    );
}

/** Add a transcript entry by VAPI call ID (used in webhook) */
export async function addTranscriptEntryByVapiId(vapiId, role, content) {
    return CallTranscript.findOneAndUpdate(
        { vapiId },
        { $push: { transcript: { role, content, timestamp: new Date() } } },
        { new: true }
    );
}

/** Replace full transcript array by VAPI call ID (used in end-of-call-report) */
export async function setFullTranscriptByVapiId(vapiId, messages, duration, summary) {
    // Only keep user/assistant turns that have actual text content
    const SPEAKER_ROLES = new Set(["user", "assistant", "bot"]);
    const transcript = messages
        .filter((m) => SPEAKER_ROLES.has(m.role) && (m.message || m.content))
        .map((m) => ({
            role:      m.role === "user" ? "caller" : "ai",
            content:   String(m.message || m.content).trim(),
            timestamp: m.time        ? new Date(m.time * 1000)
                     : m.secondsFromStart ? new Date(Date.now()) : new Date(),
        }))
        .filter((e) => e.content.length > 0);

    const update = { status: "completed" };
    if (transcript.length > 0) update.transcript = transcript;
    if (duration)  update.duration = duration;
    if (summary)   update.summary  = String(summary).trim() || undefined;
    return CallTranscript.findOneAndUpdate(
        { vapiId },
        { $set: update },
        { new: true }
    );
}

export async function getTranscriptByCallId(callId) {
    return CallTranscript.findOne({ callId }).lean();
}

export async function getTranscriptByVapiId(vapiId) {
    return CallTranscript.findOne({ vapiId }).lean();
}

export async function listTranscriptsByUser(userId, { workflowId, page = 1, limit = 20 } = {}) {
    const query = { userId };
    if (workflowId) query.workflowId = workflowId;
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
        CallTranscript.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("leadId", "name phone email")
            .lean(),
        CallTranscript.countDocuments(query),
    ]);
    return { records, total, page, limit };
}

const VAPI_STATUS_MAP = {
    queued:        "initiated",
    ringing:       "ringing",
    "in-progress": "in-progress",
    forwarding:    "in-progress",
    ended:         "completed",
};

const SPEAKER_ROLES = new Set(["user", "assistant", "bot"]);

/**
 * Fetch latest call data from VAPI API and sync it to our DB.
 * Used for manual sync (when webhooks are unavailable on localhost)
 * and auto-sync on list/fetch.
 */
export async function syncCallFromVapi(vapiId, apiKeyOverride = null) {
    const data = await fetchCallFromVapi(vapiId, apiKeyOverride);

    const rawStatus = data.status || "";
    const status    = VAPI_STATUS_MAP[rawStatus] || rawStatus;

    // Extract messages from artifact (structured) or plain-text transcript
    const messages      = data.artifact?.messages || [];
    const rawTranscript = data.artifact?.transcript || data.transcript || "";
    const duration      = data.endedAt && data.startedAt
        ? Math.round((new Date(data.endedAt) - new Date(data.startedAt)) / 1000)
        : (data.duration || 0);
    const summary = data.analysis?.summary || data.summary || null;

    let transcript = [];

    if (messages.length > 0) {
        transcript = messages
            .filter((m) => SPEAKER_ROLES.has(m.role) && (m.message || m.content))
            .map((m) => ({
                role:      m.role === "user" ? "caller" : "ai",
                content:   String(m.message || m.content).trim(),
                timestamp: m.time ? new Date(m.time * 1000) : new Date(),
            }))
            .filter((e) => e.content.length > 0);
    } else if (typeof rawTranscript === "string" && rawTranscript.trim()) {
        transcript = rawTranscript
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const lower = line.toLowerCase();
                const isUser = lower.startsWith("user:") || lower.startsWith("caller:");
                return {
                    role:      isUser ? "caller" : "ai",
                    content:   line.replace(/^[^:]+:\s*/i, "").trim(),
                    timestamp: new Date(),
                };
            })
            .filter((e) => e.content.length > 0);
    }

    const update = { status };
    if (transcript.length > 0) update.transcript = transcript;
    if (duration > 0)          update.duration    = duration;
    if (summary)               update.summary     = String(summary);

    return CallTranscript.findOneAndUpdate(
        { vapiId },
        { $set: update },
        { new: true }
    );
}

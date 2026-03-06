/**
 * Voice Controller
 * Handles voice automation API. Supports both VAPI and Vonage (Nexmo).
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import { createOutboundCall as createVapiCall } from "../services/vapi/vapiService.js";
import { createOutboundCall as createVonageCall } from "../services/vonage/vonageService.js";
import {
    createInitialTranscript,
    createInitialTranscriptVonage,
    getTranscriptByUuid,
    getTranscriptByVapiId,
    addTranscriptEntry,
} from "../services/transcript/transcriptService.js";
import { CallTranscript } from "../models/CallTranscript.model.js";

/**
 * POST /api/v1/voice/call/vapi
 * Initiate outbound call via VAPI (requires auth)
 */
export const initiateCallVapi = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    const userId = req.user?._id;

    if (!phoneNumber) {
        return res.status(400).json({ message: "phoneNumber is required" });
    }

    const { callId, vapiId } = await createVapiCall(phoneNumber, null, null, userId);
    await createInitialTranscript(callId, vapiId, phoneNumber, userId);

    res.status(201).json({
        success: true,
        data: { callId, vapiId, phoneNumber },
    });
});

/**
 * POST /api/v1/voice/call/vonage
 * Initiate outbound call via Vonage (requires auth)
 */
export const initiateCallVonage = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    const userId = req.user?._id;

    if (!phoneNumber) {
        return res.status(400).json({ message: "phoneNumber is required" });
    }

    const { callId, uuid, greeting } = await createVonageCall(phoneNumber);
    await createInitialTranscriptVonage(callId, uuid, phoneNumber, userId, greeting);

    res.status(201).json({
        success: true,
        data: { callId, vonageUuid: uuid, phoneNumber },
    });
});

/**
 * POST /api/v1/voice/webhook/vonage/events
 * Vonage sends call events and recording webhooks here
 */
export const handleVonageWebhook = asyncHandler(async (req, res) => {
    const body = req.body || {};
    const uuid = body.uuid;
    const status = body.status;
    const recordingUrl = body.recording_url;

    if (!uuid) {
        return res.status(200).send();
    }

    const statusMap = {
        started: "initiated",
        ringing: "ringing",
        answered: "answered",
        completed: "ended",
        hangup: "ended",
        timeout: "failed",
        failed: "failed",
    };
    const newStatus = statusMap[status] || status;

    // Update call status
    await CallTranscript.findOneAndUpdate(
        { vonageUuid: uuid.toString() },
        { $set: { status: newStatus } },
        { upsert: false }
    ).catch(() => {});

    // Recording completed - store recording URL and add transcript entry
    if (recordingUrl) {
        const doc = await getTranscriptByUuid(uuid.toString());
        if (doc) {
            await CallTranscript.findOneAndUpdate(
                { vonageUuid: uuid.toString() },
                {
                    $set: {
                        status: "ended",
                        "metadata.recordingUrl": recordingUrl,
                        "metadata.endedAt": new Date(),
                    },
                },
                { upsert: false }
            );
            await addTranscriptEntry(
                doc.callId,
                "caller",
                `[Recording available - full conversation captured. URL: ${recordingUrl}]`
            );
        }
    }

    return res.status(200).send();
});

/**
 * POST /api/v1/voice/webhook/vapi
 * VAPI sends all events to this single webhook (Server URL) - kept for backwards compat
 */
export const handleVapiWebhook = asyncHandler(async (req, res) => {
    const body = req.body || {};
    const message = body.message || {};
    const type = message.type;
    const call = message.call || {};

    const vapiId = call.id || call.callId;
    const callId = vapiId ? `call_${vapiId.toString().slice(0, 8)}` : null;

    // Status updates
    if (type === "status-update") {
        const statusMap = {
            queued: "initiated",
            ringing: "ringing",
            "in-progress": "answered",
            ended: "ended",
            forwarding: "in_progress",
            scheduled: "initiated",
        };
        const newStatus = statusMap[message.status] || message.status || "in_progress";

        if (vapiId) {
            await CallTranscript.findOneAndUpdate(
                { vapiId: vapiId.toString() },
                { $set: { status: newStatus } },
                { upsert: false }
            ).catch(() => {});
        }
        return res.status(200).send();
    }

    // End-of-call report - store full transcript
    if (type === "end-of-call-report") {
        const artifact = message.artifact || {};
        const transcript = artifact.transcript || "";
        const messages = artifact.messages || [];
        const endedReason = message.endedReason || "unknown";

        if (vapiId) {
            const transcriptEntries = messages.map((m) => ({
                role: m.role === "user" ? "caller" : "ai",
                content: m.message || m.content || "",
                timestamp: new Date(),
            }));

            await CallTranscript.findOneAndUpdate(
                { vapiId: vapiId.toString() },
                {
                    $set: {
                        status: "ended",
                        transcript: transcriptEntries,
                        "metadata.endedAt": new Date(),
                        "metadata.endedReason": endedReason,
                        "metadata.rawTranscript": transcript,
                    },
                },
                { upsert: false }
            ).catch(() => {});
        }
        return res.status(200).send();
    }

    // Conversation update - append new messages in real time
    if (type === "conversation-update") {
        const messages = message.messages || [];
        if (vapiId && messages.length > 0) {
            const doc = await getTranscriptByVapiId(vapiId.toString());
            if (doc) {
                const existingLen = (doc.transcript || []).length;
                const newEntries = messages.slice(existingLen).map((m) => ({
                    role: m.role === "user" ? "caller" : "ai",
                    content: m.message || m.content || "",
                    timestamp: new Date(),
                }));
                for (const entry of newEntries) {
                    await addTranscriptEntry(doc.callId, entry.role, entry.content);
                }
            }
        }
        return res.status(200).send();
    }

    // Transcript (partial/final) - optional real-time capture
    if (type && type.startsWith("transcript")) {
        const role = message.role === "user" ? "caller" : "ai";
        const content = message.transcript || "";
        if (vapiId && content) {
            const doc = await getTranscriptByVapiId(vapiId.toString());
            if (doc && message.transcriptType === "final") {
                await addTranscriptEntry(doc.callId, role, content);
            }
        }
        return res.status(200).send();
    }

    res.status(200).send();
});

/**
 * GET /api/v1/voice/transcripts
 * List call transcripts (paginated, requires auth)
 */
export const listTranscripts = asyncHandler(async (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
        CallTranscript.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        CallTranscript.countDocuments(),
    ]);

    res.json({
        success: true,
        data: docs,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});

/**
 * GET /api/v1/voice/transcripts/:callId
 * Get single transcript by call ID
 */
export const getTranscript = asyncHandler(async (req, res) => {
    const { callId } = req.params;
    const doc = await CallTranscript.findOne({ callId }).lean();

    if (!doc) {
        return res.status(404).json({ message: "Transcript not found" });
    }

    res.json({ success: true, data: doc });
});

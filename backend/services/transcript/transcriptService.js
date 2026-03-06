/**
 * Conversation Transcript Storage Service
 * Stores and retrieves call transcripts with caller/AI messages and timestamps.
 */

import { CallTranscript } from "../../models/CallTranscript.model.js";

/**
 * Create or update call transcript
 */
export async function upsertTranscript(callId, update) {
    return CallTranscript.findOneAndUpdate(
        { callId },
        { $set: update },
        { upsert: true, new: true }
    );
}

/**
 * Add transcript entry (caller or AI message)
 */
export async function addTranscriptEntry(callId, role, content, metadata = {}) {
    const entry = {
        role,
        content,
        timestamp: new Date(),
        ...metadata,
    };
    return CallTranscript.findOneAndUpdate(
        { callId },
        { $push: { transcript: entry } },
        { new: true }
    );
}

/**
 * Get transcript by call ID
 */
export async function getTranscriptByCallId(callId) {
    return CallTranscript.findOne({ callId }).lean();
}

/**
 * Get transcript by Vonage UUID (legacy)
 */
export async function getTranscriptByUuid(uuid) {
    return CallTranscript.findOne({ vonageUuid: uuid }).lean();
}

/**
 * Get transcript by VAPI call ID
 */
export async function getTranscriptByVapiId(vapiId) {
    return CallTranscript.findOne({ vapiId }).lean();
}

/**
 * Update call status
 */
export async function updateCallStatus(callId, status, metadata = {}) {
    return CallTranscript.findOneAndUpdate(
        { callId },
        { $set: { status, ...metadata } },
        { new: true }
    );
}

/**
 * Create initial transcript record when call is initiated
 */
export async function createInitialTranscript(callId, vapiId, phoneNumber, userId = null) {
    return CallTranscript.create({
        callId,
        vapiId: vapiId ? String(vapiId) : undefined,
        phoneNumber,
        status: "initiated",
        transcript: [],
        metadata: { userId },
    });
}

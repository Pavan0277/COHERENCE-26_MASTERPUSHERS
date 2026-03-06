import mongoose from "mongoose";

const transcriptEntrySchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["caller", "ai"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const callTranscriptSchema = new mongoose.Schema(
    {
        callId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        vonageUuid: { type: String, index: true },
        vapiId: { type: String, index: true },
        phoneNumber: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["initiated", "ringing", "answered", "in_progress", "ended", "failed"],
            default: "initiated",
        },
        transcript: [transcriptEntrySchema],
        metadata: {
            workflowId: String,
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            duration: Number,
            endedAt: Date,
            endedReason: String,
            rawTranscript: String,
        },
    },
    { timestamps: true }
);

export const CallTranscript = mongoose.model("CallTranscript", callTranscriptSchema);

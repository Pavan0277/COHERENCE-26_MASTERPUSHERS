import mongoose from "mongoose";

const transcriptEntrySchema = new mongoose.Schema(
    {
        role:      { type: String, enum: ["caller", "ai", "system"], required: true },
        content:   { type: String, required: true, minlength: 1 },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const callTranscriptSchema = new mongoose.Schema(
    {
        callId:      { type: String, required: true, unique: true, index: true },
        vapiId:      { type: String, index: true },
        workflowId:  { type: mongoose.Schema.Types.ObjectId, ref: "Workflow", index: true },
        leadId:      { type: mongoose.Schema.Types.ObjectId, ref: "Lead", index: true },
        userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        phoneNumber: { type: String },
        status: {
            type:    String,
            enum:    ["initiated", "ringing", "in-progress", "completed", "failed", "no-answer"],
            default: "initiated",
        },
        duration:   { type: Number, default: 0 }, // seconds
        transcript: { type: [transcriptEntrySchema], default: [] },
        summary:    { type: String },
        metadata:   { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

export const CallTranscript = mongoose.model("CallTranscript", callTranscriptSchema);

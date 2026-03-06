import mongoose from "mongoose";

const messageLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        workflowId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workflow",
            required: true,
            index: true,
        },
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            index: true,
        },
        leadName: { type: String, default: "" },
        platform: {
            type: String,
            enum: ["email", "slack", "telegram"],
            required: true,
        },
        // "replied" can be set later via inbound webhook / reply tracking
        status: {
            type: String,
            enum: ["sent", "failed", "replied"],
            default: "sent",
        },
        error: { type: String, default: null },
        sentAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const MessageLog = mongoose.model("MessageLog", messageLogSchema);

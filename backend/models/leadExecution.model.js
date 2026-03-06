import mongoose from "mongoose";

const historyEntrySchema = new mongoose.Schema(
    {
        nodeId: { type: String, required: true },
        nodeType: { type: String },
        status: { type: String, enum: ["running", "completed", "failed", "skipped"] },
        executedAt: { type: Date, default: Date.now },
        error: { type: String, default: null },
    },
    { _id: false }
);

const leadExecutionSchema = new mongoose.Schema(
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
            required: true,
            index: true,
        },
        currentNode: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ["pending", "running", "completed", "failed"],
            default: "pending",
        },
        history: {
            type: [historyEntrySchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

leadExecutionSchema.index({ workflowId: 1, leadId: 1 }, { unique: true });

export const LeadExecution = mongoose.model("LeadExecution", leadExecutionSchema);

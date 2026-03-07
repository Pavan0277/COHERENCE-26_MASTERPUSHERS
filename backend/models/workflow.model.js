import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["upload", "filter", "ai_message", "send", "delay", "call", "webhook", "condition", "tag", "sms", "score", "notify", "split", "update_field", "ai_classify", "whatsapp", "linkedin", "wait_until", "transform", "stop", "enrich", "meeting", "http_request"],
        },
        config: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { _id: false }
);

const workflowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, "Workflow name is required"],
        trim: true,
    },
    nodes: {
        type: [nodeSchema],
        default: [],
    },
    edges: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Workflow = mongoose.model("Workflow", workflowSchema);

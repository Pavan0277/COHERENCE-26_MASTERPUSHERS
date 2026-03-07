import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
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
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        company: {
            type: String,
            trim: true,
        },
        title: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        telegram_id: {
            type: String,
            trim: true,
        },
        tags: [
            {
                name:    { type: String, required: true },
                color:   { type: String, default: "#6366f1" },
                addedAt: { type: Date,   default: Date.now },
                _id:     false,
            },
        ],
        score: {
            type: Number,
            default: 0,
        },
        extra: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

export const Lead = mongoose.model("Lead", leadSchema);

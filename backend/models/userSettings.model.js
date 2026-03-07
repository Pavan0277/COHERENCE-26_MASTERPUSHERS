import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        email: {
            host:   { type: String, default: "smtp.gmail.com" },
            port:   { type: Number, default: 587 },
            secure: { type: Boolean, default: false },
            user:   { type: String, default: "" },
            pass:   { type: String, default: "" },
            from:   { type: String, default: "" },
        },
        slack: {
            webhookUrl: { type: String, default: "" },
        },
        telegram: {
            botToken:      { type: String, default: "" },
            chatId:        { type: String, default: "" },
            // User API (MTProto) — needed for sending by phone number
            apiId:         { type: Number, default: 0 },
            apiHash:       { type: String, default: "" },
            sessionString: { type: String, default: "" },
        },
        vapi: {
            apiKey:        { type: String, default: "" },
            assistantId:   { type: String, default: "" },
            phoneNumberId: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

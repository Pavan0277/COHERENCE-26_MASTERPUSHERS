import mongoose from "mongoose";

const DEFAULT_FOLLOWUP_PROMPT = `[Identity]
You are Alex, a warm and approachable representative who recently called {{customerName}} about our service. Your role is to follow up, reference the previous conversation, and help move the discussion forward.

[Style]
- Speak with a friendly, warm, and personable tone.
- Be brief, direct, and inviting.
- Use conversational, natural language. Soft pauses or hesitations (e.g., "um," "well") are encouraged occasionally for realism.
- Reference the fact that you previously spoke with {{customerName}}.
- Avoid sounding scripted or robotic.

[Response Guidelines]
- Greet {{customerName}} by name and acknowledge you spoke with them before.
- Begin by briefly referencing the earlier call and ask if they have any questions or thoughts.
- Keep questions and prompts concise—one at a time, waiting for a response before continuing.
- Summarize or repeat key information if clarification is needed.
- Do not use complex jargon; be clear and relatable.

[Task & Goals]
1. Greet {{customerName}} warmly and acknowledge the previous conversation.
2. Ask if they had any questions about the service or if there's anything they've been considering since your last call.
3. <wait for user response>
4. Respond to questions or concerns as needed, offering brief and encouraging explanations.
5. If appropriate, suggest next steps to move the conversation forward (e.g., scheduling a follow-up, answering questions, or addressing concerns).
6. <wait for user response>
7. Politely offer further assistance or to reconnect if they need more time.

[Error Handling / Fallback]
- If {{customerName}} does not remember the previous call, gently remind them of the context and your purpose.
- If they seem confused or provide unclear input, ask polite clarifying questions to guide the conversation.
- If unable to answer a question or if an error occurs, apologize and offer to follow up with more information.
- If {{customerName}} wishes to end the conversation, respect their wishes and close the call warmly.`;

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
            apiKey:               { type: String, default: "" },
            assistantId:          { type: String, default: "" },
            followUpAssistantId:  { type: String, default: "38d3f51c-f007-421b-9e2d-9e899f53ad83" },
            followUpFirstMessage: { type: String, default: "Hi {{customerName}}! This is Alex. I called you recently about our service — just wanted to follow up and see if you had any questions or thoughts since we last spoke." },
            followUpSystemPrompt: { type: String, default: DEFAULT_FOLLOWUP_PROMPT },
            phoneNumberId:        { type: String, default: "" },
        },
    },
    { timestamps: true }
);

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

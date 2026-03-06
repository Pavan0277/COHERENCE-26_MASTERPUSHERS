import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendEmail(lead, message) {
    if (!lead.email) {
        throw new Error("Lead has no email address");
    }

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: lead.email,
        subject: `Hi ${lead.name || "there"}`,
        text: message,
    });

    return { provider: "email", messageId: info.messageId };
}

async function sendSlack(lead, message) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
        throw new Error("SLACK_WEBHOOK_URL is not configured");
    }

    const text = `*Outreach to ${lead.name || "N/A"}* (${lead.company || "N/A"})\n\n${message}`;

    const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) {
        throw new Error(`Slack webhook failed: ${res.statusText}`);
    }

    return { provider: "slack", status: "sent" };
}

async function sendTelegram(lead, message) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required");
    }

    const text = `Outreach to ${lead.name || "N/A"} (${lead.company || "N/A"})\n\n${message}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
    });

    const data = await res.json();

    if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description}`);
    }

    return { provider: "telegram", messageId: data.result.message_id };
}

const platformHandlers = {
    email: sendEmail,
    slack: sendSlack,
    telegram: sendTelegram,
};

/**
 * Send a message via the specified platform.
 *
 * @param {"email" | "slack" | "telegram"} platform
 * @param {Object} lead - Lead object with name, email, company, title
 * @param {string} message - The message text to send
 * @returns {Promise<Object>} result with provider-specific info
 */
export async function sendMessage(platform, lead, message) {
    const handler = platformHandlers[platform?.toLowerCase()];

    if (!handler) {
        throw new Error(
            `Unsupported platform: "${platform}". Supported: email, slack, telegram`
        );
    }

    return handler(lead, message);
}

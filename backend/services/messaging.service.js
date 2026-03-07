import nodemailer from "nodemailer";
import { sendTelegramByPhone } from "./telegramUser.service.js";

// Lazily created so dotenv has loaded before the env vars are read.
// Per-user credentials (from UserSettings) override the env defaults.
function getTransporter(creds = {}) {
    return nodemailer.createTransport({
        host:   creds.host   || process.env.SMTP_HOST,
        port:   Number(creds.port   || process.env.SMTP_PORT)  || 587,
        secure: creds.secure ?? (process.env.SMTP_SECURE === "true"),
        auth: {
            user: creds.user || process.env.SMTP_USER,
            pass: creds.pass || process.env.SMTP_PASS,
        },
    });
}

async function sendEmail(lead, message, credentials = {}) {
    if (!lead.email) {
        throw new Error("Lead has no email address");
    }

    const emailCreds = credentials.email || {};
    const fromAddr   = emailCreds.from || emailCreds.user || process.env.SMTP_FROM || process.env.SMTP_USER;

    const info = await getTransporter(emailCreds).sendMail({
        from:    fromAddr,
        to:      lead.email,
        subject: `Hi ${lead.name || "there"}`,
        text:    message,
    });

    return { provider: "email", messageId: info.messageId };
}

async function sendSlack(lead, message, credentials = {}) {
    const webhookUrl = credentials.slack?.webhookUrl || process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl || webhookUrl.includes("your/webhook")) {
        throw new Error("Slack webhook URL is not configured. Go to Settings → Slack and add your webhook URL.");
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

async function sendTelegram(lead, message, credentials = {}) {
    const tg = credentials.telegram || {};

    // ── User API path (gramjs): works with phone numbers ──────────────────────
    const hasUserSession = tg.sessionString && tg.apiId && tg.apiHash;
    if (hasUserSession) {
        const phone = lead.phone?.trim() || lead.telegram_id?.trim();
        if (!phone) {
            throw new Error(
                `Lead "${lead.name || "N/A"}" has no phone number. ` +
                "Add a 'phone' column to your CSV with the lead's international phone number (e.g. +91XXXXXXXXXX)."
            );
        }
        return sendTelegramByPhone(tg.sessionString, tg.apiId, tg.apiHash, phone, message);
    }

    // ── Bot API fallback: needs chat_id, not a phone number ───────────────────
    const botToken = tg.botToken || process.env.TELEGRAM_BOT_TOKEN;
    const fallbackChatId = tg.chatId || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || botToken.includes("your_telegram")) {
        throw new Error("Telegram Bot Token is not configured. Go to Settings → Telegram and add your Bot Token.");
    }

    const chatId = lead.phone?.trim() || lead.telegram_id?.trim() || fallbackChatId;

    if (!chatId) {
        throw new Error(
            `No Telegram chat ID found for lead "${lead.name || "N/A"}". ` +
            "Either configure the User API Session (to send by phone) or set a fallback Chat ID in Settings → Telegram."
        );
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
        const desc = data.description || "unknown error";
        if (desc.toLowerCase().includes("chat not found")) {
            throw new Error(
                `Telegram: chat not found for "${lead.name || chatId}". ` +
                "To send by phone number, configure the User API Session in Settings → Telegram."
            );
        }
        throw new Error(`Telegram API error: ${desc}`);
    }

    return { provider: "telegram", messageId: data.result.message_id };
}

async function sendSms(lead, message, credentials = {}) {
    const phone = lead.phone?.trim();
    if (!phone) {
        throw new Error(`Lead "${lead.name || "N/A"}" has no phone number for SMS.`);
    }

    const sid   = credentials.sms?.accountSid  || process.env.TWILIO_ACCOUNT_SID;
    const token = credentials.sms?.authToken   || process.env.TWILIO_AUTH_TOKEN;
    const from  = credentials.sms?.from        || process.env.TWILIO_FROM_NUMBER || "";

    if (!sid || !token) {
        throw new Error("Twilio credentials are not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
    }
    if (!from) {
        throw new Error("Twilio From number is not configured. Set TWILIO_FROM_NUMBER in .env or provide it in the SMS node config.");
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const body = new URLSearchParams({ To: phone, From: from, Body: message }).toString();

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        },
        body,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(`Twilio SMS error: ${data.message || res.statusText}`);
    }

    return { provider: "sms", messageId: data.sid, status: data.status };
}

export async function sendWhatsApp(lead, message, credentials = {}) {
    const phone = lead.phone?.trim();
    if (!phone) {
        throw new Error(`Lead "${lead.name || "N/A"}" has no phone number for WhatsApp.`);
    }

    const sid   = credentials.sms?.accountSid  || process.env.TWILIO_ACCOUNT_SID;
    const token = credentials.sms?.authToken   || process.env.TWILIO_AUTH_TOKEN;
    const rawFrom = credentials.sms?.from      || process.env.TWILIO_FROM_NUMBER || "";

    if (!sid || !token) {
        throw new Error("Twilio credentials are not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.");
    }
    if (!rawFrom) {
        throw new Error("Twilio From number is not configured.");
    }

    const from = rawFrom.startsWith("whatsapp:") ? rawFrom : `whatsapp:${rawFrom}`;
    const to   = phone.startsWith("whatsapp:")   ? phone   : `whatsapp:${phone}`;

    const url  = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const body = new URLSearchParams({ To: to, From: from, Body: message }).toString();

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        },
        body,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(`Twilio WhatsApp error: ${data.message || res.statusText}`);
    }

    return { provider: "whatsapp", messageId: data.sid, status: data.status };
}

const platformHandlers = {
    email:    sendEmail,
    slack:    sendSlack,
    telegram: sendTelegram,
    sms:      sendSms,
};

/**
 * Send a message via the specified platform.
 *
 * @param {"email" | "slack" | "telegram" | "sms"} platform
 * @param {Object} lead - Lead object with name, email, company, title
 * @param {string} message - The message text to send
 * @returns {Promise<Object>} result with provider-specific info
 */
export async function sendMessage(platform, lead, message, credentials = {}) {
    const handler = platformHandlers[platform?.toLowerCase()];

    if (!handler) {
        throw new Error(
            `Unsupported platform: "${platform}". Supported: email, slack, telegram, sms`
        );
    }

    return handler(lead, message, credentials);
}

export { sendSms };

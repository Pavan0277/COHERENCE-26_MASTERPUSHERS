/**
 * Vonage (Nexmo) Voice API Service
 * Handles outbound calls via Vonage Voice API.
 * Uses NCCO for call flow: talk + record. Transcripts from recording webhook.
 */

import jwt from "jsonwebtoken";
import crypto from "crypto";

const VONAGE_API_BASE = "https://api.nexmo.com/v1/calls";

/**
 * Normalize phone number to E.164 (digits only for Vonage)
 * India: 91 + 10 digits (e.g. 918208061528 or 8208061528 -> 918208061528)
 */
function normalizePhoneNumber(num) {
    if (!num || typeof num !== "string") return num;
    let n = num.replace(/\D/g, "");
    if (n.startsWith("91") && n.length === 12) return n;
    if (n.length === 10 && !n.startsWith("0")) return `91${n}`;
    return n.replace(/\D/g, "");
}

function getConfig() {
    const appId = process.env.VONAGE_APPLICATION_ID;
    const privateKey = process.env.VONAGE_PRIVATE_KEY;
    const fromNumber = process.env.VONAGE_FROM_NUMBER;
    const webhookBase = process.env.WEBHOOK_BASE_URL || "http://localhost:3000";

    if (!appId) throw new Error("VONAGE_APPLICATION_ID not configured");
    if (!privateKey) throw new Error("VONAGE_PRIVATE_KEY not configured");
    if (!fromNumber) throw new Error("VONAGE_FROM_NUMBER not configured");

    const key = privateKey.replace(/\\n/g, "\n");
    return { appId, privateKey: key, fromNumber, webhookBase };
}

/**
 * Generate Vonage JWT for API authentication
 */
function generateVonageJwt(appId, privateKey) {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        application_id: appId,
        iat: now,
        nbf: now,
        exp: now + 86400, // 24h
        jti: crypto.randomUUID(),
    };
    return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}

/**
 * Create outbound call via Vonage Voice API
 * NCCO: talk (greeting) + record (captures conversation for transcript)
 * @param {string} toNumber - Phone number to call
 * @param {string} [greeting] - Optional custom greeting text
 * @returns {Promise<{ callId: string, uuid: string }>}
 */
export async function createOutboundCall(toNumber, greeting = null) {
    const { appId, privateKey, fromNumber, webhookBase } = getConfig();
    const normalizedTo = normalizePhoneNumber(toNumber);
    const fromNum = fromNumber.replace(/\D/g, "");
    const talkText = greeting || "Hello from Voice API. This call is being recorded for your records.";
    const eventUrl = `${webhookBase}/api/v1/voice/webhook/vonage/events`;

    const ncco = [
        {
            action: "talk",
            text: talkText,
            language: "en-US",
            style: 0,
        },
        {
            action: "record",
            eventUrl: [eventUrl],
            beepStart: true,
            endOnSilence: 3,
        },
    ];

    const body = {
        from: { type: "phone", number: fromNum },
        to: [{ type: "phone", number: normalizedTo }],
        ncco,
        event_url: [eventUrl],
    };

    const token = generateVonageJwt(appId, privateKey);

    console.log("[Vonage] Initiating call to:", normalizedTo, "| from:", fromNum);
    const response = await fetch(VONAGE_API_BASE, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errText = await response.text();
        let errMsg = `Vonage API error ${response.status}`;
        try {
            const errJson = JSON.parse(errText);
            errMsg = errJson.message || errJson.error || errMsg;
        } catch {
            errMsg = errText || errMsg;
        }
        throw new Error(errMsg);
    }

    const data = await response.json();
    const uuid = data.uuid;
    const callId = `call_${Date.now()}_${(uuid || "unknown").toString().slice(0, 8)}`;

    console.log("[Vonage] Call created:", callId, "| uuid:", uuid);
    return {
        callId,
        uuid: uuid?.toString?.() || String(uuid),
        greeting: talkText,
    };
}

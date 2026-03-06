/**
 * VAPI Voice AI Service Layer
 * Handles outbound calls via VAPI (free tier available).
 * VAPI provides built-in speech recognition, AI conversation, and TTS.
 */

const VAPI_API_BASE = "https://api.vapi.ai";

/**
 * Normalize phone number to E.164 format
 * India: +91 + 10 digits (e.g. 918208061528 -> +91918208061528)
 */
function normalizePhoneNumber(num) {
    if (!num || typeof num !== "string") return num;
    let n = num.replace(/\D/g, "");
    if (n.startsWith("91") && n.length === 12) {
        return `+${n}`;
    }
    if (n.length === 10 && !n.startsWith("0")) {
        return `+91${n}`;
    }
    return num.startsWith("+") ? num : `+${num.replace(/\D/g, "")}`;
}

function getApiKey() {
    const key = process.env.VAPI_API_KEY;
    if (!key) {
        throw new Error("VAPI_API_KEY not configured. Get your key from dashboard.vapi.ai");
    }
    return key;
}

/**
 * Initiate outbound call via VAPI
 * @param {string} toNumber - Phone number to call (E.164 format, e.g. +15551234567)
 * @param {string} [assistantId] - VAPI assistant ID (optional, uses env default)
 * @param {string} [phoneNumberId] - VAPI phone number ID (optional, uses env default)
 * @param {string} [userId] - Optional user ID for transcript association
 * @returns {Promise<{ callId: string, vapiId: string }>}
 */
export async function createOutboundCall(toNumber, assistantId = null, phoneNumberId = null, userId = null) {
    const apiKey = getApiKey();
    const assistant = assistantId || process.env.VAPI_ASSISTANT_ID;
    const phoneNumId = phoneNumberId || process.env.VAPI_PHONE_NUMBER_ID;

    if (!assistant) {
        throw new Error("VAPI_ASSISTANT_ID not configured. Create an assistant at dashboard.vapi.ai");
    }
    if (!phoneNumId) {
        throw new Error("VAPI_PHONE_NUMBER_ID not configured. Use a free VAPI number or import one.");
    }

    const normalizedNumber = normalizePhoneNumber(toNumber);
    const body = {
        assistantId: assistant,
        phoneNumberId: phoneNumId,
        customer: { number: normalizedNumber },
        assistantOverrides: {
            transportConfigurations: [
                {
                    provider: "twilio",
                    timeout: 120, // Ring for 2 minutes before assuming no answer (default 60s)
                },
            ],
        },
    };

    console.log("[VAPI] Initiating call to:", normalizedNumber, "| phoneNumberId:", phoneNumId);
    const response = await fetch(`${VAPI_API_BASE}/call`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errText = await response.text();
        let errMsg = `VAPI API error ${response.status}`;
        try {
            const errJson = JSON.parse(errText);
            errMsg = errJson.message || errJson.error || errMsg;
        } catch {
            errMsg = errText || errMsg;
        }
        throw new Error(errMsg);
    }

    const data = await response.json();
    const vapiId = data.id || data.callId;
    const callId = `call_${Date.now()}_${(vapiId || "unknown").toString().slice(0, 8)}`;

    console.log("[VAPI] Call created:", callId, "| vapiId:", vapiId);
    return { callId, vapiId: vapiId?.toString?.() || String(vapiId) };
}

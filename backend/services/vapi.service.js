/**
 * VAPI Voice AI Service Layer
 * Handles outbound calls via VAPI (free tier available).
 */

const VAPI_API_BASE = "https://api.vapi.ai";

function normalizePhoneNumber(num) {
    if (!num || typeof num !== "string") return num;
    let n = num.replace(/\D/g, "");
    if (n.startsWith("91") && n.length === 12) return `+${n}`;
    if (n.length === 10 && !n.startsWith("0")) return `+91${n}`;
    return num.startsWith("+") ? num : `+${num.replace(/\D/g, "")}`;
}

function getApiKey(override) {
    const key = override || process.env.VAPI_API_KEY;
    if (!key) throw new Error("VAPI_API_KEY not configured. Get your key from dashboard.vapi.ai");
    return key;
}

/**
 * Initiate outbound call via VAPI
 * @param {string} toNumber
 * @param {string|null} assistantId
 * @param {string|null} phoneNumberId
 * @param {string|null} apiKeyOverride  - per-user API key from UserSettings (overrides env)
 * @returns {Promise<{ callId: string, vapiId: string }>}
 */
export async function createOutboundCall(toNumber, assistantId = null, phoneNumberId = null, apiKeyOverride = null) {
    const apiKey     = getApiKey(apiKeyOverride);
    const assistant  = assistantId   || process.env.VAPI_ASSISTANT_ID;
    const phoneNumId = phoneNumberId || process.env.VAPI_PHONE_NUMBER_ID;

    if (!assistant)  throw new Error("VAPI_ASSISTANT_ID not configured. Create an assistant at dashboard.vapi.ai");
    if (!phoneNumId) throw new Error("VAPI_PHONE_NUMBER_ID not configured.");

    const normalizedNumber = normalizePhoneNumber(toNumber);

    // Build the webhook URL so VAPI knows where to POST events.
    // BACKEND_URL must be set to the publicly reachable URL of this server
    // (e.g. your ngrok URL or deployed domain). Falls back to SERVER_URL.
    const backendUrl = (process.env.BACKEND_URL || process.env.SERVER_URL || "").replace(/\/+$/, "");
    const webhookUrl = backendUrl ? `${backendUrl}/api/calls/webhook/vapi` : undefined;

    const body = {
        assistantId:  assistant,
        phoneNumberId: phoneNumId,
        customer: { number: normalizedNumber },
        ...(webhookUrl && { serverUrl: webhookUrl }),
        assistantOverrides: {
            transportConfigurations: [
                { provider: "twilio", timeout: 120 },
            ],
            ...(webhookUrl && { server: { url: webhookUrl } }),
        },
    };

    console.log("[VAPI] Initiating call to:", normalizedNumber);

    const response = await fetch(`${VAPI_API_BASE}/call`, {
        method: "POST",
        headers: {
            Authorization:  `Bearer ${apiKey}`,
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

    const data   = await response.json();
    const vapiId = data.id || data.callId;
    const callId = `call_${Date.now()}_${(vapiId || "unknown").toString().slice(0, 8)}`;

    console.log("[VAPI] Call created:", callId, "| vapiId:", vapiId);
    return { callId, vapiId: vapiId?.toString?.() || String(vapiId) };
}

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
 * @param {object} leadContext          - optional lead fields forwarded as variableValues to the assistant
 * @returns {Promise<{ callId: string, vapiId: string }>}
 */
export async function createOutboundCall(toNumber, assistantId = null, phoneNumberId = null, apiKeyOverride = null, leadContext = {}) {
    const apiKey     = getApiKey(apiKeyOverride);
    const assistant  = assistantId   || process.env.VAPI_ASSISTANT_ID;
    const phoneNumId = phoneNumberId || process.env.VAPI_PHONE_NUMBER_ID;

    if (!assistant)  throw new Error("VAPI_ASSISTANT_ID not configured. Create an assistant at dashboard.vapi.ai");
    if (!phoneNumId) throw new Error("VAPI_PHONE_NUMBER_ID not configured.");

    const normalizedNumber = normalizePhoneNumber(toNumber);

    const backendUrl = (process.env.BACKEND_URL || process.env.SERVER_URL || "").replace(/\/+$/, "");
    const webhookUrl = backendUrl ? `${backendUrl}/api/calls/webhook/vapi` : undefined;

    // Build variableValues from lead context so the assistant can say the lead's name, company etc.
    const variableValues = {};
    if (leadContext.name)    variableValues.customerName    = leadContext.name;
    if (leadContext.company) variableValues.customerCompany = leadContext.company;
    if (leadContext.email)   variableValues.customerEmail   = leadContext.email;
    const hasVariables = Object.keys(variableValues).length > 0;

    const body = {
        assistantId:   assistant,
        phoneNumberId: phoneNumId,
        customer:      { number: normalizedNumber },
        assistantOverrides: {
            ...(webhookUrl && { server: { url: webhookUrl } }),
            ...(hasVariables && { variableValues }),
        },
    };

    // Override system prompt for follow-up calls: substitute {{customerName}} etc. before sending
    if (leadContext.systemPrompt) {
        const substituted = leadContext.systemPrompt
            .replace(/\{\{customerName\}\}/g,    variableValues.customerName    || "there")
            .replace(/\{\{customerCompany\}\}/g, variableValues.customerCompany || "")
            .replace(/\{\{customerEmail\}\}/g,   variableValues.customerEmail   || "");
        body.assistantOverrides.model = {
            messages: [{ role: "system", content: substituted }],
        };
    }

    // Override first message — this is the very first thing the caller hears
    if (leadContext.firstMessage) {
        const substitutedFirst = leadContext.firstMessage
            .replace(/\{\{customerName\}\}/g,    variableValues.customerName    || "there")
            .replace(/\{\{customerCompany\}\}/g, variableValues.customerCompany || "")
            .replace(/\{\{customerEmail\}\}/g,   variableValues.customerEmail   || "");
        body.assistantOverrides.firstMessage = substitutedFirst;
    }

    console.log("[VAPI] Initiating call to:", normalizedNumber, "| assistant:", assistant);

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

/**
 * Fetch a single call from VAPI API (used for manual sync / polling)
 * @param {string} vapiId  - VAPI's call UUID
 * @param {string|null} apiKeyOverride
 * @returns {Promise<object>} raw VAPI call object
 */
export async function fetchCallFromVapi(vapiId, apiKeyOverride = null) {
    const apiKey = getApiKey(apiKeyOverride);
    const response = await fetch(`${VAPI_API_BASE}/call/${vapiId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`VAPI fetch error ${response.status}: ${errText}`);
    }
    return response.json();
}

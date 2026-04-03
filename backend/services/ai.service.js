import OpenAI from "openai";

const ALLOWED_NODE_TYPES = new Set([
    "upload",
    "filter",
    "ai_message",
    "send",
    "delay",
    "call",
    "webhook",
    "condition",
    "tag",
    "sms",
    "score",
    "notify",
    "split",
    "update_field",
    "ai_classify",
    "whatsapp",
    "linkedin",
    "wait_until",
    "transform",
    "stop",
    "enrich",
    "meeting",
    "http_request",
]);

// Lazily instantiated so dotenv has loaded before this runs
function getClient() {
    return new OpenAI({
        apiKey: process.env.SARVAM_API_KEY,
        baseURL: "https://api.sarvam.ai/v1",
    });
}

const WORKFLOW_SYSTEM_PROMPT = `You are a workflow builder assistant. When given a description of a workflow, respond ONLY with a valid JSON object — no explanation, no markdown, no code fences.

The JSON must have this exact structure:
{
  "name": string,
  "nodes": [
    {
      "id": string (unique, e.g. "node_1"),
      "type": "upload" | "filter" | "ai_message" | "send" | "delay" | "call" | "webhook" | "condition" | "tag" | "sms" | "score" | "notify" | "split",
      "config": object
    }
  ],
  "edges": [
    { "source": string, "target": string }
  ]
}

Node config rules:
- upload: {} (no config needed)
- filter: { "filters": [{ "column": string, "operator": "equals|not_equals|contains|greater_than|less_than", "value": string }] }
- ai_message: { "instructions": string }
- send: { "platform": "email" | "slack" | "telegram", "followup": boolean (optional) }
- delay: { "min": number (seconds), "max": number (seconds) }
- call: { "assistantId": string (optional), "phoneNumberId": string (optional) }
- webhook: { "url": string, "method": "POST" | "PUT" | "PATCH" | "GET" }
- condition: { "column": string, "operator": "equals|not_equals|contains|greater_than|less_than|is_empty|not_empty", "value": string }
- tag: { "tag": string, "color": string (hex color, e.g. "#6366f1") }
- sms: { "message": string (leave empty to use AI-generated message from a preceding ai_message node), "from": string (optional Twilio From number override) }
- score: { "value": number, "operation": "add" | "subtract" | "set" }
- notify: { "channel": "email" | "slack", "message": string (may use {name}, {email}, {company}, {title} placeholders), "subject": string (email only) }
- split: { "percentage": number (1–99, % of leads that continue; the rest are skipped) }

Node descriptions:
- upload: Entry point. Imports CSV leads into the workflow.
- filter: Filters leads by matching column values — leads that don't match are dropped.
- ai_message: Uses AI to generate a personalised outreach message for each lead.
- send: Sends the generated message via email, Slack, or Telegram.
- delay: Waits a random time between min and max seconds before continuing.
- call: Places an outbound AI voice call to the lead's phone number using VAPI.
- webhook: POSTs the lead's data as JSON to an external URL (CRM, Zapier, etc).
- condition: Passes leads through only if they match a specific field condition; otherwise skips.
- tag: Attaches a colour-coded label/tag to the lead for CRM categorisation.
- sms: Sends an SMS to the lead's phone number via Twilio. Place after ai_message to send the AI-generated text.
- score: Adds, subtracts, or sets a numeric score on the lead (useful for lead qualification).
- notify: Sends an internal alert to the workflow owner (not the lead) via email or Slack — useful at important milestones.
- split: Randomly lets only a percentage of leads through (A/B testing or volume limiting).

Always connect nodes using edges from first to last in sequence.
Return ONLY the raw JSON object.`;

function safeContentToString(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") return part;
                if (part && typeof part === "object" && "text" in part) {
                    const txt = part.text;
                    return typeof txt === "string" ? txt : "";
                }
                return "";
            })
            .join("\n")
            .trim();
    }
    return "";
}

function extractJsonCandidate(raw) {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced?.[1]) return fenced[1].trim();

    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        return raw.slice(firstBrace, lastBrace + 1).trim();
    }

    return raw.trim();
}

function sanitizeJson(candidate) {
    return candidate
        .replace(/^\uFEFF/, "")
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/,\s*([}\]])/g, "$1")
        .trim();
}

function parseAiWorkflowJson(raw) {
    const candidate = extractJsonCandidate(raw);
    const attempts = [candidate, sanitizeJson(candidate)].filter(Boolean);

    for (const attempt of attempts) {
        try {
            const parsed = JSON.parse(attempt);
            if (typeof parsed === "string") {
                return JSON.parse(parsed);
            }
            return parsed;
        } catch {
            // try next strategy
        }
    }

    return null;
}

function inferDelaySeconds(prompt) {
    const dayMatch = prompt.match(/(\d+)\s*day/i);
    if (dayMatch) {
        const days = Number(dayMatch[1]);
        if (Number.isFinite(days) && days > 0) {
            const seconds = days * 24 * 60 * 60;
            return { min: seconds, max: seconds + 3600 };
        }
    }

    const hourMatch = prompt.match(/(\d+)\s*hour/i);
    if (hourMatch) {
        const hours = Number(hourMatch[1]);
        if (Number.isFinite(hours) && hours > 0) {
            const seconds = hours * 60 * 60;
            return { min: seconds, max: seconds + 900 };
        }
    }

    return { min: 3600, max: 7200 };
}

function buildFallbackWorkflow(prompt) {
    const p = (prompt || "").toLowerCase();
    const nodes = [{ id: "node_1", type: "upload", config: {} }];

    if (/filter|segment|only|manager|cto|title|role/.test(p)) {
        const filterValue = p.includes("manager") ? "manager" : "";
        nodes.push({
            id: `node_${nodes.length + 1}`,
            type: "filter",
            config: filterValue
                ? {
                      filters: [
                          {
                              column: "title",
                              operator: "contains",
                              value: filterValue,
                          },
                      ],
                  }
                : { filters: [] },
        });
    }

    if (/ai|generate|personal|message|email|outreach/.test(p)) {
        nodes.push({
            id: `node_${nodes.length + 1}`,
            type: "ai_message",
            config: {
                instructions: "Generate a short personalized outreach message.",
            },
        });
    }

    if (/delay|wait|follow\s*-?up|followup/.test(p)) {
        nodes.push({
            id: `node_${nodes.length + 1}`,
            type: "delay",
            config: inferDelaySeconds(prompt),
        });
    }

    let platform = "email";
    if (/slack/.test(p)) platform = "slack";
    else if (/telegram/.test(p)) platform = "telegram";

    nodes.push({
        id: `node_${nodes.length + 1}`,
        type: "send",
        config: {
            platform,
            followup: /follow\s*-?up|followup/.test(p),
        },
    });

    const edges = nodes.slice(0, -1).map((node, idx) => ({
        source: node.id,
        target: nodes[idx + 1].id,
    }));

    return {
        name: "AI Generated Workflow",
        nodes,
        edges,
    };
}

function normalizeWorkflow(parsedWorkflow, prompt) {
    if (!parsedWorkflow || typeof parsedWorkflow !== "object") {
        return buildFallbackWorkflow(prompt);
    }

    const rawNodes = Array.isArray(parsedWorkflow.nodes)
        ? parsedWorkflow.nodes
        : [];
    const normalizedNodes = rawNodes
        .map((node, idx) => {
            const type =
                typeof node?.type === "string"
                    ? node.type.trim().toLowerCase()
                    : "";
            if (!ALLOWED_NODE_TYPES.has(type)) return null;

            const id =
                typeof node?.id === "string" && node.id.trim()
                    ? node.id.trim()
                    : `node_${idx + 1}`;
            const config =
                node?.config && typeof node.config === "object"
                    ? node.config
                    : {};

            return { id, type, config };
        })
        .filter(Boolean);

    if (!normalizedNodes.length) {
        return buildFallbackWorkflow(prompt);
    }

    const validIds = new Set(normalizedNodes.map((n) => n.id));
    const rawEdges = Array.isArray(parsedWorkflow.edges)
        ? parsedWorkflow.edges
        : [];
    const normalizedEdges = rawEdges
        .map((edge) => {
            const source =
                typeof edge?.source === "string" ? edge.source.trim() : "";
            const target =
                typeof edge?.target === "string" ? edge.target.trim() : "";
            if (
                !source ||
                !target ||
                !validIds.has(source) ||
                !validIds.has(target)
            ) {
                return null;
            }
            return { source, target };
        })
        .filter(Boolean);

    const edges = normalizedEdges.length
        ? normalizedEdges
        : normalizedNodes.slice(0, -1).map((node, idx) => ({
              source: node.id,
              target: normalizedNodes[idx + 1].id,
          }));

    const name =
        typeof parsedWorkflow.name === "string" && parsedWorkflow.name.trim()
            ? parsedWorkflow.name.trim()
            : "AI Generated Workflow";

    return {
        name,
        nodes: normalizedNodes,
        edges,
    };
}

export async function generateWorkflow(prompt) {
    const client = getClient();

    const completion = await client.chat.completions.create({
        model: "sarvam-m",
        messages: [
            { role: "system", content: WORKFLOW_SYSTEM_PROMPT },
            { role: "user", content: prompt },
        ],
        temperature: 0.2,
    });

    const content = completion?.choices?.[0]?.message?.content;
    const raw = safeContentToString(content);

    const parsed = parseAiWorkflowJson(raw);
    return normalizeWorkflow(parsed, prompt);
}

export async function classifyLead(lead, categories, instructions) {
    const cats =
        Array.isArray(categories) && categories.length
            ? categories
            : ["hot", "warm", "cold"];
    const prompt = `Classify this lead into exactly one of these categories: ${cats.join(", ")}.\n\nLead info:\nName: ${lead.name || ""}\nCompany: ${lead.company || ""}\nRole: ${lead.title || ""}\nEmail: ${lead.email || ""}\n\nInstructions: ${instructions || "Classify based on lead quality"}\n\nRespond with ONLY the category name, nothing else.`;

    const client = getClient();
    const completion = await client.chat.completions.create({
        model: "sarvam-m",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
    });

    const raw = completion.choices[0].message.content.trim().toLowerCase();
    // Find the best matching category
    const matched = cats.find((c) => raw.includes(c.toLowerCase()));
    return matched || cats[0];
}

export async function generateOutreachMessage(lead, instructions) {
    const prompt = `Write a short personalized outreach message.

        Target person:
        Name: ${lead.name}
        Company: ${lead.company}
        Role: ${lead.title}

        Goal: ${instructions}

        Tone:
        Friendly
        Professional
        Concise

        Return only the message text, no subject line or extra formatting.`;

    const client = getClient();

    const completion = await client.chat.completions.create({
        model: "sarvam-m",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
}

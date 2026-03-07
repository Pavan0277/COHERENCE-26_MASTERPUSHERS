import OpenAI from "openai";

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

export async function generateWorkflow(prompt) {
    const client = getClient();

    const completion = await client.chat.completions.create({
        model: "sarvam-m",
        messages: [
            { role: "system", content: WORKFLOW_SYSTEM_PROMPT },
            { role: "user",   content: prompt },
        ],
        temperature: 0.2,
    });

    const raw = completion.choices[0].message.content.trim();

    // Strip markdown code fences if the model wraps the response
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let workflow;
    try {
        workflow = JSON.parse(cleaned);
    } catch {
        throw new Error("AI returned invalid JSON. Please try again.");
    }

    // Basic structure validation
    if (!workflow.name || !Array.isArray(workflow.nodes)) {
        throw new Error("AI response is missing required fields (name, nodes).");
    }

    return workflow;
}

export async function classifyLead(lead, categories, instructions) {
    const cats = Array.isArray(categories) && categories.length ? categories : ["hot", "warm", "cold"];
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

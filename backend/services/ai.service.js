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
      "type": "upload" | "filter" | "ai_message" | "send" | "delay",
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

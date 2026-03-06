import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
        `${WORKFLOW_SYSTEM_PROMPT}\n\nUser request: ${prompt}`
    );

    const raw = result.response.text().trim();

    // Strip markdown code fences if the model wraps the response anyway
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/,  "").trim();

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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
}

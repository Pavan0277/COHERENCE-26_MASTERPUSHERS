import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOutreachMessage, generateWorkflow } from "../services/ai.service.js";

export const generateMessage = asyncHandler(async (req, res) => {
    const { lead, instructions } = req.body;

    if (!lead || !instructions) {
        return res
            .status(400)
            .json({ message: "lead and instructions are required" });
    }

    if (!lead.name || !lead.company || !lead.title) {
        return res
            .status(400)
            .json({ message: "lead must include name, company, and title" });
    }

    const message = await generateOutreachMessage(lead, instructions);

    return res.status(200).json({ message });
});

export const generateWorkflowFromPrompt = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
        return res.status(400).json({ message: "prompt is required" });
    }

    const workflow = await generateWorkflow(prompt);

    return res.status(200).json(workflow);
});

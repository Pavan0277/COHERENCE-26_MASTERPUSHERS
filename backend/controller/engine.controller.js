import { asyncHandler } from "../utils/asyncHandler.js";
import { executeWorkflow } from "../services/workflowEngine.js";
import { Workflow } from "../models/workflow.model.js";
import { LeadExecution } from "../models/leadExecution.model.js";

export const runWorkflow = asyncHandler(async (req, res) => {
    const { workflowId } = req.params;

    // Verify ownership
    const workflow = await Workflow.findOne({
        _id: workflowId,
        userId: req.user._id,
    });

    if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
    }

    const summary = await executeWorkflow(workflowId);

    return res.status(200).json(summary);
});

export const getWorkflowStatus = asyncHandler(async (req, res) => {
    const { workflowId } = req.params;

    const workflow = await Workflow.findOne({
        _id: workflowId,
        userId: req.user._id,
    });

    if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
    }

    const executions = await LeadExecution.find({ workflowId }).populate(
        "leadId",
        "name email company title"
    );

    return res.status(200).json({
        workflowId,
        workflowName: workflow.name,
        executions,
    });
});

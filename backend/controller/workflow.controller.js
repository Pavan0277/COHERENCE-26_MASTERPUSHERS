import { Workflow } from "../models/workflow.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createWorkflow = asyncHandler(async (req, res) => {
    const { name, nodes, edges } = req.body;

    if (!name?.trim()) {
        return res.status(400).json({ message: "Workflow name is required" });
    }

    const workflow = await Workflow.create({
        userId: req.user._id,
        name,
        nodes: nodes || [],
        edges: edges || [],
    });

    return res.status(201).json({ message: "Workflow created", workflow });
});

export const getWorkflows = asyncHandler(async (req, res) => {
    const workflows = await Workflow.find({ userId: req.user._id }).sort({
        createdAt: -1,
    });

    return res.status(200).json({ workflows });
});

export const getWorkflowById = asyncHandler(async (req, res) => {
    const workflow = await Workflow.findOne({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
    }

    return res.status(200).json({ workflow });
});

export const updateWorkflow = asyncHandler(async (req, res) => {
    const { name, nodes, edges } = req.body;

    const workflow = await Workflow.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { ...(name && { name }), ...(nodes && { nodes }), ...(edges && { edges }) },
        { new: true, runValidators: true }
    );

    if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
    }

    return res.status(200).json({ message: "Workflow updated", workflow });
});

export const deleteWorkflow = asyncHandler(async (req, res) => {
    const workflow = await Workflow.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
    });

    if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
    }

    return res.status(200).json({ message: "Workflow deleted" });
});

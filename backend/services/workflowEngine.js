import { Workflow } from "../models/workflow.model.js";
import { Lead } from "../models/lead.model.js";
import { LeadExecution } from "../models/leadExecution.model.js";
import { applyFilter } from "../utils/filterEngine.js";
import { generateOutreachMessage } from "./ai.service.js";
import { sendMessage } from "./messaging.service.js";
import { scheduleDelayedStep } from "./delay.service.js";

/**
 * Build an ordered list of nodes from edges.
 * Finds the starting node (one that is not a target of any edge)
 * and follows edges sequentially.
 */
function getOrderedNodes(nodes, edges) {
    if (!edges || !edges.length) return nodes;

    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const edgeMap = {};
    const targetSet = new Set();

    for (const edge of edges) {
        edgeMap[edge.source] = edge.target;
        targetSet.add(edge.target);
    }

    // Start node = a node that isn't a target of any edge
    let startId = nodes.find((n) => !targetSet.has(n.id))?.id;
    if (!startId) startId = nodes[0]?.id;

    const ordered = [];
    let currentId = startId;

    while (currentId && nodeMap[currentId]) {
        ordered.push(nodeMap[currentId]);
        currentId = edgeMap[currentId] || null;
    }

    return ordered;
}

/**
 * Update the lead execution record and append a history entry.
 */
async function updateExecution(exec, node, status, error = null) {
    const nodeId = typeof node === "string" ? node : node?.id;
    const nodeType = typeof node === "object" ? node?.type : undefined;

    exec.currentNode = nodeId;
    exec.status = status;

    if (nodeId) {
        exec.history.push({
            nodeId,
            nodeType,
            status,
            executedAt: new Date(),
            error: error || null,
        });
    }

    await exec.save();
}

/**
 * Execute a single node for a single lead.
 * Returns { continue: boolean, message?: string }
 */
async function executeNode(node, lead, context) {
    const config = node.config || {};

    switch (node.type) {
        case "upload":
            // Upload node is already handled during lead import.
            // Nothing to do at execution time — leads are loaded.
            return { continue: true };

        case "filter": {
            const filters = config.filters || (config.column ? [config] : []);
            const passes = filters.every((f) => applyFilter(lead, f));
            if (!passes) {
                return { continue: false, message: "Lead filtered out" };
            }
            return { continue: true };
        }

        case "ai_message": {
            const instructions = config.instructions || config.goal || "Reach out professionally";
            const message = await generateOutreachMessage(lead, instructions);
            // Store the generated message in context so the send node can use it
            context.generatedMessage = message;
            return { continue: true, message };
        }

        case "send": {
            const platform = config.platform || "email";
            const message = context.generatedMessage || config.message || "";
            if (!message) {
                throw new Error("No message to send. Add an ai_message node before send.");
            }
            await sendMessage(platform, lead, message);
            return { continue: true };
        }

        case "delay": {
            const min = config.min || 0;
            const max = config.max || 0;
            // Schedule the next step and pause this lead's execution
            await scheduleDelayedStep(
                { min, max },
                {
                    workflowId: context.workflowId,
                    nodeId: context.nextNodeId,
                    leadId: lead._id.toString(),
                    userId: context.userId,
                }
            );
            return { continue: false, message: "Paused for delay" };
        }

        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
}

/**
 * Execute a full workflow for all its leads, processing nodes sequentially.
 *
 * @param {string} workflowId
 * @returns {Promise<Object>} summary of execution results
 */
export async function executeWorkflow(workflowId) {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    const orderedNodes = getOrderedNodes(workflow.nodes, workflow.edges);
    if (!orderedNodes.length) throw new Error("Workflow has no nodes");

    const leads = await Lead.find({ workflowId: workflow._id });
    if (!leads.length) throw new Error("No leads found for this workflow");

    const results = [];

    for (const lead of leads) {
        // Upsert execution record
        let exec = await LeadExecution.findOne({
            leadId: lead._id,
            workflowId: workflow._id,
        });

        if (!exec) {
            exec = await LeadExecution.create({
                userId: workflow.userId,
                leadId: lead._id,
                workflowId: workflow._id,
                status: "pending",
            });
        }

        // Determine starting node index (resume from where we left off)
        let startIdx = 0;
        if (exec.currentNode && exec.status === "running") {
            const resumeIdx = orderedNodes.findIndex((n) => n.id === exec.currentNode);
            if (resumeIdx !== -1) startIdx = resumeIdx;
        }

        await updateExecution(exec, orderedNodes[startIdx], "running");

        const context = {
            workflowId: workflow._id.toString(),
            userId: workflow.userId.toString(),
            generatedMessage: null,
            nextNodeId: null,
        };

        let leadStatus = "completed";
        let leadError = null;

        try {
            for (let i = startIdx; i < orderedNodes.length; i++) {
                const node = orderedNodes[i];
                context.nextNodeId =
                    i + 1 < orderedNodes.length ? orderedNodes[i + 1].id : null;

                await updateExecution(exec, node, "running");

                const result = await executeNode(node, lead, context);

                if (!result.continue) {
                    if (node.type === "delay") {
                        // Paused — will resume from the next node via BullMQ
                        leadStatus = "running";
                        await updateExecution(exec, node, "completed");
                    } else {
                        // Filtered out — mark node as skipped and finish
                        leadStatus = "completed";
                        await updateExecution(exec, node, "skipped");
                    }
                    break;
                }

                await updateExecution(exec, node, "completed");
            }

            if (leadStatus === "completed") {
                exec.status = "completed";
                await exec.save();
            }
        } catch (err) {
            leadStatus = "failed";
            leadError = err.message;
            await updateExecution(exec, exec.currentNode, "failed", err.message);
        }

        results.push({
            leadId: lead._id,
            name: lead.name,
            status: leadStatus,
            error: leadError,
        });
    }

    return {
        workflowId: workflow._id,
        workflowName: workflow.name,
        totalLeads: leads.length,
        results,
    };
}

/**
 * Resume a single lead from a specific node (called by BullMQ worker after delay).
 *
 * @param {string} workflowId
 * @param {string} nodeId - The node to resume from
 * @param {string} leadId
 */
export async function  resumeLeadFromNode(workflowId, nodeId, leadId) {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) throw new Error("Workflow not found");

    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    const orderedNodes = getOrderedNodes(workflow.nodes, workflow.edges);
    const startIdx = orderedNodes.findIndex((n) => n.id === nodeId);
    if (startIdx === -1) throw new Error(`Node "${nodeId}" not found in workflow`);

    let exec = await LeadExecution.findOne({
        leadId: lead._id,
        workflowId: workflow._id,
    });

    if (!exec) {
        exec = await LeadExecution.create({
            userId: workflow.userId,
            leadId: lead._id,
            workflowId: workflow._id,
            status: "running",
            currentNode: nodeId,
        });
    }

    const context = {
        workflowId: workflow._id.toString(),
        userId: workflow.userId.toString(),
        generatedMessage: null,
        nextNodeId: null,
    };

    try {
        for (let i = startIdx; i < orderedNodes.length; i++) {
            const node = orderedNodes[i];
            context.nextNodeId =
                i + 1 < orderedNodes.length ? orderedNodes[i + 1].id : null;

            await updateExecution(exec, node, "running");

            const result = await executeNode(node, lead, context);

            if (!result.continue) {
                if (node.type === "delay") {
                    await updateExecution(exec, node, "completed");
                } else {
                    await updateExecution(exec, node, "skipped");
                }
                return;
            }

            await updateExecution(exec, node, "completed");
        }

        exec.status = "completed";
        await exec.save();
    } catch (err) {
        await updateExecution(exec, exec.currentNode, "failed", err.message);
        throw err;
    }
}

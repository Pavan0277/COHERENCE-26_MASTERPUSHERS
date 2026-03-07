import { Workflow } from "../models/workflow.model.js";
import { Lead } from "../models/lead.model.js";
import { LeadExecution } from "../models/leadExecution.model.js";
import { UserSettings } from "../models/userSettings.model.js";
import { MessageLog } from "../models/messageLog.model.js";
import { applyFilter } from "../utils/filterEngine.js";
import { generateOutreachMessage } from "./ai.service.js";
import { sendMessage, sendSms } from "./messaging.service.js";
import { scheduleDelayedStep } from "./delay.service.js";
import { createOutboundCall } from "./vapi.service.js";
import { createInitialTranscript } from "./transcriptService.js";

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

            let sendError = null;
            try {
                await sendMessage(platform, lead, message, context.userCredentials);
            } catch (err) {
                sendError = err;
            }

            // Log every attempt — never let logging failure block execution
            await MessageLog.create({
                userId:     context.userId,
                workflowId: context.workflowId,
                leadId:     lead._id,
                leadName:   lead.name || "",
                platform,
                status:     sendError ? "failed" : "sent",
                error:      sendError ? sendError.message : null,
            }).catch(() => {});

            if (sendError) throw sendError;
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

        case "call": {
            const phone = lead.phone;
            if (!phone) {
                return { continue: true, message: "Lead has no phone number — call skipped" };
            }

            const isFollowUp = config.followUp === true;

            // Pick the right assistant:
            //   follow-up → env VAPI_FOLLOWUP_ASSISTANT_ID > node override > Settings DB fallback
            //   initial   → node override > Settings DB assistantId
            const assistantId = config.assistantId || (
                isFollowUp
                    ? (process.env.VAPI_FOLLOWUP_ASSISTANT_ID || context.vapiSettings?.followUpAssistantId || context.vapiSettings?.assistantId)
                    : context.vapiSettings?.assistantId
            ) || null;

            const phoneNumId = config.phoneNumberId || context.vapiSettings?.phoneNumberId || null;
            const vapiApiKey = context.vapiSettings?.apiKey || null;

            // Pass lead context so Alex/Alex2 can personalise ("Hi {{customerName}}")
            // For follow-up calls, also inject the follow-up system prompt so the
            // assistant delivers the follow-up script instead of the initial-call script.
            const followUpSystemPrompt = isFollowUp
                ? (context.vapiSettings?.followUpSystemPrompt || null)
                : null;

            const followUpFirstMessage = isFollowUp
                ? (context.vapiSettings?.followUpFirstMessage || "Hi {{customerName}}! This is Alex. I called you recently about our service — just wanted to follow up and see if you had any questions.")
                : null;

            const leadContext = {
                name:    lead.name    || "",
                company: lead.company || "",
                email:   lead.email   || "",
                ...(followUpSystemPrompt  ? { systemPrompt:  followUpSystemPrompt  } : {}),
                ...(followUpFirstMessage  ? { firstMessage:  followUpFirstMessage  } : {}),
            };

            console.log(`[Engine] ${isFollowUp ? "Follow-up" : "Initial"} call for lead ${lead._id} using assistant: ${assistantId}`);

            const { callId, vapiId } = await createOutboundCall(phone, assistantId, phoneNumId, vapiApiKey, leadContext);
            await createInitialTranscript(
                callId,
                vapiId,
                phone,
                context.userId,
                context.workflowId,
                lead._id,
                { isFollowUp, assistantId: assistantId || "" }   // stored in metadata for dashboard
            );
            console.log(`[Engine] Call initiated for lead ${lead._id}: callId=${callId}`);
            return { continue: true, message: `Call initiated: ${callId}` };
        }

        case "webhook": {
            const url    = config.url;
            const method = (config.method || "POST").toUpperCase();
            if (!url) {
                return { continue: true, message: "Webhook node has no URL — skipped" };
            }
            const payload = {
                name:    lead.name    || "",
                email:   lead.email   || "",
                phone:   lead.phone   || "",
                company: lead.company || "",
                title:   lead.title   || "",
                ...(lead._doc || lead.toObject?.() || {}),
            };
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: method !== "GET" ? JSON.stringify(payload) : undefined,
            });
            if (!res.ok) {
                throw new Error(`Webhook ${method} ${url} failed with status ${res.status}`);
            }
            console.log(`[Engine] Webhook fired for lead ${lead._id}: ${method} ${url}`);
            return { continue: true, message: `Webhook sent: ${url}` };
        }

        case "condition": {
            const { column, operator, value } = config;
            if (!column || !operator) {
                return { continue: true, message: "Condition node has no column/operator — passing through" };
            }
            const { applyFilter } = await import("../utils/filterEngine.js");
            const passes = applyFilter(lead, { column, operator, value: value || "" });
            if (!passes) {
                return { continue: false, message: `Condition not met: ${column} ${operator} ${value}` };
            }
            return { continue: true };
        }

        case "tag": {
            const tag   = config.tag   || "";
            const color = config.color || "#6366f1";
            if (!tag) {
                return { continue: true, message: "Tag node has no tag value — skipped" };
            }
            // Store tag on the lead document under lead.tags array
            const tags = Array.isArray(lead.tags) ? lead.tags : [];
            if (!tags.find((t) => t.name === tag)) {
                tags.push({ name: tag, color, addedAt: new Date() });
                lead.tags = tags;
                await lead.save().catch(() => {});
            }
            console.log(`[Engine] Tagged lead ${lead._id}: "${tag}"`);
            return { continue: true, message: `Tagged: ${tag}` };
        }

        case "sms": {
            const phone = lead.phone;
            if (!phone) {
                return { continue: true, message: "Lead has no phone — SMS skipped" };
            }
            const smsMessage = config.message || context.generatedMessage || "";
            if (!smsMessage) {
                throw new Error("No message to send via SMS. Add an AI Message node or set a message in the SMS node.");
            }
            const fromOverride = config.from || "";
            const smsCreds = fromOverride
                ? { sms: { ...context.userCredentials.sms, from: fromOverride } }
                : context.userCredentials;
            let smsError = null;
            try {
                await sendSms(lead, smsMessage, smsCreds);
            } catch (err) {
                smsError = err;
            }
            await MessageLog.create({
                userId:     context.userId,
                workflowId: context.workflowId,
                leadId:     lead._id,
                leadName:   lead.name || "",
                platform:   "sms",
                status:     smsError ? "failed" : "sent",
                error:      smsError ? smsError.message : null,
            }).catch(() => {});
            if (smsError) throw smsError;
            console.log(`[Engine] SMS sent to lead ${lead._id}`);
            return { continue: true, message: "SMS sent" };
        }

        case "score": {
            const value     = Number(config.value)     || 0;
            const operation = config.operation || "add";
            const current   = Number(lead.score)       || 0;
            if (operation === "add")      lead.score = current + value;
            else if (operation === "subtract") lead.score = current - value;
            else                          lead.score = value;
            await lead.save().catch(() => {});
            console.log(`[Engine] Score updated for lead ${lead._id}: ${lead.score}`);
            return { continue: true, message: `Score ${operation}: ${lead.score}` };
        }

        case "notify": {
            const notifyChannel = (config.channel || "email").toLowerCase();
            const rawMsg        = config.message || "Lead {name} ({email}) reached a workflow step.";
            const subject       = config.subject || "Workflow Notification";
            // Interpolate lead fields
            const filled = rawMsg
                .replace(/\{name\}/g,    lead.name    || "")
                .replace(/\{email\}/g,   lead.email   || "")
                .replace(/\{company\}/g, lead.company || "")
                .replace(/\{title\}/g,   lead.title   || "")
                .replace(/\{phone\}/g,   lead.phone   || "");
            if (notifyChannel === "slack") {
                const wh = context.userCredentials?.slack?.webhookUrl || process.env.SLACK_WEBHOOK_URL;
                if (!wh || wh.includes("your/webhook")) {
                    console.warn("[Engine] Notify: Slack URL not set, skipping");
                } else {
                    await fetch(wh, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: `*${subject}*\n\n${filled}` }),
                    }).catch((e) => console.warn(`[Engine] Notify Slack error: ${e.message}`));
                }
            } else {
                // email notification to admin
                const { sendMessage: sm } = await import("./messaging.service.js");
                const adminLead = {
                    name:  "Admin",
                    email: context.userCredentials?.email?.user ||
                           context.userCredentials?.email?.from ||
                           process.env.SMTP_USER || "",
                };
                if (adminLead.email) {
                    await sm("email", adminLead, filled, context.userCredentials)
                        .catch((e) => console.warn(`[Engine] Notify email error: ${e.message}`));
                } else {
                    console.warn("[Engine] Notify: no admin email configured, skipping");
                }
            }
            return { continue: true, message: `Notification sent via ${notifyChannel}` };
        }

        case "split": {
            const pct  = Number(config.percentage) || 50;
            const pass = Math.random() * 100 < pct;
            if (!pass) {
                return { continue: false, message: `A/B Split: lead excluded (${pct}% pass rate)` };
            }
            return { continue: true, message: `A/B Split: lead included` };
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

    // Fetch per-user messaging credentials (falls back to env if not set)
    const userSettings = await UserSettings.findOne({ userId: workflow.userId });

    const orderedNodes = getOrderedNodes(workflow.nodes, workflow.edges);
    if (!orderedNodes.length) throw new Error("Workflow has no nodes");

    const leads = await Lead.find({ workflowId: workflow._id });
    if (!leads.length) {
        return {
            workflowId: workflow._id,
            workflowName: workflow.name,
            totalLeads: 0,
            results: [],
            message: "No leads found for this workflow. Upload a leads file first.",
        };
    }

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
            userCredentials: userSettings ? {
                email:    userSettings.email,
                slack:    userSettings.slack,
                telegram: userSettings.telegram,
            } : {},
            vapiSettings: userSettings?.vapi || {},
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

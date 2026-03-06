import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { resumeLeadFromNode } from "../services/workflowEngine.js";

const worker = new Worker(
    "workflow",
    async (job) => {
        const { workflowId, nodeId, leadId, userId } = job.data;

        console.log(
            `[WorkflowWorker] Resuming node "${nodeId}" of workflow "${workflowId}" for user "${userId}" (lead: ${leadId})`
        );

        await resumeLeadFromNode(workflowId, nodeId, leadId);
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`[WorkflowWorker] Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`[WorkflowWorker] Job ${job?.id} failed:`, err.message);
});

export { worker };

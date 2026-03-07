import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

let _workflowQueue = null;

export function getWorkflowQueue() {
    if (!_workflowQueue) {
        _workflowQueue = new Queue("workflow", { connection });
    }
    return _workflowQueue;
}

// Keep named export for backward compatibility (lazy getter)
export const workflowQueue = { add: (...args) => getWorkflowQueue().add(...args) };

import { getWorkflowQueue } from "../queues/workflow.queue.js";
import { isRedisAvailable } from "../config/redis.js";

/**
 * Generate a random integer between min and max (inclusive), in milliseconds.
 * Config values (min, max) are in seconds.
 */
function randomDelay(min, max) {
    const delaySec = Math.floor(Math.random() * (max - min + 1)) + min;
    return delaySec * 1000; // convert to ms for BullMQ
}

/**
 * Schedule the next workflow step after a random delay.
 *
 * @param {Object} delayConfig - { min: number, max: number } in seconds
 * @param {Object} jobData - Data for the next step (workflowId, nodeId, leadId, userId, etc.)
 * @returns {Promise<Object>} The queued job info
 */
export async function scheduleDelayedStep(delayConfig, jobData) {
    if (!(await isRedisAvailable())) {
        throw new Error(
            "Redis is required for delayed workflow steps. Start Redis (e.g. docker run -d -p 6379:6379 redis) or set REDIS_URL."
        );
    }
    const { min = 0, max = 0 } = delayConfig;

    if (min < 0 || max < 0 || min > max) {
        throw new Error(
            `Invalid delay config: min=${min}, max=${max}. Ensure 0 <= min <= max.`
        );
    }

    const delay = randomDelay(min, max);

    const job = await getWorkflowQueue().add("executeNode", jobData, { delay });

    return {
        jobId: job.id,
        delayMs: delay,
        delaySec: Math.round(delay / 1000),
    };
}

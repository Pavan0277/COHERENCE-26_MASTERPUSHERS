import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const workflowQueue = new Queue("workflow", { connection });

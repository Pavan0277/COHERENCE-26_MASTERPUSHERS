import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { app } from "./app.js";
import { connectDB } from "./db/index.js";


connectDB()
    .then(async () => {
        // Start the BullMQ workflow worker only if Redis is available
        const { isRedisAvailable } = await import("./config/redis.js");
        if (await isRedisAvailable()) {
            await import("./workers/workflow.worker.js");
            console.log(" ✓ Redis connected, workflow worker started");
        } else {
            console.warn(" ⚠ Redis not available - delayed workflow steps disabled. Start Redis for full functionality.");
        }

        app.listen(process.env.PORT, () => {
            console.log(` ⚙️ Server is running on port http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error(` ❌ fail to connect: ${error.message}`);
        process.exit(1);
    });
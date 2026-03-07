import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
    connectTimeout: 3000,
    retryStrategy(times) {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 500, 2000);
    },
});

// Suppress unhandled error events when Redis is unavailable
connection.on("error", () => {});

/** Check if Redis is available using a temporary connection (avoids polluting main connection) */
export async function isRedisAvailable() {
    const testConn = new IORedis(redisUrl, {
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null,
    });
    testConn.on("error", () => {}); // Suppress unhandled error when connection fails
    try {
        await testConn.ping();
        return true;
    } catch {
        return false;
    } finally {
        testConn.disconnect();
    }
}

export { connection };

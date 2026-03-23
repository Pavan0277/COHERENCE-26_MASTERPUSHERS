import "dotenv/config";
import IORedis from "ioredis";

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function isLikelyRenderInternalRedisHost(urlValue) {
    try {
        const host = new URL(urlValue).hostname;
        return host.startsWith("red-") && !host.includes(".");
    } catch {
        return false;
    }
}

const renderRuntime = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID);
const configuredRedisUrl = isNonEmptyString(process.env.REDIS_URL)
    ? process.env.REDIS_URL.trim()
    : "redis://localhost:6379";

let redisUrl = configuredRedisUrl;

// When running locally, Render internal Redis hostnames are not resolvable.
if (!renderRuntime && isLikelyRenderInternalRedisHost(configuredRedisUrl)) {
    if (isNonEmptyString(process.env.REDIS_URL_LOCAL)) {
        redisUrl = process.env.REDIS_URL_LOCAL.trim();
    } else {
        redisUrl = "redis://localhost:6379";
        console.warn(
            "REDIS_URL points to Render internal host. Set REDIS_URL_LOCAL (external rediss URL) for local runs, or start local Redis on localhost:6379."
        );
    }
}

function createRedisOptions() {
    const isTls = redisUrl.startsWith("rediss://");

    return {
        maxRetriesPerRequest: null,
        lazyConnect: true,
        connectTimeout: 10000,
        // DNS/network on cloud can be slower; allow a few backoffs before giving up.
        retryStrategy(times) {
            if (times > 5) return null;
            return Math.min(times * 750, 3000);
        },
        ...(isTls
            ? {
                  tls: {
                      // Render external Redis requires TLS; cert chain is trusted by Node defaults.
                      rejectUnauthorized: true,
                  },
              }
            : {}),
    };
}

const connection = new IORedis(redisUrl, createRedisOptions());

connection.on("error", (error) => {
    console.warn(`Redis connection error: ${error.message}`);
});

/** Check if Redis is available using a temporary connection (avoids polluting main connection) */
export async function isRedisAvailable() {
    const testConn = new IORedis(redisUrl, {
        ...createRedisOptions(),
        maxRetriesPerRequest: 1,
        retryStrategy: () => null,
    });
    let lastErrorMessage = "unknown error";
    testConn.on("error", (error) => {
        lastErrorMessage = error.message;
    });
    try {
        await testConn.connect();
        await testConn.ping();
        return true;
    } catch {
        console.warn(`Redis availability check failed for ${redisUrl}: ${lastErrorMessage}`);
        return false;
    } finally {
        testConn.disconnect();
    }
}

export { connection };

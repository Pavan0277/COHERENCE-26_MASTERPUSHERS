import mongoose from "mongoose";

const buildMongoUri = (baseUri, databaseName) => {
    if (!baseUri) {
        return null;
    }

    if (!databaseName) {
        return baseUri;
    }

    try {
        const url = new URL(baseUri);

        if (!url.pathname || url.pathname === "/") {
            url.pathname = `/${databaseName}`;
        }

        return url.toString();
    } catch {
        return baseUri.endsWith("/") ? `${baseUri}${databaseName}` : `${baseUri}/${databaseName}`;
    }
};

const connectDB = async () => {
    const NAME = process.env.MONGO_DB_NAME;
    const connectionTargets = [
        buildMongoUri(process.env.MONGODB_URI, NAME),
        buildMongoUri(process.env.MONGODB_URI_FALLBACK, NAME),
    ].filter(Boolean);

    if (connectionTargets.length === 0) {
        throw new Error("MONGODB_URI is not set");
    }

    try {
        let lastError;

        for (const uri of connectionTargets) {
            try {
                const conn = await mongoose.connect(uri);

                console.log(`MongoDB connected: ${conn.connection.host}`);

                // Drop stale unique index left over from an older schema where the
                // field was named "user" instead of "userId".
                try {
                    await conn.connection.collection("leads").dropIndex("user_1_email_1");
                    console.log("Dropped stale leads index: user_1_email_1");
                } catch {
                    // Index doesn't exist — nothing to do
                }

                return conn;
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError ?? new Error("Unable to connect to MongoDB");
    } catch (error) {
        console.error(`fail to connect: ${error.message}`);
        process.exit(1);
    }
};

export { connectDB };

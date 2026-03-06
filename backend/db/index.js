import mongoose from "mongoose";

const connectDB = async () => {
    const NAME = process.env.MONGO_DB_NAME;

    try {
        const conn = await mongoose.connect(
            `${process.env.MONGODB_URI}/${NAME}`);

        console.log(`MongoDB connected: ${conn.connection.host}`);

        // Drop stale unique index left over from an older schema where the
        // field was named "user" instead of "userId".
        try {
            await conn.connection.collection("leads").dropIndex("user_1_email_1");
            console.log("Dropped stale leads index: user_1_email_1");
        } catch {
            // Index doesn't exist — nothing to do
        }
    } catch (error) {
        console.error(`fail to connect: ${error.message}`);
        process.exit(1);
    }
};

export { connectDB };

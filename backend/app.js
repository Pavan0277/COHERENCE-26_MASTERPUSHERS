import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // allow requests with no origin (curl, Postman, mobile)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

import { userRouter } from "./routers/user.routes.js";
import { voiceRouter } from "./routers/voice.routes.js";

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/voice", voiceRouter);

// 404 for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler - must have 4 args for Express to recognize it
app.use((err, req, res, next) => {
    console.error("API Error:", err.message);
    const status = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
    res.status(status).json({
        message: err.message || "Internal server error",
    });
});

export { app };

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

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
            // allow requests with no origin (e.g. mobile apps, curl, Postman)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        },
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

import { userRouter } from "./routers/user.routes.js";
import { workflowRouter } from "./routers/workflow.routes.js";
import { leadsRouter } from "./routers/leads.routes.js";
import { aiRouter } from "./routers/ai.routes.js";
import { messagingRouter } from "./routers/messaging.routes.js";
import { delayRouter } from "./routers/delay.routes.js";
import { engineRouter } from "./routers/engine.routes.js";
import { settingsRouter } from "./routers/settings.routes.js";
import { analyticsRouter } from "./routers/analytics.routes.js";
import { callsRouter } from "./routers/calls.routes.js";

app.use("/api/v1/auth", userRouter);
app.use("/api/workflows", workflowRouter);
app.use("/api/leads", leadsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/messaging", messagingRouter);
app.use("/api/delay", delayRouter);
app.use("/api/engine", engineRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/calls", callsRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the Sales Outreach System API");
});

// Global error handler
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
});

export { app };

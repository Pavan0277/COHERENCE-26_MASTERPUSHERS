/**
 * Voice API Routes
 * - /call, /transcripts: require auth
 * - /webhook/vapi: public (VAPI Server URL callbacks)
 */

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    initiateCallVapi,
    initiateCallVonage,
    handleVapiWebhook,
    handleVonageWebhook,
    listTranscripts,
    getTranscript,
} from "../controllers/voice.controller.js";

const router = Router();

// Protected routes (require JWT)
router.post("/call/vapi", verifyJWT, initiateCallVapi);
router.post("/call/vonage", verifyJWT, initiateCallVonage);
router.get("/transcripts", verifyJWT, listTranscripts);
router.get("/transcripts/:callId", verifyJWT, getTranscript);

// Webhooks (public - Vonage/VAPI callbacks)
router.post("/webhook/vonage/events", handleVonageWebhook);
router.post("/webhook/vapi", handleVapiWebhook);

export { router as voiceRouter };

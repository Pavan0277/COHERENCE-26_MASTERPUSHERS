/**
 * Voice API Routes
 * - /call, /transcripts: require auth
 * - /webhook/vapi: public (VAPI Server URL callbacks)
 */

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    initiateCall,
    handleVapiWebhook,
    listTranscripts,
    getTranscript,
} from "../controllers/voice.controller.js";

const router = Router();

// Protected routes (require JWT)
router.post("/call", verifyJWT, initiateCall);
router.get("/transcripts", verifyJWT, listTranscripts);
router.get("/transcripts/:callId", verifyJWT, getTranscript);

// Webhook (public - VAPI Server URL)
router.post("/webhook/vapi", handleVapiWebhook);

export { router as voiceRouter };

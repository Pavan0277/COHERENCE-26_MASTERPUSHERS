import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { listTranscripts, getTranscript, vapiWebhook } from "../controller/calls.controller.js";

const callsRouter = Router();

// VAPI webhook — public (no JWT)
callsRouter.post("/webhook/vapi", vapiWebhook);

// Protected routes
callsRouter.get("/transcripts",        verifyJWT, listTranscripts);
callsRouter.get("/transcripts/:callId", verifyJWT, getTranscript);

export { callsRouter };

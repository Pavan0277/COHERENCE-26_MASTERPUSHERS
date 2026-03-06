import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { generateMessage, generateWorkflowFromPrompt } from "../controller/ai.controller.js";

const aiRouter = Router();

aiRouter.use(verifyJWT);

aiRouter.route("/generate-message").post(generateMessage);
aiRouter.route("/generate-workflow").post(generateWorkflowFromPrompt);

export { aiRouter };

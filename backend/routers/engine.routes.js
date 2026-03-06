import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { runWorkflow, getWorkflowStatus } from "../controller/engine.controller.js";

const engineRouter = Router();

engineRouter.use(verifyJWT);

engineRouter.route("/:workflowId/execute").post(runWorkflow);
engineRouter.route("/:workflowId/status").get(getWorkflowStatus);

export { engineRouter };

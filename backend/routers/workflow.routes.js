import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createWorkflow,
    getWorkflows,
    getWorkflowById,
    updateWorkflow,
    deleteWorkflow,
} from "../controller/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.use(verifyJWT);

workflowRouter.route("/").post(createWorkflow).get(getWorkflows);
workflowRouter.route("/:id").get(getWorkflowById).put(updateWorkflow).delete(deleteWorkflow);

export { workflowRouter };

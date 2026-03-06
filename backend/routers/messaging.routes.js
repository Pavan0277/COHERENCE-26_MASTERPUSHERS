import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { sendOutreach } from "../controller/messaging.controller.js";

const messagingRouter = Router();

messagingRouter.use(verifyJWT);

messagingRouter.route("/send").post(sendOutreach);

export { messagingRouter };

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { scheduleDelay } from "../controller/delay.controller.js";

const delayRouter = Router();

delayRouter.use(verifyJWT);

delayRouter.route("/schedule").post(scheduleDelay);

export { delayRouter };

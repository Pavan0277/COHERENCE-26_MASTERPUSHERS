import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getAnalytics } from "../controller/analytics.controller.js";

const analyticsRouter = Router();

analyticsRouter.use(verifyJWT);

analyticsRouter.route("/").get(getAnalytics);

export { analyticsRouter };

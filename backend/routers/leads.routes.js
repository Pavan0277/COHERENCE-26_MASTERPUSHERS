import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadLeads } from "../controller/leads.controller.js";

const leadsRouter = Router();

leadsRouter.use(verifyJWT);

leadsRouter.route("/upload").post(upload.single("file"), uploadLeads);

export { leadsRouter };

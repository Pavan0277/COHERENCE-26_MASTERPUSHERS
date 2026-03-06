import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getSettings, updateSettings } from "../controller/settings.controller.js";

const settingsRouter = Router();

settingsRouter.use(verifyJWT);

settingsRouter.route("/").get(getSettings).put(updateSettings);

export { settingsRouter };

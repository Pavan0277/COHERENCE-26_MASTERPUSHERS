import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMessage } from "../services/messaging.service.js";
import { UserSettings } from "../models/userSettings.model.js";

export const sendOutreach = asyncHandler(async (req, res) => {
    const { platform, lead, message } = req.body;

    if (!platform || !lead || !message) {
        return res
            .status(400)
            .json({ message: "platform, lead, and message are required" });
    }

    // Load the logged-in user's saved credentials
    const userSettings = await UserSettings.findOne({ userId: req.user._id });
    console.log("[DEBUG] userId:", req.user._id);
    console.log("[DEBUG] telegram settings:", JSON.stringify(userSettings?.telegram));
    const credentials = userSettings ? {
        email:    userSettings.email,
        slack:    userSettings.slack,
        telegram: userSettings.telegram,
    } : {};

    const result = await sendMessage(platform, lead, message, credentials);

    return res.status(200).json({ message: "Message sent", result });
});

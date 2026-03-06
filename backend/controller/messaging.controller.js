import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMessage } from "../services/messaging.service.js";

export const sendOutreach = asyncHandler(async (req, res) => {
    const { platform, lead, message } = req.body;

    if (!platform || !lead || !message) {
        return res
            .status(400)
            .json({ message: "platform, lead, and message are required" });
    }

    const result = await sendMessage(platform, lead, message);

    return res.status(200).json({ message: "Message sent", result });
});

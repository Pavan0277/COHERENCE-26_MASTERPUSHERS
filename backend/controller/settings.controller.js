import { UserSettings } from "../models/userSettings.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSettings = asyncHandler(async (req, res) => {
    let settings = await UserSettings.findOne({ userId: req.user._id });

    if (!settings) {
        settings = await UserSettings.create({ userId: req.user._id });
    }

    // Never return the raw password — mask it for the client
    const safe = settings.toObject();
    if (safe.email?.pass)  safe.email.pass  = "••••••••";
    if (safe.vapi?.apiKey) safe.vapi.apiKey = "••••••••";

    return res.status(200).json({ settings: safe });
});

export const updateSettings = asyncHandler(async (req, res) => {
    const { email, slack, telegram, vapi } = req.body;

    // Build update object — only include provided sections
    const update = {};
    if (email)    update.email    = email;
    if (slack)    update.slack    = slack;
    if (telegram) update.telegram = telegram;
    if (vapi)     update.vapi     = vapi;

    const settings = await UserSettings.findOneAndUpdate(
        { userId: req.user._id },
        { $set: update },
        { new: true, upsert: true, runValidators: true }
    );

    const safe = settings.toObject();
    if (safe.email?.pass)  safe.email.pass  = "••••••••";
    if (safe.vapi?.apiKey) safe.vapi.apiKey = "••••••••";

    return res.status(200).json({ message: "Settings saved", settings: safe });
});

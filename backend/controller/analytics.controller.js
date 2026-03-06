import mongoose from "mongoose";
import { MessageLog } from "../models/messageLog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Aggregate counts grouped by platform + status
    const groups = await MessageLog.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: { platform: "$platform", status: "$status" },
                count: { $sum: 1 },
            },
        },
    ]);

    const byPlatform = {
        email:    { sent: 0, failed: 0, replied: 0 },
        slack:    { sent: 0, failed: 0, replied: 0 },
        telegram: { sent: 0, failed: 0, replied: 0 },
    };

    for (const g of groups) {
        const { platform, status } = g._id;
        if (byPlatform[platform]?.[status] !== undefined) {
            byPlatform[platform][status] = g.count;
        }
    }

    const totalSent   = Object.values(byPlatform).reduce((s, p) => s + p.sent,   0);
    const totalFailed = Object.values(byPlatform).reduce((s, p) => s + p.failed, 0);
    const totalReplied = Object.values(byPlatform).reduce((s, p) => s + p.replied, 0);
    const total = totalSent + totalFailed;
    const successRate = total > 0 ? Math.round((totalSent / total) * 100) : 0;

    // Last 20 send attempts for activity feed
    const recentLogs = await MessageLog.find({ userId })
        .sort({ sentAt: -1 })
        .limit(20)
        .select("leadName platform status error sentAt workflowId")
        .lean();

    return res.status(200).json({
        totalSent,
        totalFailed,
        totalReplied,
        successRate,
        byPlatform,
        recentLogs,
    });
});

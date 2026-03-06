import { asyncHandler } from "../utils/asyncHandler.js";
import { scheduleDelayedStep } from "../services/delay.service.js";

export const scheduleDelay = asyncHandler(async (req, res) => {
    const { workflowId, nodeId, leadId, min, max } = req.body;

    if (!workflowId || !nodeId) {
        return res
            .status(400)
            .json({ message: "workflowId and nodeId are required" });
    }

    if (min === undefined || max === undefined) {
        return res
            .status(400)
            .json({ message: "min and max delay (in seconds) are required" });
    }

    const result = await scheduleDelayedStep(
        { min, max },
        {
            workflowId,
            nodeId,
            leadId,
            userId: req.user._id,
        }
    );

    return res.status(200).json({
        message: "Delayed step scheduled",
        ...result,
    });
});

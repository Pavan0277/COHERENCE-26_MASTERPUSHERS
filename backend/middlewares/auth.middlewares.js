import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        let token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        token = typeof token === "string" ? token.trim() : "";
        if (!token || token === "null" || token === "undefined") {
            return res
                .status(401)
                .json({ message: "Access denied. No token provided." });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?.id).select(
            "-password -refreshToken"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

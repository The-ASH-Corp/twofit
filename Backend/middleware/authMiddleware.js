import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";
import { refreshAccessToken } from "../utils/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) return res.status(401).json({ message: "No token provided" });

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    if (err.name !== "TokenExpiredError")
      return res.status(401).json({ message: "Invalid token" });

   return refreshAccessToken(req, res, next);
  }
};


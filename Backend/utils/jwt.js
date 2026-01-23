import jwt from 'jsonwebtoken'
import redisClient from '../redis/redisClient.js';

export const generateAccessToken = (user) => {
  const id = user._id || user.id;
  return jwt.sign(
    { id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
};

export const generateRefreshToken = (user) => {
  const id = user._id || user.id;
  return jwt.sign({ id, role: user.role, email: user.email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  });
};


export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("No refresh token in cookies");
    return null;
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Ensure Redis is connected
    if (!redisClient.isOpen) {
      console.error("Redis client is not connected");
      return null;
    }

    // Get stored token from Redis
    const storedToken = await redisClient.get(`refresh:${decoded.id}`);

    if (!storedToken) {
      console.log("No stored refresh token found in Redis for user:", decoded.id);
      return null;
    }

    if (storedToken !== refreshToken) {
      console.log("Refresh token mismatch for user:", decoded.id);
      return null;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded);

    res.setHeader("x-access-token", newAccessToken);

    return decoded; // Return the decoded payload so authMiddleware can fetch the user
  } catch (err) {
    console.error("Refresh token error:", err.message);
    return null;
  }
};
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
    return null;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const storedToken = await redisClient.get(`refresh:${decoded.id}`);

    if (!storedToken || storedToken !== refreshToken)
      return null;

    const newAccessToken = generateAccessToken(decoded);

    res.setHeader("x-access-token", newAccessToken);

    return decoded; // Return the decoded payload so authMiddleware can fetch the user
  } catch (err) {
    return null;
  }
};
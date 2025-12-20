import jwt from 'jsonwebtoken'
import redisClient from '../redis/redisClient.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id??user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id ,role: user.role, email: user.email}, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};


export const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const storedToken = await redisClient.get(`refresh:${decoded.id}`);

    if (!storedToken || storedToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(decoded);

    res.setHeader("x-access-token", newAccessToken);

    req.user = jwt.verify(newAccessToken, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Refresh token expired" });
  }
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
// import { sendEmail } from "../utils/email.js";

export const adminCreateUser = async ({ email, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role,
    status: "active",
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password")

  if (!user) throw new Error("Invalid credentials");

  if (user.status !== "active")
    throw new Error("Your account is inactive. Contact admin.");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  
  return { user, accessToken, refreshToken };
};

export const adminLogin = async ({ email, password }) => {
  const user = await User.findOne({ email, role: "admin" });

  if (!user) throw new Error("Invalid admin credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid admin credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

// export const generateResetToken = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("Email not found");

//   const resetToken = jwt.sign(
//     { id: user._id },
//     process.env.JWT_SECRET,
//     { expiresIn: "15m" }
//   );

//   return { user, resetToken };
// };

// export const forgotPassword = async (email) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("Email not registered");

//   const resetToken = jwt.sign(
//     { email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: "15m" }
//   );

//   const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//   await sendEmail({
//     to: user.email,
//     subject: "TwoFit Reset Password",
//     html: `
//       <p>Hello ${user.name || "User"},</p>
//       <p>You requested a password reset.</p>
//       <p><a href="${resetLink}">Click here to reset your password</a></p>
//       <p>This link expires in 15 minutes.</p>
//     `,
//   });

//   return { message: "Reset instructions sent to email" };
// };

// export const resetPassword = async ({ token, newPassword }) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findOne({ email: decoded.email });
//     if (!user) throw new Error("User not found");

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     return { message: "Password updated successfully" };

//   } catch (err) {
//     console.error(err);
//     throw new Error("Invalid or expired token");
//   }
// };

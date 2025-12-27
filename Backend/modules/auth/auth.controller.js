import redisClient from "../../redis/redisClient.js";
import { flushAllRooms } from "../../utils/socket.js";
import * as service from "./auth.service.js";

export const createUserByAdmin = async (req, res) => {
  try {
    const user = await service.adminCreateUser(req.body);
    res.status(201).json({
      success: true,
      message: "Client account created successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const loginController = async (req, res) => {
  try {
    let data = await service.loginUser(req.body);

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    delete data.refreshToken;

    res.json({ success: true, message: "Login successful", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const adminLoginController = async (req, res) => {
  try {
    let data = await service.adminLogin(req.body);

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    delete data.refreshToken;

    res.json({ success: true, message: "Admin Login successful", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    const userId = req.user.id;
   await flushAllRooms()
    await redisClient.del(`refresh:${userId}`);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// export const forgotPasswordController = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const result = await service.forgotPassword(email);

//     res.json({ success: true, message: result.message });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// export const resetPasswordController = async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;

//     const result = await service.resetPassword({ token, newPassword });

//     res.json({ success: true, message: result.message });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

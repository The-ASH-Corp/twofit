import express from "express";
import {
  createUserByAdmin,
  loginController,
  adminLoginController,
  // forgotPasswordController,
  // resetPasswordController
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/admin/create-user",
  authMiddleware,
  allowRoles("admin"),
  createUserByAdmin
);

router.post("/auth/login", loginController);

router.post("/admin/login", adminLoginController);

//  router.post("/forgot-password", forgotPasswordController);

// // Reset Password
// router.post("/reset-password", resetPasswordController);

export default router;

import express from "express";
import * as reminderController from "./reminder.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, reminderController.getReminders);
router.patch("/toggle/:type", authMiddleware, reminderController.toggleReminderController);
router.get("/:type", reminderController.getReminder);
router.patch("/:type", authMiddleware, reminderController.updateReminderController);

export default router;

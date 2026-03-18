import express from "express";
import * as reminderController from "./reminder.controller.js";

const router = express.Router();

router.get("/", reminderController.getReminders);
router.patch("/toggle/:type", reminderController.toggleReminderController);
router.post("/test/:type", reminderController.sendTestReminderController);
router.get("/:type", reminderController.getReminder);
router.patch("/:type", reminderController.updateReminderController);

export default router;

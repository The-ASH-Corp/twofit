import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import * as notificationController from "./notification.controller.js";

const router = express.Router();

router.get("/", authMiddleware, notificationController.getAllNotifications);
router.get("/recent", authMiddleware, notificationController.getRecentNotifications);
router.get("/unread-count", authMiddleware, notificationController.getUnreadCount);
router.get("/preferences", authMiddleware, notificationController.getNotificationPreferences);
router.patch("/preferences", authMiddleware, notificationController.updateNotificationPreferences);
router.get("/admin/summary", authMiddleware, notificationController.getNotificationSummary);
router.post("/", authMiddleware, notificationController.createNotification);
router.patch("/read-all", authMiddleware, notificationController.markAllNotificationsAsRead);
router.patch("/:id/read", authMiddleware, notificationController.markNotificationAsRead);
router.patch("/:id/dismiss", authMiddleware, notificationController.dismissNotification);

export default router;

import mongoose from "mongoose";

export const DASHBOARD_NOTIFICATION_TYPES = [
  "whatsapp_delivery_failed",
  "feedback_received",
  "pending_meal_reviews",
  "expert_change_request",
  "meal_approved",
  "meal_skipped",
  "diet_feedback",
  "trainer_updated",
  "generic",
  "chat",
  "new_user",
  "new_admin",
  "new_coach",
  "welcome",
  "system_alert"
];

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: DASHBOARD_NOTIFICATION_TYPES,
      default: "generic",
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    recipientRole: {
      type: String,
      enum: ["all", "admin", "head", "founder", "user", "coach", "expert"],
      default: "all",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientRole: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
// Auto-delete after 7 days
notificationSchema.index( { createdAt: 1 }, { expireAfterSeconds: 604800 });

const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;

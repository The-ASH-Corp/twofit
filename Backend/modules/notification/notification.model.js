import mongoose from "mongoose";
import {
  DASHBOARD_NOTIFICATION_TYPES,
  DEFAULT_NOTIFICATION_EXPIRY_DAYS,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_DELIVERY_STATUSES,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_ROLES,
  getDefaultNotificationCategory,
  getDefaultNotificationPriority,
} from "./notification.constants.js";

const getDefaultExpiryDate = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + DEFAULT_NOTIFICATION_EXPIRY_DAYS);
  return expiry;
};

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: DASHBOARD_NOTIFICATION_TYPES,
      default: "generic",
    },
    category: {
      type: String,
      enum: NOTIFICATION_CATEGORIES,
      default: "generic",
    },
    priority: {
      type: String,
      enum: NOTIFICATION_PRIORITIES,
      default: "normal",
    },
    channels: {
      type: [String],
      enum: NOTIFICATION_CHANNELS,
      default: ["in_app"],
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
      enum: NOTIFICATION_ROLES,
      default: "all",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    scheduleAt: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: getDefaultExpiryDate,
    },
    dedupeKey: {
      type: String,
      trim: true,
      default: "",
    },
    deepLink: {
      type: String,
      trim: true,
      default: "",
    },
    deliveryStatus: {
      type: String,
      enum: NOTIFICATION_DELIVERY_STATUSES,
      default: "sent",
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
    dismissedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientRole: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ deliveryStatus: 1, scheduleAt: 1 });
notificationSchema.index({
  dedupeKey: 1,
  recipientId: 1,
  recipientRole: 1,
  createdAt: -1,
});
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

notificationSchema.pre("validate", function validateNotificationDefaults(next) {
  if (!this.category || this.category === "generic") {
    this.category = getDefaultNotificationCategory(this.type);
  }

  if (!this.priority || this.priority === "normal") {
    this.priority = getDefaultNotificationPriority(this.type);
  }

  const hasFutureSchedule = this.scheduleAt && new Date(this.scheduleAt) > new Date();
  if (hasFutureSchedule && !this.sentAt) {
    this.deliveryStatus = "scheduled";
  } else if (!["failed", "cancelled"].includes(this.deliveryStatus)) {
    this.deliveryStatus = "sent";
  }

  next();
});

notificationSchema.pre("save", function setSentAtIfNeeded(next) {
  if (this.deliveryStatus === "sent" && !this.sentAt) {
    this.sentAt = new Date();
  }
  next();
});

const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;

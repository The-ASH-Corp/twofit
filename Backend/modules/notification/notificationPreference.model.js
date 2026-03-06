import mongoose from "mongoose";
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_ROLES,
} from "./notification.constants.js";

const buildDefaultCategoryPreferences = () => {
  const defaults = {};
  NOTIFICATION_CATEGORIES.forEach((category) => {
    defaults[category] = {
      enabled: true,
      channels: ["in_app"],
    };
  });
  return defaults;
};

const settingSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
    channels: {
      type: [String],
      enum: NOTIFICATION_CHANNELS,
      default: ["in_app"],
    },
  },
  { _id: false },
);

const notificationPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userRole: {
      type: String,
      enum: NOTIFICATION_ROLES,
      required: true,
      default: "user",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
      trim: true,
    },
    quietHours: {
      enabled: {
        type: Boolean,
        default: false,
      },
      start: {
        type: String,
        default: "22:00",
      },
      end: {
        type: String,
        default: "07:00",
      },
    },
    dailyReminderTimes: {
      type: [String],
      default: ["08:00", "13:00", "20:00"],
    },
    missedAlertTime: {
      type: String,
      default: "21:30",
    },
    weeklyReviewReminder: {
      enabled: {
        type: Boolean,
        default: true,
      },
      dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
        default: 0,
      },
      time: {
        type: String,
        default: "10:00",
      },
    },
    weeklyEncouragement: {
      enabled: {
        type: Boolean,
        default: true,
      },
      dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
        default: 1,
      },
      time: {
        type: String,
        default: "09:00",
      },
    },
    categoryPreferences: {
      type: Map,
      of: settingSchema,
      default: buildDefaultCategoryPreferences,
    },
    typePreferences: {
      type: Map,
      of: settingSchema,
      default: {},
    },
  },
  { timestamps: true },
);

notificationPreferenceSchema.index({ userId: 1, userRole: 1 }, { unique: true });

const NotificationPreferenceModel = mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema,
);

export default NotificationPreferenceModel;

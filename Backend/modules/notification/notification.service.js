import mongoose from "mongoose";
import NotificationModel from "./notification.model.js";
import User from "../auth/auth.model.js";
import { AdminModel } from "../admin/admin.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";
import { CoachModel } from "../coach/coach.model.js";

const COACH_ROLE_ALIASES = [
  "coach",
  "expert",
  "trainer",
  "dietician",
  "dietitian",
  "therapist",
];

const normalizeRole = (rawRole = "") => {
  const role = String(rawRole || "").trim().toLowerCase();

  if (!role) return "all";
  if (COACH_ROLE_ALIASES.includes(role)) return "coach";
  if (["admin", "head", "founder", "user", "all"].includes(role)) return role;

  return "all";
};

const parseLimit = (limitValue) => {
  const parsed = Number(limitValue);
  if (!Number.isFinite(parsed)) return 4;
  return Math.max(1, Math.min(parsed, 20));
};

const toObjectIdIfValid = (value) => {
  if (!value) return null;
  if (!mongoose.Types.ObjectId.isValid(value)) return null;
  return new mongoose.Types.ObjectId(value);
};

const getRoleAliases = (role) => {
  if (role === "coach") {
    return ["coach", "expert", "trainer", "dietician", "dietitian", "therapist"];
  }
  return [role];
};

export const createNotification = async (notificationData = {}) => {
  const {
    type = "generic",
    title = "",
    message,
    recipientRole = "all",
    recipientId,
    metadata = {},
    isRead = false,
  } = notificationData;

  if (!message || !String(message).trim()) {
    throw new Error("Notification message is required");
  }

  const normalizedRole = normalizeRole(recipientRole);
  const parsedRecipientId = toObjectIdIfValid(recipientId);

  if (recipientId && !parsedRecipientId) {
    throw new Error("Invalid recipientId");
  }

  // Deduplication: Check if an unread notification of same type exists for user created today
  if (parsedRecipientId && !isRead) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingNotification = await NotificationModel.findOne({
      recipientId: parsedRecipientId,
      type,
      isRead: false,
      createdAt: { $gte: startOfDay },
    });

    if (existingNotification) {
      existingNotification.message = String(message).trim();
      existingNotification.metadata = { ...existingNotification.metadata, ...metadata };
      existingNotification.readAt = null; // Ensure it stays unread
      // Update timestamp to bubble to top
      existingNotification.createdAt = new Date(); 
      await existingNotification.save();
      return existingNotification;
    }
  }

  const notification = await NotificationModel.create({
    type,
    title,
    message: String(message).trim(),
    recipientRole: normalizedRole,
    recipientId: parsedRecipientId,
    metadata: metadata && typeof metadata === "object" ? metadata : {},
    isRead: Boolean(isRead),
    readAt: isRead ? new Date() : null,
  });

  return notification;
};


export const getRecentNotifications = async (user, query = {}) => {
  const normalizedRole = normalizeRole(user?.role);
  const rawRole = user?.role || "";
  const userId = toObjectIdIfValid(user?._id || user?.id);
  const limit = parseLimit(query.limit);

 
  let filter = {};

  try {
    if (normalizedRole === "founder") {
      filter = {};
    } else if (normalizedRole === "head") {
      const admins = await AdminModel.find({ headId: userId }).distinct('_id');
      const experts = await CoachModel.find({ adminId: { $in: admins } }).distinct('_id');
      const clients = await User.find({
        $or: [
          { dietition: { $in: experts } },
          { trainer: { $in: experts } },
          { therapist: { $in: experts } }
        ]
      }).distinct('_id');

      filter = {
        $or: [
          { recipientId: userId }, 
          { recipientId: { $in: admins } }, 
          { recipientId: { $in: experts } },
          { recipientId: { $in: clients } },
          { recipientRole: "head" },
          { recipientRole: "all" } 
        ]
      };
    } else if (normalizedRole === "admin") {
      const experts = await CoachModel.find({ adminId: userId }).distinct('_id');
      const clients = await User.find({
        $or: [
          { dietition: { $in: experts } },
          { trainer: { $in: experts } },
          { therapist: { $in: experts } }
        ]
      }).distinct('_id');

      filter = {
        $or: [
          { recipientId: userId },
          { recipientId: { $in: experts } },
          { recipientId: { $in: clients } },
          { recipientRole: "admin" },
          { recipientRole: "all" }
        ]
      };
    } else if (normalizedRole === "coach" || normalizedRole === "expert") {
      const clients = await User.find({
        $or: [
          { dietition: userId },
          { trainer: userId },
          { therapist: userId }
        ]
      }).distinct('_id');

      filter = {
        $or: [
          { recipientId: userId },
          { recipientId: { $in: clients } },
          { recipientRole: "coach" }, 
          { recipientRole: "expert" },
          { recipientRole: "trainer" },
          { recipientRole: "dietician" },
          { recipientRole: "dietitian" },
          { recipientRole: "therapist" },
          { recipientRole: rawRole }, // Also include the raw role from the user object
          { recipientRole: "all" }
        ]
      };
    } else {
      filter = {
        $or: [
          { recipientId: userId },
          { recipientRole: "user" },
          { recipientRole: "all" }
        ]
      };
    }

    const notifications = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return notifications;
  } catch (error) {
    console.error("Error in getRecentNotifications:", error);
    // Fallback to basic self-notifications if complex query fails
    return [];
  }
};


export const getAllNotifications = async (user, query = {}) => {
  const normalizedRole = normalizeRole(user?.role);
  const rawRole = user?.role || "";
  const userId = toObjectIdIfValid(user?._id || user?.id);
  const page = Number(query.page) || 1;
  const limit = Math.max(1, Math.min(Number(query.limit) || 10, 50));
  const skip = (page - 1) * limit;

  let filter = {};

  try {
    if (normalizedRole === "founder") {
      // Founder sees all notifications
      filter = {}; 
    } else if (normalizedRole === "head") {
      // 1. Get Admins assigned to this Head
      const admins = await AdminModel.find({ headId: userId }).distinct('_id');
      // 2. Get Experts assigned to those Admins
      const experts = await CoachModel.find({ adminId: { $in: admins } }).distinct('_id');
      // 3. Get Clients assigned to those Experts (dietician OR trainer OR therapist)
      const clients = await User.find({
        $or: [
          { dietition: { $in: experts } },
          { trainer: { $in: experts } },
          { therapist: { $in: experts } }
        ]
      }).distinct('_id');

      filter = {
        $or: [
          { recipientId: userId }, 
          { recipientId: { $in: admins } }, 
          { recipientId: { $in: experts } },
          { recipientId: { $in: clients } },
          { recipientRole: "head", recipientId: null },
          { recipientRole: "all", recipientId: null } 
        ]
      };
    } else if (normalizedRole === "admin") {
      const experts = await CoachModel.find({ adminId: userId }).distinct('_id');
      const clients = await User.find({
        $or: [
          { dietition: { $in: experts } },
          { trainer: { $in: experts } },
          { therapist: { $in: experts } }
        ]
      }).distinct('_id');

      filter = {
        $or: [
          { recipientId: userId },
          { recipientId: { $in: experts } },
          { recipientId: { $in: clients } },
          { recipientRole: "admin", recipientId: null },
          { recipientRole: "all", recipientId: null }
        ]
      };
    } else if (normalizedRole === "coach" || normalizedRole === "expert") {
      const clients = await User.find({
        $or: [
          { dietition: userId },
          { trainer: userId },
          { therapist: userId }
        ]
      }).distinct('_id');

      const myRoles = ["coach", "expert", "trainer", "dietician", "dietitian", "therapist", rawRole];

      filter = {
        $or: [
          { recipientId: userId },
          { recipientId: { $in: clients } },
           { recipientRole: { $in: myRoles }, recipientId: null },
          { recipientRole: "all", recipientId: null }
        ]
      };
    } else {
      // Client / User
      filter = {
        $or: [
          { recipientId: userId },
          { recipientRole: "user", recipientId: null},
          { recipientRole: "all", recipientId: null }
        ]
      };
    }

    const total = await NotificationModel.countDocuments(filter);
    const notifications = await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Error in getAllNotifications:", error);
    throw new Error("Failed to fetch notifications");
  }
};


export const markNotificationAsRead = async (notificationId, user) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error("Invalid notification id");
  }

  const normalizedRole = normalizeRole(user?.role);
  const roleAliases = getRoleAliases(normalizedRole);
  const userId = toObjectIdIfValid(user?._id || user?.id);

  const accessFilters = [
    { recipientRole: "all" },
    ...roleAliases.map((role) => ({ recipientRole: role })),
  ];

  if (userId) {
    accessFilters.push({ recipientId: userId });
  }

  const notification = await NotificationModel.findOneAndUpdate(
    {
      _id: notificationId,
      $or: accessFilters,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
    { new: true },
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

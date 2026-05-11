import mongoose from "mongoose";
import NotificationModel from "./notification.model.js";
import NotificationPreferenceModel from "./notificationPreference.model.js";
import User from "../auth/auth.model.js";
import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "../coach/coach.model.js";
import {
  DASHBOARD_NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PRIORITIES,
  getDefaultDedupeWindowMinutes,
  getDefaultNotificationCategory,
  getDefaultNotificationPriority,
} from "./notification.constants.js";

const COACH_ROLE_ALIASES = [
  "coach",
  "expert",
  "trainer",
  "dietician",
  "dietitian",
  "therapist",
];

const ALLOWED_MANAGEMENT_ROLES = new Set(["admin", "head", "founder"]);

const EVENT_DEFINITIONS = {
  welcome_message: {
    type: "welcome_message",
    category: "system",
    priority: "normal",
    title: "Welcome to TwoFit",
    message: ({ userName }) =>
      `Welcome${userName ? `, ${userName}` : ""}. Your account is ready.`,
    deepLink: "/client/dashboard",
  },
  plan_ready_message: {
    type: "plan_ready_message",
    category: "system",
    priority: "normal",
    title: "Your Plan Is Ready",
    message: ({ userName }) =>
      `${userName || "Your"} nutrition and workout plan is now available.`,
    deepLink: "/client/daily-plan",
  },
  review_reminder: {
    type: "review_reminder",
    category: "system",
    priority: "high",
    title: "Weekly Review Reminder",
    message: ({ weekLabel }) =>
      weekLabel
        ? `Weekly review pending for ${weekLabel}. Please submit your updates.`
        : "Your weekly review is pending. Please submit your updates.",
    deepLink: "/client/progress",
  },
  missed_workout_alert: {
    type: "missed_workout_alert",
    category: "system",
    priority: "high",
    title: "Workout Missed",
    message: "You missed today’s workout check-in. Log it to stay on track.",
    deepLink: "/client/daily-plan",
  },
  missed_meal_alert: {
    type: "missed_meal_alert",
    category: "system",
    priority: "high",
    title: "Meal Check-In Missed",
    message: "You missed today’s meal check-in. Update your meal status now.",
    deepLink: "/client/daily-plan",
  },
  first_10_day_morning_motivation: {
    type: "first_10_day_morning_motivation",
    category: "motivation",
    priority: "normal",
    title: "Morning Motivation",
    message: ({ dayNumber }) =>
      `Day ${dayNumber || ""} of your early journey. Stay consistent and keep momentum.`,
    deepLink: "/client/dashboard",
  },
  weekly_encouragement: {
    type: "weekly_encouragement",
    category: "motivation",
    priority: "normal",
    title: "Weekly Encouragement",
    message:
      "Another week to improve. Small daily consistency drives long-term results.",
    deepLink: "/client/dashboard",
  },
  streak_milestone_celebration: {
    type: "streak_milestone_celebration",
    category: "motivation",
    priority: "normal",
    title: "Streak Milestone",
    message: ({ streakType, milestone }) =>
      `Great work. You reached a ${milestone}-day ${streakType || "adherence"} streak.`,
    deepLink: "/client/progress",
  },
  review_pending: {
    type: "review_pending",
    category: "expert",
    priority: "high",
    title: "Client Review Pending",
    message: ({ clientName }) =>
      `${clientName || "A client"} has pending review items.`,
    deepLink: "/expert/tasks",
  },
  inactive_client_alert: {
    type: "inactive_client_alert",
    category: "expert",
    priority: "high",
    title: "Inactive Client Alert",
    message: ({ clientName, inactiveDays }) =>
      `${clientName || "A client"} has been inactive for ${inactiveDays || 0} day(s).`,
    deepLink: "/expert/dashboard",
  },
  risk_alert: {
    type: "risk_alert",
    category: "expert",
    priority: "critical",
    title: "Risk Alert",
    message: ({ clientName }) =>
      `${clientName || "A client"} is at elevated adherence risk and needs intervention.`,
    deepLink: "/expert/dashboard",
  },
  confidence_drop_alert: {
    type: "confidence_drop_alert",
    category: "expert",
    priority: "critical",
    title: "Confidence Drop Alert",
    message: ({ clientName }) =>
      `Confidence dropped for ${clientName || "a client"} in consecutive reviews.`,
    deepLink: "/expert/dashboard",
  },
};

const normalizeRole = (rawRole = "") => {
  const role = String(rawRole || "").trim().toLowerCase();

  if (!role) return "all";
  if (COACH_ROLE_ALIASES.includes(role)) return "coach";
  if (["admin", "head", "founder", "user", "all"].includes(role)) return role;

  return "all";
};

const normalizeType = (rawType = "generic") => {
  const type = String(rawType || "").trim();
  if (!type) return "generic";
  return DASHBOARD_NOTIFICATION_TYPES.includes(type) ? type : "generic";
};

const normalizeCategory = (rawCategory = "", type = "generic") => {
  const category = String(rawCategory || "").trim().toLowerCase();
  if (NOTIFICATION_CATEGORIES.includes(category)) return category;
  return getDefaultNotificationCategory(type);
};

const normalizePriority = (rawPriority = "", type = "generic") => {
  const priority = String(rawPriority || "").trim().toLowerCase();
  if (NOTIFICATION_PRIORITIES.includes(priority)) return priority;
  return getDefaultNotificationPriority(type);
};

const sanitizeChannels = (channels) => {
  const values = Array.isArray(channels) ? channels : ["in_app"];
  const unique = Array.from(
    new Set(
      values
        .map((channel) => String(channel || "").trim().toLowerCase())
        .filter((channel) => NOTIFICATION_CHANNELS.includes(channel)),
    ),
  );
  return unique.length ? unique : ["in_app"];
};

const parseDate = (dateLike) => {
  if (!dateLike) return null;
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const parseLimit = (limitValue, fallback = 10, max = 50) => {
  const parsed = Number(limitValue);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(Math.floor(parsed), max));
};

const toObjectIdIfValid = (value) => {
  if (!value) return null;
  if (!mongoose.Types.ObjectId.isValid(value)) return null;
  return new mongoose.Types.ObjectId(value);
};

const mapWeekdayToNumber = (weekday = "") => {
  const map = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? 0;
};

const getLocalTimeParts = (date, timezone = "Asia/Kolkata") => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  const hour = Number(parts.hour || 0);
  const minute = Number(parts.minute || 0);
  const second = Number(parts.second || 0);

  return {
    year: Number(parts.year || 0),
    month: Number(parts.month || 0),
    day: Number(parts.day || 0),
    hour,
    minute,
    second,
    weekday: mapWeekdayToNumber(parts.weekday),
    hhmm: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    minutesOfDay: hour * 60 + minute,
  };
};

const parseHHMMToMinutes = (timeValue = "") => {
  const [hourRaw, minuteRaw] = String(timeValue || "")
    .trim()
    .split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return hour * 60 + minute;
};

const isWithinQuietHours = (
  currentMinutes,
  startTime = "22:00",
  endTime = "07:00",
) => {
  const start = parseHHMMToMinutes(startTime);
  const end = parseHHMMToMinutes(endTime);

  if (start === null || end === null) return false;

  if (start === end) return true;

  if (start < end) {
    return currentMinutes >= start && currentMinutes < end;
  }

  return currentMinutes >= start || currentMinutes < end;
};

const getDefaultDedupeKey = ({
  type,
  recipientRole,
  recipientId,
  scheduleAt,
  category,
}) => {
  const refDate = scheduleAt ? new Date(scheduleAt) : new Date();
  const dateKey = refDate.toISOString().slice(0, 10);
  return [
    recipientId ? recipientId.toString() : "role",
    recipientRole || "all",
    category || "generic",
    type || "generic",
    dateKey,
  ].join(":");
};

const sanitizePreferenceSetting = (setting = {}, fallbackChannels = ["in_app"]) => ({
  enabled:
    typeof setting?.enabled === "boolean" ? setting.enabled : true,
  channels: sanitizeChannels(setting?.channels || fallbackChannels),
});

const mapPreferenceDoc = (doc) => {
  if (!doc) return null;
  const object = doc.toObject ? doc.toObject() : doc;
  return {
    ...object,
    categoryPreferences:
      object?.categoryPreferences instanceof Map
        ? Object.fromEntries(object.categoryPreferences)
        : object?.categoryPreferences || {},
    typePreferences:
      object?.typePreferences instanceof Map
        ? Object.fromEntries(object.typePreferences)
        : object?.typePreferences || {},
  };
};

const getOrCreatePreference = async (recipientId, recipientRole = "user") => {
  const userId = toObjectIdIfValid(recipientId);
  if (!userId) return null;

  const normalizedRole = normalizeRole(recipientRole);

  const pref = await NotificationPreferenceModel.findOneAndUpdate(
    {
      userId,
      userRole: normalizedRole,
    },
    {
      $setOnInsert: {
        userId,
        userRole: normalizedRole,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  return pref;
};

const shouldSuppressForPreference = ({
  preference,
  type,
  category,
  requestedChannels,
  scheduleAt,
}) => {
  if (!preference) {
    return {
      suppress: false,
      channels: sanitizeChannels(requestedChannels),
    };
  }

  const categoryPreferences = preference?.categoryPreferences || new Map();
  const typePreferences = preference?.typePreferences || new Map();

  const categorySetting =
    categoryPreferences instanceof Map
      ? categoryPreferences.get(category)
      : categoryPreferences?.[category];

  const typeSetting =
    typePreferences instanceof Map ? typePreferences.get(type) : typePreferences?.[type];

  const effectiveSetting = typeSetting || categorySetting || {};
  const normalizedSetting = sanitizePreferenceSetting(effectiveSetting, ["in_app"]);

  const channels = sanitizeChannels(
    requestedChannels?.length ? requestedChannels : normalizedSetting.channels,
  ).filter((channel) => normalizedSetting.channels.includes(channel));

  if (!normalizedSetting.enabled || channels.length === 0) {
    return {
      suppress: true,
      channels: [],
    };
  }

  const shouldEvaluateQuietHours =
    preference?.quietHours?.enabled &&
    (!scheduleAt || new Date(scheduleAt) <= new Date());

  if (shouldEvaluateQuietHours) {
    const timezone = preference?.timezone || "Asia/Kolkata";
    const local = getLocalTimeParts(new Date(), timezone);
    const withinQuiet = isWithinQuietHours(
      local.minutesOfDay,
      preference?.quietHours?.start,
      preference?.quietHours?.end,
    );

    if (withinQuiet) {
      return {
        suppress: true,
        channels: [],
      };
    }
  }

  return {
    suppress: false,
    channels,
  };
};

const getBaseVisibilityFilter = () => {
  const now = new Date();
  return {
    $and: [
      {
        $or: [{ scheduleAt: null }, { scheduleAt: { $exists: false } }, { scheduleAt: { $lte: now } }],
      },
      {
        $or: [{ expiresAt: null }, { expiresAt: { $exists: false } }, { expiresAt: { $gt: now } }],
      },
      {
        $or: [
          { deliveryStatus: { $exists: false } },
          { deliveryStatus: { $in: ["sent", "scheduled"] } },
        ],
      },
      { dismissedAt: null },
    ],
  };
};

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildRoleAccessFilter = async (user) => {
  const normalizedRole = normalizeRole(user?.role);
  const rawRole = String(user?.role || "").trim().toLowerCase();
  const userId = toObjectIdIfValid(user?._id || user?.id);

  if (normalizedRole === "founder") {
    return {};
  }

  if (!userId) {
    return { _id: null };
  }

  if (normalizedRole === "head") {
    const admins = await AdminModel.find({ headId: userId }).distinct("_id");
    const experts = await CoachModel.find({ adminId: { $in: admins } }).distinct("_id");
    const clients = await User.find({
      $or: [
        { dietition: { $in: experts } },
        { trainer: { $in: experts } },
        { therapist: { $in: experts } },
      ],
    }).distinct("_id");

    return {
      $or: [
        { recipientId: userId },
        { recipientId: { $in: admins } },
        { recipientId: { $in: experts } },
        { recipientId: { $in: clients } },
        { recipientRole: "head", recipientId: null },
        { recipientRole: "all", recipientId: null },
      ],
    };
  }

  if (normalizedRole === "admin") {
    const experts = await CoachModel.find({ adminId: userId }).distinct("_id");
    const clients = await User.find({
      $or: [
        { dietition: { $in: experts } },
        { trainer: { $in: experts } },
        { therapist: { $in: experts } },
      ],
    }).distinct("_id");

    return {
      $or: [
        { recipientId: userId },
        { recipientId: { $in: experts } },
        { recipientId: { $in: clients } },
        { recipientRole: "admin", recipientId: null },
        { recipientRole: "all", recipientId: null },
      ],
    };
  }

  if (normalizedRole === "coach") {
    const clients = await User.find({
      $or: [{ dietition: userId }, { trainer: userId }, { therapist: userId }],
    }).distinct("_id");

    const roles = Array.from(
      new Set([
        "coach",
        "expert",
        "trainer",
        "dietician",
        "dietitian",
        "therapist",
        rawRole,
      ]),
    ).filter(Boolean);

    return {
      $or: [
        { recipientId: userId },
        { recipientId: { $in: clients } },
        { recipientRole: { $in: roles }, recipientId: null },
        { recipientRole: "all", recipientId: null },
      ],
    };
  }

  return {
    $or: [
      { recipientId: userId },
      { recipientRole: "user", recipientId: null },
      { recipientRole: "all", recipientId: null },
    ],
  };
};

const buildListingFilter = async (user, query = {}) => {
  const normalizedRole = normalizeRole(user?.role);
  const userId = toObjectIdIfValid(user?._id || user?.id);
  const roleFilter = await buildRoleAccessFilter(user);
  const baseVisibility = getBaseVisibilityFilter();
  const andFilters = [baseVisibility];

  if (Object.keys(roleFilter).length > 0) {
    andFilters.push(roleFilter);
  }

  if (query.type && DASHBOARD_NOTIFICATION_TYPES.includes(String(query.type).trim())) {
    andFilters.push({ type: String(query.type).trim() });
  }

  if (
    query.category &&
    NOTIFICATION_CATEGORIES.includes(String(query.category).trim().toLowerCase())
  ) {
    andFilters.push({ category: String(query.category).trim().toLowerCase() });
  }

  if (
    query.priority &&
    NOTIFICATION_PRIORITIES.includes(String(query.priority).trim().toLowerCase())
  ) {
    andFilters.push({ priority: String(query.priority).trim().toLowerCase() });
  }

  if (typeof query.isRead !== "undefined") {
    const readFlag = String(query.isRead).trim().toLowerCase() === "true";
    andFilters.push({ isRead: readFlag });
  }

  if (String(query.unreadOnly || "").trim().toLowerCase() === "true") {
    andFilters.push({ isRead: false });
  }

  const fromDate = parseDate(query.fromDate);
  const toDate = parseDate(query.toDate);

  if (fromDate || toDate) {
    const createdAtFilter = {};
    if (fromDate) createdAtFilter.$gte = fromDate;
    if (toDate) createdAtFilter.$lte = toDate;
    andFilters.push({ createdAt: createdAtFilter });
  }

  if (query.q && String(query.q).trim()) {
    const regex = new RegExp(escapeRegex(String(query.q).trim()), "i");
    andFilters.push({
      $or: [{ title: regex }, { message: regex }],
    });
  }

  if (normalizedRole === "coach" && userId) {
    andFilters.push({
      $or: [{ type: { $ne: "coach_message" } }, { recipientId: userId }],
    });
  }

  if (andFilters.length === 1) {
    return andFilters[0];
  }

  return {
    $and: andFilters,
  };
};

export const processDueScheduledNotifications = async () => {
  const now = new Date();
  const result = await NotificationModel.updateMany(
    {
      deliveryStatus: "scheduled",
      scheduleAt: { $lte: now },
    },
    {
      $set: {
        deliveryStatus: "sent",
        sentAt: now,
      },
    },
  );

  return result?.modifiedCount || 0;
};

export const createNotification = async (notificationData = {}) => {
  const {
    type = "generic",
    category,
    priority,
    channels = ["in_app"],
    title = "",
    message,
    recipientRole = "all",
    recipientId,
    scheduleAt,
    expiresAt,
    dedupeKey,
    dedupeWindowMinutes,
    deepLink = "",
    metadata = {},
    isRead = false,
  } = notificationData;

  if (!message || !String(message).trim()) {
    throw new Error("Notification message is required");
  }

  const now = new Date();
  const normalizedType = normalizeType(type);
  const normalizedRole = normalizeRole(recipientRole);
  const parsedRecipientId = toObjectIdIfValid(recipientId);
  const parsedScheduleAt = scheduleAt ? parseDate(scheduleAt) : null;
  const parsedExpiresAt = expiresAt ? parseDate(expiresAt) : null;
  const normalizedCategory = normalizeCategory(category, normalizedType);
  const normalizedPriority = normalizePriority(priority, normalizedType);
  const requestedChannels = sanitizeChannels(channels);

  if (recipientId && !parsedRecipientId) {
    throw new Error("Invalid recipientId");
  }

  if (scheduleAt && !parsedScheduleAt) {
    throw new Error("Invalid scheduleAt");
  }

  if (expiresAt && !parsedExpiresAt) {
    throw new Error("Invalid expiresAt");
  }

  const preference = parsedRecipientId
    ? await getOrCreatePreference(parsedRecipientId, normalizedRole)
    : null;

  const preferenceCheck = shouldSuppressForPreference({
    preference,
    type: normalizedType,
    category: normalizedCategory,
    requestedChannels,
    scheduleAt: parsedScheduleAt,
  });

  if (preferenceCheck.suppress) {
    return null;
  }

  const effectiveDedupeKey = String(dedupeKey || "").trim()
    ? String(dedupeKey).trim()
    : getDefaultDedupeKey({
        type: normalizedType,
        recipientRole: normalizedRole,
        recipientId: parsedRecipientId,
        scheduleAt: parsedScheduleAt,
        category: normalizedCategory,
      });

  const dedupeMinutes = Math.max(
    1,
    Number(dedupeWindowMinutes) || getDefaultDedupeWindowMinutes(normalizedType),
  );

  const dedupeSince = new Date(now.getTime() - dedupeMinutes * 60 * 1000);

  const existingNotification = await NotificationModel.findOne({
    dedupeKey: effectiveDedupeKey,
    recipientRole: normalizedRole,
    recipientId: parsedRecipientId,
    createdAt: { $gte: dedupeSince },
    deliveryStatus: { $ne: "cancelled" },
    $or: [{ isRead: false }, { deliveryStatus: "scheduled" }],
  }).sort({ createdAt: -1 });

  if (existingNotification) {
    if (!existingNotification.isRead && !isRead) {
      existingNotification.title = String(title || existingNotification.title || "").trim();
      existingNotification.message = String(message).trim();
      existingNotification.metadata = {
        ...(existingNotification.metadata || {}),
        ...(metadata && typeof metadata === "object" ? metadata : {}),
      };
      existingNotification.category = normalizedCategory;
      existingNotification.priority = normalizedPriority;
      existingNotification.channels = preferenceCheck.channels;
      existingNotification.deepLink = String(deepLink || existingNotification.deepLink || "").trim();
      if (parsedScheduleAt) {
        existingNotification.scheduleAt = parsedScheduleAt;
      }
      if (parsedExpiresAt) {
        existingNotification.expiresAt = parsedExpiresAt;
      }
      await existingNotification.save();
    }
    return existingNotification;
  }

  const notification = await NotificationModel.create({
    type: normalizedType,
    category: normalizedCategory,
    priority: normalizedPriority,
    channels: preferenceCheck.channels,
    title: String(title || "").trim(),
    message: String(message).trim(),
    recipientRole: normalizedRole,
    recipientId: parsedRecipientId,
    scheduleAt: parsedScheduleAt,
    expiresAt: parsedExpiresAt || undefined,
    dedupeKey: effectiveDedupeKey,
    deepLink: String(deepLink || "").trim(),
    metadata: metadata && typeof metadata === "object" ? metadata : {},
    isRead: Boolean(isRead),
    readAt: isRead ? now : null,
    deliveryStatus: parsedScheduleAt && parsedScheduleAt > now ? "scheduled" : "sent",
    sentAt: parsedScheduleAt && parsedScheduleAt > now ? null : now,
  });

  return notification;
};

export const createNotificationFromEvent = async (eventType, payload = {}) => {
  const template = EVENT_DEFINITIONS[eventType];
  if (!template) {
    throw new Error(`Unsupported notification event: ${eventType}`);
  }

  const message =
    typeof template.message === "function"
      ? template.message(payload)
      : template.message;

  const notification = await createNotification({
    ...payload,
    type: template.type,
    category: template.category,
    priority: template.priority,
    title: payload.title || template.title,
    message: payload.message || message,
    deepLink: payload.deepLink || template.deepLink,
  });

  return notification;
};

export const getRecentNotifications = async (user, query = {}) => {
  await processDueScheduledNotifications();
  const limit = parseLimit(query.limit, 4, 20);
  const filter = await buildListingFilter(user, query);

  const notifications = await NotificationModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return notifications;
};

export const getAllNotifications = async (user, query = {}) => {
  await processDueScheduledNotifications();

  const page = parseLimit(query.page, 1, 100000);
  const limit = parseLimit(query.limit, 10, 50);
  const skip = (page - 1) * limit;
  const filter = await buildListingFilter(user, query);

  const [total, notifications] = await Promise.all([
    NotificationModel.countDocuments(filter),
    NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    notifications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUnreadCount = async (user, query = {}) => {
  await processDueScheduledNotifications();
  const filter = await buildListingFilter(user, {
    ...query,
    isRead: "false",
  });

  const totalUnread = await NotificationModel.countDocuments(filter);
  return { totalUnread };
};

export const markNotificationAsRead = async (notificationId, user) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error("Invalid notification id");
  }

  const accessFilter = await buildRoleAccessFilter(user);

  const notification = await NotificationModel.findOneAndUpdate(
    {
      _id: notificationId,
      ...(Object.keys(accessFilter).length ? accessFilter : {}),
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

export const markAllNotificationsAsRead = async (user, query = {}) => {
  const filter = await buildListingFilter(user, {
    ...query,
    isRead: "false",
  });

  const now = new Date();
  const result = await NotificationModel.updateMany(filter, {
    $set: {
      isRead: true,
      readAt: now,
    },
  });

  return {
    modifiedCount: result?.modifiedCount || 0,
  };
};

export const dismissNotification = async (notificationId, user) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error("Invalid notification id");
  }

  const accessFilter = await buildRoleAccessFilter(user);

  const notification = await NotificationModel.findOneAndUpdate(
    {
      _id: notificationId,
      ...(Object.keys(accessFilter).length ? accessFilter : {}),
    },
    {
      $set: {
        dismissedAt: new Date(),
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

export const getNotificationPreferences = async (user) => {
  const userId = toObjectIdIfValid(user?._id || user?.id);
  if (!userId) {
    throw new Error("Invalid user");
  }

  const role = normalizeRole(user?.role);
  const pref = await getOrCreatePreference(userId, role);
  return mapPreferenceDoc(pref);
};

const sanitizeTimeArray = (values = []) => {
  if (!Array.isArray(values)) return null;
  const normalized = Array.from(
    new Set(
      values
        .map((value) => String(value || "").trim())
        .filter((value) => parseHHMMToMinutes(value) !== null),
    ),
  );
  return normalized.length ? normalized : null;
};

export const updateNotificationPreferences = async (user, payload = {}) => {
  const userId = toObjectIdIfValid(user?._id || user?.id);
  if (!userId) {
    throw new Error("Invalid user");
  }

  const role = normalizeRole(user?.role);
  const pref = await getOrCreatePreference(userId, role);

  if (payload.timezone && String(payload.timezone).trim()) {
    pref.timezone = String(payload.timezone).trim();
  }

  if (payload.quietHours && typeof payload.quietHours === "object") {
    if (typeof payload.quietHours.enabled === "boolean") {
      pref.quietHours.enabled = payload.quietHours.enabled;
    }
    if (parseHHMMToMinutes(payload.quietHours.start) !== null) {
      pref.quietHours.start = payload.quietHours.start;
    }
    if (parseHHMMToMinutes(payload.quietHours.end) !== null) {
      pref.quietHours.end = payload.quietHours.end;
    }
  }

  const dailyReminderTimes = sanitizeTimeArray(payload.dailyReminderTimes);
  if (dailyReminderTimes) {
    pref.dailyReminderTimes = dailyReminderTimes;
  }

  if (parseHHMMToMinutes(payload.missedAlertTime) !== null) {
    pref.missedAlertTime = payload.missedAlertTime;
  }

  if (
    payload.weeklyReviewReminder &&
    typeof payload.weeklyReviewReminder === "object"
  ) {
    if (typeof payload.weeklyReviewReminder.enabled === "boolean") {
      pref.weeklyReviewReminder.enabled = payload.weeklyReviewReminder.enabled;
    }
    if (
      Number.isInteger(Number(payload.weeklyReviewReminder.dayOfWeek)) &&
      Number(payload.weeklyReviewReminder.dayOfWeek) >= 0 &&
      Number(payload.weeklyReviewReminder.dayOfWeek) <= 6
    ) {
      pref.weeklyReviewReminder.dayOfWeek = Number(payload.weeklyReviewReminder.dayOfWeek);
    }
    if (parseHHMMToMinutes(payload.weeklyReviewReminder.time) !== null) {
      pref.weeklyReviewReminder.time = payload.weeklyReviewReminder.time;
    }
  }

  if (
    payload.weeklyEncouragement &&
    typeof payload.weeklyEncouragement === "object"
  ) {
    if (typeof payload.weeklyEncouragement.enabled === "boolean") {
      pref.weeklyEncouragement.enabled = payload.weeklyEncouragement.enabled;
    }
    if (
      Number.isInteger(Number(payload.weeklyEncouragement.dayOfWeek)) &&
      Number(payload.weeklyEncouragement.dayOfWeek) >= 0 &&
      Number(payload.weeklyEncouragement.dayOfWeek) <= 6
    ) {
      pref.weeklyEncouragement.dayOfWeek = Number(payload.weeklyEncouragement.dayOfWeek);
    }
    if (parseHHMMToMinutes(payload.weeklyEncouragement.time) !== null) {
      pref.weeklyEncouragement.time = payload.weeklyEncouragement.time;
    }
  }

  if (payload.categoryPreferences && typeof payload.categoryPreferences === "object") {
    Object.entries(payload.categoryPreferences).forEach(([key, value]) => {
      const category = String(key || "").trim().toLowerCase();
      if (!NOTIFICATION_CATEGORIES.includes(category)) return;
      const setting = sanitizePreferenceSetting(value, ["in_app"]);
      pref.categoryPreferences.set(category, setting);
    });
  }

  if (payload.typePreferences && typeof payload.typePreferences === "object") {
    Object.entries(payload.typePreferences).forEach(([key, value]) => {
      const type = normalizeType(key);
      if (!DASHBOARD_NOTIFICATION_TYPES.includes(type)) return;
      const setting = sanitizePreferenceSetting(value, ["in_app"]);
      pref.typePreferences.set(type, setting);
    });
  }

  await pref.save();
  return mapPreferenceDoc(pref);
};

export const getNotificationSummary = async (user, query = {}) => {
  const role = normalizeRole(user?.role);
  if (!ALLOWED_MANAGEMENT_ROLES.has(role)) {
    throw new Error("Not authorized to view notification summary");
  }

  await processDueScheduledNotifications();
  const filter = await buildListingFilter(user, query);

  const [total, unread, byCategory, byType] = await Promise.all([
    NotificationModel.countDocuments(filter),
    NotificationModel.countDocuments({
      ...filter,
      isRead: false,
    }),
    NotificationModel.aggregate([
      { $match: filter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    NotificationModel.aggregate([
      { $match: filter },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 12 },
    ]),
  ]);

  return {
    total,
    unread,
    byCategory,
    byType,
  };
};

export const ensureNotificationIndexes = async () => {
  try {
    const indexes = await NotificationModel.collection.indexes();
    const legacyTtlIndex = indexes.find(
      (index) =>
        index?.key &&
        index.key.createdAt === 1 &&
        Number(index.expireAfterSeconds) === 604800,
    );

    if (legacyTtlIndex?.name) {
      await NotificationModel.collection.dropIndex(legacyTtlIndex.name);
    
    }

    await NotificationModel.syncIndexes();
  } catch (error) {
    console.error("Failed to ensure notification indexes:", error.message);
  }
};

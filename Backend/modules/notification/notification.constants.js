export const NOTIFICATION_ROLES = [
  "all",
  "admin",
  "head",
  "founder",
  "user",
  "coach",
  "expert",
  "trainer",
  "dietician",
  "dietitian",
  "therapist",
];

export const NOTIFICATION_CATEGORIES = [
  "system",
  "motivation",
  "expert",
  "engagement",
  "chat",
  "admin",
  "reminder",
  "generic",
];

export const NOTIFICATION_PRIORITIES = ["low", "normal", "high", "critical"];

export const NOTIFICATION_CHANNELS = [
  "in_app",
  "email",
  "push",
  "sms",
  "whatsapp",
];

export const NOTIFICATION_DELIVERY_STATUSES = [
  "scheduled",
  "sent",
  "failed",
  "cancelled",
];

export const DASHBOARD_NOTIFICATION_TYPES = [
  // Legacy types already present in the system/UI
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
  "system_alert",
  "weight_update",
  "alert",
  "emergency",
  "reminder",
  // Structured system types (section #9)
  "welcome_message",
  "plan_ready_message",
  "review_reminder",
  "missed_workout_alert",
  "missed_meal_alert",
  "first_10_day_morning_motivation",
  "weekly_encouragement",
  "streak_milestone_celebration",
  "review_pending",
  "inactive_client_alert",
  "risk_alert",
  "confidence_drop_alert",
  "daily_reminder",
  "system_announcement",
  "coach_message",
];

export const NOTIFICATION_TYPE_CATEGORY_MAP = {
  // Structured section #9
  welcome_message: "system",
  plan_ready_message: "system",
  review_reminder: "system",
  missed_workout_alert: "system",
  missed_meal_alert: "system",
  first_10_day_morning_motivation: "motivation",
  weekly_encouragement: "motivation",
  streak_milestone_celebration: "motivation",
  review_pending: "expert",
  inactive_client_alert: "expert",
  risk_alert: "expert",
  confidence_drop_alert: "expert",
  daily_reminder: "reminder",
  system_announcement: "admin",
  coach_message: "chat",

  // Existing mappings
  feedback_received: "expert",
  pending_meal_reviews: "expert",
  expert_change_request: "expert",
  meal_approved: "system",
  meal_skipped: "system",
  diet_feedback: "expert",
  trainer_updated: "expert",
  chat: "chat",
  welcome: "system",
  reminder: "reminder",
  system_alert: "system",
  whatsapp_delivery_failed: "system",
  new_user: "admin",
  new_admin: "admin",
  new_coach: "admin",
  weight_update: "engagement",
  alert: "system",
  emergency: "system",
  generic: "generic",
};

export const NOTIFICATION_TYPE_PRIORITY_MAP = {
  review_pending: "high",
  inactive_client_alert: "high",
  risk_alert: "critical",
  confidence_drop_alert: "critical",
  missed_workout_alert: "high",
  missed_meal_alert: "high",
  whatsapp_delivery_failed: "high",
  emergency: "critical",
  alert: "high",
  system_alert: "high",
  default: "normal",
};

export const NOTIFICATION_TYPE_DEDUPE_MINUTES = {
  daily_reminder: 120,
  review_reminder: 12 * 60,
  weekly_encouragement: 7 * 24 * 60,
  streak_milestone_celebration: 7 * 24 * 60,
  inactive_client_alert: 24 * 60,
  risk_alert: 24 * 60,
  missed_workout_alert: 24 * 60,
  missed_meal_alert: 24 * 60,
};

export const DEFAULT_NOTIFICATION_EXPIRY_DAYS = 30;

export const getDefaultNotificationCategory = (type = "generic") =>
  NOTIFICATION_TYPE_CATEGORY_MAP[type] || "generic";

export const getDefaultNotificationPriority = (type = "generic") =>
  NOTIFICATION_TYPE_PRIORITY_MAP[type] || NOTIFICATION_TYPE_PRIORITY_MAP.default;

export const getDefaultDedupeWindowMinutes = (type = "generic") =>
  NOTIFICATION_TYPE_DEDUPE_MINUTES[type] || 60;

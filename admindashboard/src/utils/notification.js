export const formatNotificationTime = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "N/A";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (diffInDays <= 0) {
    return `Today, ${time}`;
  }

  if (diffInDays === 1) {
    return `Yesterday, ${time}`;
  }

  return `${diffInDays} Days Ago, ${time}`;
};

const DASHBOARD_NOTIFICATION_STYLE_MAP = {
  whatsapp_delivery_failed: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#0A4F48]",
  },
  feedback_received: {
    bgClass: "bg-[#FAF3E0]",
    icon: "message",
    iconClass: "text-[#DAA520]",
  },
  pending_meal_reviews: {
    bgClass: "bg-[#F0FDF4]",
    icon: "refresh",
    iconClass: "text-[#45C4A2]",
  },
  expert_change_request: {
    bgClass: "bg-[#FAF3E0]",
    icon: "bell",
    iconClass: "text-[#DAA520]",
  },
  meal_approved: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#0A4F48]",
  },
  meal_skipped: {
    bgClass: "bg-[#FAF3E0]",
    icon: "bell",
    iconClass: "text-[#DAA520]",
  },
  diet_feedback: {
    bgClass: "bg-[#FAF3E0]",
    icon: "message",
    iconClass: "text-[#DAA520]",
  },
  trainer_updated: {
    bgClass: "bg-[#F0FDF4]",
    icon: "refresh",
    iconClass: "text-[#45C4A2]",
  },
  welcome_message: {
    bgClass: "bg-[#E6F6EE]",
    icon: "bell",
    iconClass: "text-[#0A4F48]",
  },
  plan_ready_message: {
    bgClass: "bg-[#EBF3F2]",
    icon: "refresh",
    iconClass: "text-[#0A4F48]",
  },
  review_reminder: {
    bgClass: "bg-[#FFF7E8]",
    icon: "bell",
    iconClass: "text-[#DAA520]",
  },
  daily_reminder: {
    bgClass: "bg-[#FFF7E8]",
    icon: "bell",
    iconClass: "text-[#DAA520]",
  },
  missed_workout_alert: {
    bgClass: "bg-[#FFECEC]",
    icon: "message",
    iconClass: "text-[#D14343]",
  },
  missed_meal_alert: {
    bgClass: "bg-[#FFECEC]",
    icon: "message",
    iconClass: "text-[#D14343]",
  },
  first_10_day_morning_motivation: {
    bgClass: "bg-[#F0F9FF]",
    icon: "refresh",
    iconClass: "text-[#2563EB]",
  },
  weekly_encouragement: {
    bgClass: "bg-[#F0F9FF]",
    icon: "refresh",
    iconClass: "text-[#2563EB]",
  },
  streak_milestone_celebration: {
    bgClass: "bg-[#FFF7E8]",
    icon: "refresh",
    iconClass: "text-[#DAA520]",
  },
  review_pending: {
    bgClass: "bg-[#FAF3E0]",
    icon: "message",
    iconClass: "text-[#DAA520]",
  },
  inactive_client_alert: {
    bgClass: "bg-[#FFECEC]",
    icon: "message",
    iconClass: "text-[#D14343]",
  },
  risk_alert: {
    bgClass: "bg-[#FFECEC]",
    icon: "message",
    iconClass: "text-[#B91C1C]",
  },
  confidence_drop_alert: {
    bgClass: "bg-[#FFECEC]",
    icon: "message",
    iconClass: "text-[#B91C1C]",
  },
  system_announcement: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#0A4F48]",
  },
  coach_message: {
    bgClass: "bg-[#EAF5FF]",
    icon: "message",
    iconClass: "text-[#1D4ED8]",
  },
  new_admin: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#0A4F48]",
  },
  new_coach: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#0A4F48]",
  },
  generic: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#0A4F48]",
  },
};

export const getDashboardNotificationStyle = (type) =>
  DASHBOARD_NOTIFICATION_STYLE_MAP[type] || DASHBOARD_NOTIFICATION_STYLE_MAP.generic;

const CLIENT_NOTIFICATION_BUBBLE_CLASS = {
  meal_skipped: "bg-[#FBEAD9]",
  diet_feedback: "bg-[#FBEAD9]",
  expert_change_request: "bg-[#FBEAD9]",
  feedback_received: "bg-[#FBEAD9]",
  whatsapp_delivery_failed: "bg-[#0A4F48]",
  pending_meal_reviews: "bg-[#0A4F48]",
  meal_approved: "bg-[#0A4F48]",
  trainer_updated: "bg-[#FBEAD9]",
  welcome_message: "bg-[#0A4F48]",
  plan_ready_message: "bg-[#0A4F48]",
  review_reminder: "bg-[#FBEAD9]",
  daily_reminder: "bg-[#FBEAD9]",
  missed_workout_alert: "bg-[#FBEAD9]",
  missed_meal_alert: "bg-[#FBEAD9]",
  first_10_day_morning_motivation: "bg-[#0A4F48]",
  weekly_encouragement: "bg-[#0A4F48]",
  streak_milestone_celebration: "bg-[#0A4F48]",
  review_pending: "bg-[#FBEAD9]",
  inactive_client_alert: "bg-[#FBEAD9]",
  risk_alert: "bg-[#FBEAD9]",
  confidence_drop_alert: "bg-[#FBEAD9]",
  system_announcement: "bg-[#0A4F48]",
  coach_message: "bg-[#0A4F48]",
  new_admin: "bg-[#0A4F48]",
  new_coach: "bg-[#0A4F48]",
  generic: "bg-[#0A4F48]",
};

export const getClientNotificationBubbleClass = (type) =>
  CLIENT_NOTIFICATION_BUBBLE_CLASS[type] || CLIENT_NOTIFICATION_BUBBLE_CLASS.generic;

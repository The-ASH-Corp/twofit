import cron from "node-cron";
import User from "../modules/auth/auth.model.js";
import TaskSubmission from "../modules/taskSubmission/taskSubmission.model.js";
import NotificationPreferenceModel from "../modules/notification/notificationPreference.model.js";
import {
  createNotification,
  createNotificationFromEvent,
  processDueScheduledNotifications,
} from "../modules/notification/notification.service.js";
import { getAdherenceStreaksService } from "../modules/clients/client.services.js";

const ACCEPTED_STATUSES = new Set(["pending", "verified"]);
const STREAK_MILESTONES = new Set([7, 21, 50, 100]);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

let isAutomationRunning = false;

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

const normalizeReminderTimes = (times, fallback) => {
  const source = Array.isArray(times) ? times : fallback;
  const cleaned = Array.from(
    new Set(
      source
        .map((time) => String(time || "").trim())
        .filter((time) => parseHHMMToMinutes(time) !== null),
    ),
  );
  return cleaned.length ? cleaned : fallback;
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

  return {
    weekday: mapWeekdayToNumber(parts.weekday),
    minutesOfDay: hour * 60 + minute,
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
};

const isTimeInWindow = (
  currentMinutes,
  targetTime,
  windowMinutes = 10,
) => {
  const target = parseHHMMToMinutes(targetTime);
  if (target === null) return false;
  return currentMinutes >= target && currentMinutes < target + windowMinutes;
};

const toDateKeyInTimezone = (date, timezone = "Asia/Kolkata") => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(parsed)
    .reduce((acc, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
};

const countCompletedTaskType = (exercises = [], taskType = "Workout") =>
  (exercises || []).filter((exercise) => {
    const type = String(exercise?.taskType || "").toLowerCase();
    const status = String(exercise?.status || "").toLowerCase();
    return type === String(taskType).toLowerCase() && ACCEPTED_STATUSES.has(status);
  }).length;

const toExpertIds = (user) =>
  [user?.trainer, user?.dietition, user?.therapist]
    .filter(Boolean)
    .map((value) => value.toString());

const notifyExpertChain = async ({
  eventType,
  user,
  dedupeSuffix,
  inactiveDays,
  extraMetadata = {},
}) => {
  const expertIds = toExpertIds(user);

  await Promise.all(
    expertIds.map((expertId) =>
      createNotificationFromEvent(eventType, {
        recipientRole: "coach",
        recipientId: expertId,
        clientName: user?.name,
        inactiveDays,
        metadata: {
          clientId: user?._id,
          ...extraMetadata,
        },
        dedupeKey: `${eventType}:coach:${expertId}:${user?._id}:${dedupeSuffix}`,
      }).catch((error) => {
        console.error(`Notification ${eventType} -> coach failed:`, error.message);
      }),
    ),
  );

  await Promise.all(
    ["admin", "head", "founder"].map((role) =>
      createNotificationFromEvent(eventType, {
        recipientRole: role,
        clientName: user?.name,
        inactiveDays,
        metadata: {
          clientId: user?._id,
          ...extraMetadata,
        },
        dedupeKey: `${eventType}:${role}:${user?._id}:${dedupeSuffix}`,
      }).catch((error) => {
        console.error(`Notification ${eventType} -> ${role} failed:`, error.message);
      }),
    ),
  );
};

const emitUserDailyNotifications = async ({
  user,
  preference,
  todaySubmission,
  localNow,
  dateKey,
  submittedToday,
}) => {
  const fallbackTimes = ["08:00", "13:00", "20:00"];
  const reminderTimes = normalizeReminderTimes(
    preference?.dailyReminderTimes,
    fallbackTimes,
  );
  const missedAlertTime = String(preference?.missedAlertTime || "21:30");
  const dayNumber = Math.max(1, Number(user?.currentGlobalDay || 1));
  const expectedMealCount = Math.max(1, Number(user?.dietPlanMealCount || 5));

  for (const reminderTime of reminderTimes) {
    if (!submittedToday && isTimeInWindow(localNow.minutesOfDay, reminderTime, 10)) {
      await createNotification({
        type: "daily_reminder",
        title: "Daily Check-In Reminder",
        message: "Please log today’s workout, meal, water, and habit progress.",
        recipientRole: "user",
        recipientId: user?._id,
        category: "reminder",
        priority: "normal",
        metadata: {
          dateKey,
          reminderTime,
        },
        dedupeKey: `daily-reminder:${user?._id}:${dateKey}:${reminderTime}`,
      });
    }
  }

  const morningTime = reminderTimes[0] || "08:00";
  if (dayNumber <= 10 && isTimeInWindow(localNow.minutesOfDay, morningTime, 10)) {
    await createNotificationFromEvent("first_10_day_morning_motivation", {
      recipientRole: "user",
      recipientId: user?._id,
      dayNumber,
      metadata: { dayNumber, dateKey },
      dedupeKey: `first10-motivation:${user?._id}:${dateKey}`,
    });
  }

  const weeklyEncouragement = preference?.weeklyEncouragement || {};
  const encouragementDay =
    Number.isInteger(Number(weeklyEncouragement?.dayOfWeek))
      ? Number(weeklyEncouragement.dayOfWeek)
      : 1;
  const encouragementTime = String(weeklyEncouragement?.time || "09:00");

  if (
    weeklyEncouragement?.enabled !== false &&
    localNow.weekday === encouragementDay &&
    isTimeInWindow(localNow.minutesOfDay, encouragementTime, 10)
  ) {
    await createNotificationFromEvent("weekly_encouragement", {
      recipientRole: "user",
      recipientId: user?._id,
      metadata: { dateKey },
      dedupeKey: `weekly-encouragement:${user?._id}:${dateKey}`,
    });
  }

  const weeklyReview = preference?.weeklyReviewReminder || {};
  const reviewDay =
    Number.isInteger(Number(weeklyReview?.dayOfWeek))
      ? Number(weeklyReview.dayOfWeek)
      : 0;
  const reviewTime = String(weeklyReview?.time || "10:00");

  if (
    weeklyReview?.enabled !== false &&
    localNow.weekday === reviewDay &&
    isTimeInWindow(localNow.minutesOfDay, reviewTime, 10)
  ) {
    await createNotificationFromEvent("review_reminder", {
      recipientRole: "user",
      recipientId: user?._id,
      weekLabel: `week ${Math.ceil(dayNumber / 7)}`,
      metadata: { dateKey, week: Math.ceil(dayNumber / 7) },
      dedupeKey: `weekly-review:${user?._id}:${dateKey}`,
    });

    await notifyExpertChain({
      eventType: "review_pending",
      user,
      dedupeSuffix: dateKey,
      extraMetadata: {
        reason: "weekly_review_due",
        week: Math.ceil(dayNumber / 7),
      },
    });
  }

  if (isTimeInWindow(localNow.minutesOfDay, missedAlertTime, 10)) {
    const exercises = todaySubmission?.exercises || [];
    const completedWorkouts = countCompletedTaskType(exercises, "Workout");
    const completedMeals = countCompletedTaskType(exercises, "Meal");

    if (completedWorkouts === 0) {
      await createNotificationFromEvent("missed_workout_alert", {
        recipientRole: "user",
        recipientId: user?._id,
        metadata: { dateKey, currentGlobalDay: user?.currentGlobalDay },
        dedupeKey: `missed-workout:${user?._id}:${dateKey}`,
      });
    }

    if (completedMeals < expectedMealCount) {
      await createNotificationFromEvent("missed_meal_alert", {
        recipientRole: "user",
        recipientId: user?._id,
        metadata: {
          dateKey,
          currentGlobalDay: user?.currentGlobalDay,
          completedMeals,
          expectedMealCount,
        },
        dedupeKey: `missed-meal:${user?._id}:${dateKey}`,
      });
    }

    if (completedWorkouts === 0 && completedMeals < expectedMealCount) {
      await notifyExpertChain({
        eventType: "risk_alert",
        user,
        dedupeSuffix: dateKey,
        extraMetadata: {
          reason: "same_day_meal_and_workout_missed",
        },
      });
    }
  }
};

const maybeEmitStreakMilestone = async ({ user, localNow, dateKey }) => {
  if (!isTimeInWindow(localNow.minutesOfDay, "09:00", 10)) {
    return;
  }

  const streaks = await getAdherenceStreaksService(user?._id).catch(() => null);
  if (!streaks || typeof streaks !== "object") {
    return;
  }

  const streakEntries = Object.entries(streaks);

  for (const [streakType, values] of streakEntries) {
    const milestone = Number(values?.activeStreak || 0);
    if (!STREAK_MILESTONES.has(milestone)) continue;

    await createNotificationFromEvent("streak_milestone_celebration", {
      recipientRole: "user",
      recipientId: user?._id,
      streakType,
      milestone,
      metadata: {
        streakType,
        milestone,
        dateKey,
      },
      dedupeKey: `streak-milestone:${user?._id}:${streakType}:${milestone}:${dateKey}`,
    });
  }
};

const maybeEmitInactivityAlerts = async ({
  user,
  localNow,
  dateKey,
  timezone,
  now,
}) => {
  if (!isTimeInWindow(localNow.minutesOfDay, "10:00", 10)) {
    return;
  }

  const lastSubmission = user?.lastTaskSubmissionDate
    ? new Date(user.lastTaskSubmissionDate)
    : null;

  if (!lastSubmission || Number.isNaN(lastSubmission.getTime())) {
    return;
  }

  const todayKey = toDateKeyInTimezone(now, timezone);
  const lastKey = toDateKeyInTimezone(lastSubmission, timezone);

  if (!todayKey || !lastKey) return;

  const diffMs =
    new Date(`${todayKey}T00:00:00Z`).getTime() -
    new Date(`${lastKey}T00:00:00Z`).getTime();
  const inactivityDays = Math.max(0, Math.floor(diffMs / MS_PER_DAY));

  if (inactivityDays >= 2) {
    await notifyExpertChain({
      eventType: "inactive_client_alert",
      user,
      inactiveDays,
      dedupeSuffix: dateKey,
      extraMetadata: {
        reason: "no_submission",
        inactivityDays,
      },
    });
  }

  if (inactivityDays >= 4) {
    await notifyExpertChain({
      eventType: "risk_alert",
      user,
      inactiveDays,
      dedupeSuffix: dateKey,
      extraMetadata: {
        reason: "prolonged_inactivity",
        inactivityDays,
      },
    });
  }
};

const processUserAutomation = async ({
  user,
  taskSubmission,
  preference,
  now,
}) => {
  const timezone = preference?.timezone || "Asia/Kolkata";
  const localNow = getLocalTimeParts(now, timezone);
  const dateKey = localNow.dateKey;
  const lastSubmissionKey = toDateKeyInTimezone(user?.lastTaskSubmissionDate, timezone);
  const submittedToday = Boolean(lastSubmissionKey && lastSubmissionKey === dateKey);

  const todaySubmission = (taskSubmission?.dailySubmissions || []).find(
    (day) => Number(day?.globalDayIndex) === Number(user?.currentGlobalDay || 1),
  );

  await emitUserDailyNotifications({
    user,
    preference,
    todaySubmission,
    localNow,
    dateKey,
    submittedToday,
  });

  await maybeEmitStreakMilestone({
    user,
    localNow,
    dateKey,
  });

  await maybeEmitInactivityAlerts({
    user,
    localNow,
    dateKey,
    timezone,
    now,
  });
};

export const runNotificationAutomation = async () => {
  if (isAutomationRunning) return;
  isAutomationRunning = true;

  try {
    await processDueScheduledNotifications();

    const now = new Date();
    const users = await User.find({ role: "user", status: "Active" })
      .select(
        "_id name currentGlobalDay lastTaskSubmissionDate trainer dietition therapist dietPlanMealCount",
      )
      .lean();

    if (!users.length) return;

    const userIds = users.map((user) => user._id);

    const [taskSubmissionDocs, preferences] = await Promise.all([
      TaskSubmission.find({ userId: { $in: userIds } })
        .select("userId dailySubmissions.globalDayIndex dailySubmissions.exercises")
        .lean(),
      NotificationPreferenceModel.find({
        userId: { $in: userIds },
        userRole: "user",
      }).lean(),
    ]);

    const submissionMap = new Map(
      taskSubmissionDocs.map((doc) => [doc.userId.toString(), doc]),
    );
    const preferenceMap = new Map(
      preferences.map((doc) => [doc.userId.toString(), doc]),
    );

    for (const user of users) {
      try {
        await processUserAutomation({
          user,
          taskSubmission: submissionMap.get(user._id.toString()),
          preference: preferenceMap.get(user._id.toString()),
          now,
        });
      } catch (userError) {
        console.error(
          `Notification automation failed for user ${user?._id}:`,
          userError.message,
        );
      }
    }
  } catch (error) {
    console.error("Notification automation run failed:", error.message);
  } finally {
    isAutomationRunning = false;
  }
};

export const startNotificationCron = () => {
  cron.schedule(
    "*/10 * * * *",
    async () => {
      await runNotificationAutomation();
    },
    {
      timezone: "UTC",
    },
  );

  setTimeout(() => {
    runNotificationAutomation().catch((error) =>
      console.error("Initial notification automation run failed:", error.message),
    );
  }, 15000);
};

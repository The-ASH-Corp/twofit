import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store/hooks";
import { getClientHabitsThunk } from "@/redux/features/habit/habit.thunk";
import { fetchWaterIntake, getUserTaskStatus } from "@/redux/features/tasks/task.thunk";
import {
  CheckCircle2,
  Droplets,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";

const MILESTONE_DAYS = [7, 21, 50, 100];
const WATER_GOAL_ML = 2000;
const STORAGE_VERSION = 1;

const STREAK_TYPES = [
  {
    key: "workout",
    label: "Workout",
    icon: Dumbbell,
    iconClasses: "bg-[#E7F5F3] text-[#0A4F48]",
  },
  {
    key: "diet",
    label: "Diet",
    icon: UtensilsCrossed,
    iconClasses: "bg-[#FFF2E8] text-[#B45309]",
  },
  {
    key: "water",
    label: "Water",
    icon: Droplets,
    iconClasses: "bg-[#E9F4FF] text-[#1D4ED8]",
  },
  {
    key: "habit",
    label: "Habit",
    icon: CheckCircle2,
    iconClasses: "bg-[#ECFDF3] text-[#047857]",
  },
];

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateKey(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toDayNumber(dayKey) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function createEmptyTracker() {
  return {
    workout: {},
    diet: {},
    water: {},
    habit: {},
  };
}

function sanitizeTracker(rawTracker) {
  const sanitized = createEmptyTracker();
  if (!rawTracker || typeof rawTracker !== "object") return sanitized;

  Object.keys(sanitized).forEach((typeKey) => {
    const entries = rawTracker[typeKey];
    if (!entries || typeof entries !== "object") return;

    Object.entries(entries).forEach(([dateKey, isDone]) => {
      if (isDone === true && isValidDateKey(dateKey)) {
        sanitized[typeKey][dateKey] = true;
      }
    });
  });

  return sanitized;
}

function calculateStreaks(dateMap, todayKey) {
  const dayNumbers = Object.keys(dateMap || {})
    .filter((dateKey) => dateMap[dateKey] === true && isValidDateKey(dateKey))
    .map(toDayNumber)
    .filter((dayNumber) => Number.isFinite(dayNumber))
    .sort((a, b) => a - b);

  if (!dayNumbers.length) {
    return { current: 0, longest: 0 };
  }

  let longest = 0;
  let run = 0;
  let previous = null;

  dayNumbers.forEach((dayNumber) => {
    if (previous !== null && dayNumber === previous + 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    previous = dayNumber;
  });

  const completedDays = new Set(dayNumbers);
  let probe = toDayNumber(todayKey);
  let current = 0;

  while (completedDays.has(probe)) {
    current += 1;
    probe -= 1;
  }

  return { current, longest };
}

function getAdherenceStorageKey(userId) {
  if (!userId) return null;
  return `twofit.adherence.v${STORAGE_VERSION}.${userId}`;
}

function isSubmitted(status) {
  return ["pending", "verified"].includes(String(status || "").toLowerCase());
}

export default function AdherenceStreaks({ user, program, className }) {
  const dispatch = useDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const waterIntakeByDay = useAppSelector((state) => state.tasks.waterIntakeByDay);
  const habits = useAppSelector((state) => state.habit.habits);
  const [tracker, setTracker] = useState(createEmptyTracker);
  const [hasHydrated, setHasHydrated] = useState(false);

  const userId = user?._id;
  const storageKey = useMemo(() => getAdherenceStorageKey(userId), [userId]);
  const currentGlobalDay = user?.currentGlobalDay || 1;
  const waterIntakeMl = Number(waterIntakeByDay[currentGlobalDay] || 0);

  useEffect(() => {
    if (!userId) return;
    dispatch(getUserTaskStatus());
    dispatch(fetchWaterIntake(currentGlobalDay));
    dispatch(getClientHabitsThunk(userId));
  }, [currentGlobalDay, dispatch, userId]);

  useEffect(() => {
    setHasHydrated(false);

    if (!storageKey) {
      setTracker(createEmptyTracker());
      setHasHydrated(true);
      return;
    }

    try {
      const storedValue = localStorage.getItem(storageKey);
      if (!storedValue) {
        setTracker(createEmptyTracker());
        return;
      }

      const parsed = JSON.parse(storedValue);
      const records = parsed?.records ?? parsed;
      setTracker(sanitizeTracker(records));
    } catch (error) {
      console.error("Failed to parse adherence tracker data:", error);
      setTracker(createEmptyTracker());
    } finally {
      setHasHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || !hasHydrated) return;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: STORAGE_VERSION,
        records: tracker,
      }),
    );
  }, [hasHydrated, storageKey, tracker]);

  const autoCompletionByType = useMemo(() => {
    const currentGlobalDay = user?.currentGlobalDay || 1;

    const planDays =
      program?.plan?.weeks?.flatMap((week, weekIndex) =>
        week.days.map((day, dayIndex) => ({
          ...day,
          globalIndex: weekIndex * 7 + dayIndex + 1,
        })),
      ) || [];

    const currentPlanDay = planDays[currentGlobalDay - 1];
    const workoutCount = currentPlanDay?.exercises?.length || 0;

    const isWeightLoss = program?.title?.toLowerCase().includes("weight loss");
    const defaultMealCount = isWeightLoss ? 5 : 6;
    const mealCount = user?.dietPlanMealCount || defaultMealCount;

    const workoutComplete =
      workoutCount > 0 &&
      Array.from({ length: workoutCount }).every((_, exerciseIndex) => {
        const submission = tasks?.find(
          (task) =>
            task.globalDayIndex === currentGlobalDay &&
            task.exerciseIndex === exerciseIndex &&
            task.taskType === "Workout",
        );
        return isSubmitted(submission?.status);
      });

    const dietComplete =
      mealCount > 0 &&
      Array.from({ length: mealCount }).every((_, mealIndex) => {
        const submission = tasks?.find(
          (task) =>
            task.globalDayIndex === currentGlobalDay &&
            task.exerciseIndex === 100 + mealIndex &&
            task.taskType === "Meal",
        );
        return isSubmitted(submission?.status);
      });

    const habitList = habits?.habits || [];
    const todayKey = getTodayKey();
    const habitComplete =
      habitList.length > 0 &&
      habitList.every((habit) => {
        const todayLog = habit?.logs?.find(
          (log) => getDateKey(log?.date) === todayKey,
        );
        return todayLog?.status === "done";
      });

    return {
      workout: workoutComplete,
      diet: dietComplete,
      water: waterIntakeMl >= WATER_GOAL_ML,
      habit: habitComplete,
    };
  }, [habits?.habits, program?.plan?.weeks, program?.title, tasks, user, waterIntakeMl]);

  useEffect(() => {
    if (!hasHydrated) return;

    const todayKey = getTodayKey();
    setTracker((previous) => {
      let hasChanges = false;
      const next = { ...previous };

      Object.entries(autoCompletionByType).forEach(([typeKey, isDone]) => {
        const typeMap = previous[typeKey] || {};
        const hasToday = Boolean(typeMap[todayKey]);

        if (isDone && !hasToday) {
          hasChanges = true;
          next[typeKey] = { ...typeMap, [todayKey]: true };
        }

        if (!isDone && hasToday) {
          hasChanges = true;
          const updated = { ...typeMap };
          delete updated[todayKey];
          next[typeKey] = updated;
        }
      });

      return hasChanges ? next : previous;
    });
  }, [autoCompletionByType, hasHydrated]);

  const todayKey = getTodayKey();

  const streakByType = useMemo(() => {
    return STREAK_TYPES.reduce((acc, type) => {
      const typeMap = tracker[type.key] || {};
      const { current, longest } = calculateStreaks(typeMap, todayKey);

      acc[type.key] = {
        current,
        longest,
        doneToday: Boolean(typeMap[todayKey]),
      };

      return acc;
    }, {});
  }, [todayKey, tracker]);

  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[#0A4F48] font-bold text-sm">
            Daily Adherence Streaks
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Auto-updated from workout, diet, water, and habit completion.
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-500">{todayKey}</span>
      </div>

      <div className="space-y-3">
        {STREAK_TYPES.map((type) => {
          const Icon = type.icon;
          const stats = streakByType[type.key] || {
            current: 0,
            longest: 0,
            doneToday: false,
          };

          return (
            <div key={type.key} className="border border-slate-100 rounded-xl p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 " +
                      type.iconClasses
                    }
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1E293B] truncate">
                      {type.label} Streak
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Current: {stats.current}d | Longest: {stats.longest}d
                    </p>
                  </div>
                </div>

                <span
                  className={
                    "text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 " +
                    (stats.doneToday
                      ? "bg-[#DCFCE7] text-[#166534] border-[#86EFAC]"
                      : "bg-slate-50 text-slate-500 border-slate-200")
                  }
                >
                  {stats.doneToday ? "Completed Today" : "Not Complete"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {MILESTONE_DAYS.map((milestone) => {
                  const unlocked = stats.longest >= milestone;
                  return (
                    <span
                      key={milestone}
                      className={
                        "text-[10px] font-bold px-2 py-1 rounded-full border " +
                        (unlocked
                          ? "bg-[#DCFCE7] text-[#166534] border-[#86EFAC]"
                          : "bg-slate-50 text-slate-500 border-slate-200")
                      }
                    >
                      {milestone}d
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        Missing one full day resets the current streak for that adherence type.
      </p>
    </div>
  );
}

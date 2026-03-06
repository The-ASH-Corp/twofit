import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { fetchClientAdherenceStreaks } from "@/redux/features/client/client.thunk";
import {
  CheckCircle2,
  Droplets,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";

const MILESTONE_DAYS = [7, 21, 50, 100];

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

function createDefaultStreakState() {
  return {
    workout: { activeStreak: 0, longestStreak: 0, doneToday: false },
    diet: { activeStreak: 0, longestStreak: 0, doneToday: false },
    water: { activeStreak: 0, longestStreak: 0, doneToday: false },
    habit: { activeStreak: 0, longestStreak: 0, doneToday: false },
  };
}

export default function AdherenceStreaks({ user, className }) {
  const dispatch = useDispatch();
  const [streakByType, setStreakByType] = useState(createDefaultStreakState);

  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchClientAdherenceStreaks(userId))
      .unwrap()
      .then((response) => {
        const data = response || {};
        const defaults = createDefaultStreakState();

        setStreakByType({
          workout: { ...defaults.workout, ...(data.workout || {}) },
          diet: { ...defaults.diet, ...(data.diet || {}) },
          water: { ...defaults.water, ...(data.water || {}) },
          habit: { ...defaults.habit, ...(data.habit || {}) },
        });
      })
      .catch((error) => {
        console.error("Failed to fetch adherence streaks:", error);
      });
  }, [dispatch, userId]);

  const todayKey = getTodayKey();

  const renderedStreakByType = useMemo(
    () => ({
      workout: {
        current: Number(streakByType?.workout?.activeStreak || 0),
        longest: Number(streakByType?.workout?.longestStreak || 0),
        doneToday: Boolean(streakByType?.workout?.doneToday),
      },
      diet: {
        current: Number(streakByType?.diet?.activeStreak || 0),
        longest: Number(streakByType?.diet?.longestStreak || 0),
        doneToday: Boolean(streakByType?.diet?.doneToday),
      },
      water: {
        current: Number(streakByType?.water?.activeStreak || 0),
        longest: Number(streakByType?.water?.longestStreak || 0),
        doneToday: Boolean(streakByType?.water?.doneToday),
      },
      habit: {
        current: Number(streakByType?.habit?.activeStreak || 0),
        longest: Number(streakByType?.habit?.longestStreak || 0),
        doneToday: Boolean(streakByType?.habit?.doneToday),
      },
    }),
    [streakByType],
  );

  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm", className)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[#0A4F48] font-bold text-sm">
            Daily Adherence Streaks
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Synced from backend streak calculations.
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-500">{todayKey}</span>
      </div>

      <div className="space-y-3">
        {STREAK_TYPES.map((type) => {
          const Icon = type.icon;
          const stats = renderedStreakByType[type.key] || {
            current: 0,
            longest: 0,
            doneToday: false,
          };

          return (
            <div
              key={type.key}
              className="border border-slate-100 rounded-xl p-3"
            >
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

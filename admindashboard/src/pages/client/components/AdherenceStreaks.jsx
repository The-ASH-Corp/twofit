import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { fetchClientAdherenceStreaks } from "@/redux/features/client/client.thunk";
import {
  Brain, // As closer to habit image
  Droplet,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";

const STREAK_TYPES = [
  {
    key: "workout",
    label: "Workout",
    icon: Dumbbell,
    milestones: [7, 21, 50, 100],
  },
  {
    key: "diet",
    label: "Diet",
    icon: UtensilsCrossed,
    milestones: [7, 21, 50, 100],
  },
  {
    key: "water",
    label: "Water",
    icon: Droplet,
    milestones: [7, 21, 50, 100],
  },
  {
    key: "habit",
    label: "Habit",
    icon: Brain,
    milestones: [7, 21, 50, 100],
  },
];

function createDefaultStreakState() {
  return {
    workout: { activeStreak: 0, longestStreak: 0, doneToday: false },
    diet: { activeStreak: 1, longestStreak: 7, doneToday: false },
    water: { activeStreak: 3, longestStreak: 5, doneToday: false },
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

  const renderedStreakByType = useMemo(
    () => ({
      workout: {
        current: Number(streakByType?.workout?.activeStreak || 0),
        longest: Number(streakByType?.workout?.longestStreak || 0),
      },
      diet: {
        current: Number(streakByType?.diet?.activeStreak || 0),
        longest: Number(streakByType?.diet?.longestStreak || 0),
      },
      water: {
        current: Number(streakByType?.water?.activeStreak || 0),
        longest: Number(streakByType?.water?.longestStreak || 0),
      },
      habit: {
        current: Number(streakByType?.habit?.activeStreak || 0),
        longest: Number(streakByType?.habit?.longestStreak || 0),
      },
    }),
    [streakByType],
  );

  return (
    <div className={cn("flex flex-col justify-center", className)}>
      <h3 className="text-[26px] leading-none font-black text-[#1F2F29] sm:text-[28px] mb-6">
        Daily Adherence Streaks
      </h3>

      <div className="flex flex-col gap-4 w-full">
        {STREAK_TYPES.map((type, idx) => {
          const Icon = type.icon;
          const stats = renderedStreakByType[type.key];
          
          let iconBg = "bg-[#DAE7E4]";
          let iconColor = "text-[#0A4F48]";
          
          if (type.key === 'water') {
             iconBg = "bg-[#DFE3FE]";
             iconColor = "text-[#471EFA]"; 
          } else if (type.key === 'habit') {
             iconBg = "bg-[#EEE7DD]";
             iconColor = "text-[#754117]"; 
          } else if (type.key === 'diet') {
             iconBg = "bg-[#DDEEEA]";
          }

          return (
            <div
              key={type.key}
              className="bg-[#F8FBF9] rounded-[30px] p-2.5 pr-4 sm:pr-6 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
                >
                  <Icon size={24} strokeWidth={2.5} className={iconColor} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] sm:text-[15px] font-black text-[#1F2F29] tracking-wide">
                    {type.label}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[14px] sm:text-[15px] font-black text-[#0A4F48] leading-none">{stats.current}</span>
                      <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#9AABA3] uppercase">
                        Cur
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] sm:text-[14px] font-bold text-[#A2AFA8] leading-none">{stats.longest}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#A2AFA8] uppercase">
                        Max
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones Bubbles */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                {type.milestones.map((m) => {
                   const unlocked = stats.longest >= m;
                   
                   // Diet specific bright cyan active unlock from image reference
                   const activeBgColor = type.key === 'diet' && unlocked ? "bg-[#7BFCE2] text-[#0A4F48]" 
                                         : type.key === 'water' && unlocked ? "bg-[#B0BBFE] text-white"
                                         : unlocked ? "bg-[#0A4F48] text-[#A7F3D0]" // standard dark green fallback
                                         : "bg-[#EAEEEB] text-[#AAB4B0]"; // Locked grey bubble
                   
                   return (
                     <span
                        key={m}
                        className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] lg:text-[11px] font-black tracking-tighter ${activeBgColor}`}
                     >
                       {m}d
                     </span>
                   )
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

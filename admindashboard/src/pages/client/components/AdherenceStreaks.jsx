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
    milestones: [7, 21, 50],
  },
  {
    key: "diet",
    label: "Diet",
    icon: UtensilsCrossed,
    milestones: [7, 21, 50], // Usually 1d milestone marked in image conditionally, using standard 7, 21, 50
  },
  {
    key: "water",
    label: "Water",
    icon: Droplet,
    milestones: [5, 7, 21], // Placeholder to match specific image dots: 5d, 7d, 21d
  },
  {
    key: "habit",
    label: "Habit",
    icon: Brain,
    milestones: [7, 21, 100],
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
    <div className={cn("bg-transparent lg:bg-white lg:rounded-[32px] lg:p-8 lg:shadow-[0_4px_30px_rgba(0,0,0,0.02)] lg:border lg:border-gray-50 flex flex-col justify-center", className)}>
      <h3 className="font-black text-[16px] lg:text-[18px] text-gray-800 tracking-tight leading-snug mb-5 lg:mb-8 pl-1 lg:pl-0">
        Daily Adherence Streaks
      </h3>

      <div className="flex flex-col gap-3 lg:gap-6 w-full lg:max-w-sm mx-auto flex-1 justify-center">
        {STREAK_TYPES.map((type, idx) => {
          const Icon = type.icon;
          const stats = renderedStreakByType[type.key];
          
          // Using specific styles for each icon background on mobile based on reference image
          let iconBg = "bg-[#DAE7E4]";
          let iconColor = "text-[#0A4F48]";
          
          if (type.key === 'water') {
             iconBg = "bg-[#DFE3FE]";
             iconColor = "text-[#471EFA]"; // Deep purple/blue indicator 
          } else if (type.key === 'habit') {
             iconBg = "bg-[#EEE7DD]";
             iconColor = "text-[#754117]"; // Brownish indicator
          } else if (type.key === 'diet') {
             iconBg = "bg-[#DDEEEA]";
          }

          return (
            <div
              key={type.key}
              className="bg-[#F5F8F7] lg:bg-gray-50 rounded-[40px] p-2 pr-4 lg:pr-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
                >
                  <Icon size={20} strokeWidth={2.5} className={iconColor} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-gray-800 tracking-wide">
                    {type.label}
                  </span>
                  <div className="flex items-end gap-1 lg:gap-1.5 pt-0.5">
                    <span className="text-[18px] lg:text-[14px] font-black text-[#0A4F48] leading-none">{stats.current}</span>
                    <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase pb-[2px]">
                      Day{stats.current !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestones Bubbles */}
              <div className="flex items-center gap-2">
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
                        className={`w-7 h-7 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-[7px] lg:text-[9px] font-black tracking-tighter ${activeBgColor}`}
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

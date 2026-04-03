import React, { useEffect, useState } from "react";
import { ChevronDown, Droplets } from "lucide-react";
import { useDispatch } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import {
  fetchWaterIntake,
  upsertWaterIntake,
} from "@/redux/features/tasks/task.thunk";

const WATER_GOAL_ML = 2500;
const WATER_STEP_OPTIONS = [100, 250, 500];

const WaterIntake = () => {
  const [isWaterSyncing, setIsWaterSyncing] = useState(false);
  const [waterStepMl, setWaterStepMl] = useState(250);
  const [showGoalBurst, setShowGoalBurst] = useState(false);

  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const waterIntakeByDay = useAppSelector((state) => state.tasks.waterIntakeByDay);

  const currentGlobalDay = Math.max(Number(user?.currentGlobalDay) || 1, 1);
  const waterIntakeMl = Number(waterIntakeByDay[currentGlobalDay] || 0);
  const isGoalReached = waterIntakeMl >= WATER_GOAL_ML;
  const fillPercent = Math.max(
    0.2,
    Math.min(waterIntakeMl / WATER_GOAL_ML, 1),
  );
  const liquidTopY = 152 - fillPercent * 86;

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWaterIntake(currentGlobalDay));
    }
  }, [currentGlobalDay, dispatch, user?._id]);

  useEffect(() => {
    if (!showGoalBurst) return undefined;
    const timer = setTimeout(() => setShowGoalBurst(false), 2200);
    return () => clearTimeout(timer);
  }, [showGoalBurst]);

  const syncWaterIntake = async (nextIntake, { triggerGoalAnimation = false } = {}) => {
    if (!user?._id || isWaterSyncing) return;
    setIsWaterSyncing(true);
    try {
      await dispatch(
        upsertWaterIntake({
          waterIntakeMl: Math.max(0, nextIntake),
          globalDayIndex: currentGlobalDay,
        }),
      ).unwrap();

      if (triggerGoalAnimation) {
        setShowGoalBurst(true);
      }
    } catch {
      // silently ignore
    } finally {
      setIsWaterSyncing(false);
    }
  };

  const handleAddWater = () => {
    const nextIntake = waterIntakeMl + waterStepMl;
    const hitGoalNow = waterIntakeMl < WATER_GOAL_ML && nextIntake >= WATER_GOAL_ML;
    syncWaterIntake(nextIntake, { triggerGoalAnimation: hitGoalNow });
  };

  return (
    <div className="client-card relative flex min-h-[198px] flex-col overflow-hidden px-5 py-5 sm:px-6">
      {showGoalBurst && (
        <div className="pointer-events-none absolute inset-0 z-20 animate-hydration-fade-out">
          {[12, 24, 40, 56, 72, 84].map((left, idx) => (
            <Droplets
              key={left}
              size={idx % 2 === 0 ? 16 : 12}
              className="absolute bottom-10 text-[#0A4F48] opacity-85 animate-hydration-float-up"
              style={{
                left: `${left}%`,
                animationDelay: `${idx * 0.06}s`,
                animationDuration: `${1.45 + idx * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="client-title text-[15px]">Hydration Tracker</h3>
      </div>

      <div className="flex flex-1 items-center gap-4 sm:gap-5">
        <div
          className={`relative flex h-[108px] w-[108px] shrink-0 items-center justify-center ${showGoalBurst ? "animate-hydration-ring-glow" : ""}`}
        >
          <div className="absolute inset-1 rounded-full bg-[#dbe9ff] blur-xl opacity-55" />
          <svg viewBox="0 0 140 190" className="relative h-[118px] w-[92px]">
            <defs>
              <linearGradient id="drop-shell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fafdff" />
                <stop offset="55%" stopColor="#dbe9ff" />
                <stop offset="100%" stopColor="#c0d4f3" />
              </linearGradient>
              <linearGradient id="drop-liquid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8d5f8" />
                <stop offset="100%" stopColor="#6d99d8" />
              </linearGradient>
              <linearGradient id="drop-inner-shadow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7ca7df" stopOpacity="0.2" />
              </linearGradient>
              <clipPath id="drop-clip">
                <path d="M70 8C70 8 22 66 22 106c0 45 21 76 48 76s48-31 48-76C118 66 70 8 70 8z" />
              </clipPath>
            </defs>

            <path
              d="M70 8C70 8 22 66 22 106c0 45 21 76 48 76s48-31 48-76C118 66 70 8 70 8z"
              fill="url(#drop-shell)"
              stroke="#c7daf6"
              strokeWidth="2.6"
            />
            <path
              d="M70 18c0 0-36 44-36 86 0 35 16 59 36 59s36-24 36-59C106 62 70 18 70 18z"
              fill="url(#drop-inner-shadow)"
              opacity="0.35"
            />

            <g clipPath="url(#drop-clip)">
              <rect
                x="20"
                y={liquidTopY}
                width="100"
                height="180"
                fill="url(#drop-liquid)"
                opacity="0.86"
              />
              <path
                d={`M20 ${liquidTopY} Q 32 ${liquidTopY - 6} 44 ${liquidTopY} T 68 ${liquidTopY} T 92 ${liquidTopY} T 116 ${liquidTopY} V 186 H20 Z`}
                fill="#cce2ff"
                opacity="0.8"
              />
            </g>

            <ellipse cx="56" cy="56" rx="12" ry="30" fill="white" opacity="0.5" />
            <ellipse
              cx="88"
              cy="125"
              rx="24"
              ry="14"
              fill="#6e94d0"
              opacity={Math.min(0.28 + fillPercent * 0.38, 0.7)}
            />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="client-title text-[14px] leading-tight">Water Intake</h4>
          <p className="client-subtitle mt-0.5 text-[12px]">
            {isGoalReached
              ? "Goal reached. Keep going."
              : `Daily goal ${WATER_GOAL_ML} ml`}
          </p>

          <p className="client-title mt-3.5 text-[34px] leading-none">
            {waterIntakeMl} ml
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <div className="relative w-full max-w-[120px] shrink-0">
              <select
                value={waterStepMl}
                onChange={(e) => setWaterStepMl(Number(e.target.value))}
                className="client-card-soft w-full appearance-none rounded-full border border-[rgba(10,79,72,0.16)] px-3 py-1.5 pr-8 text-[12px] font-semibold text-[#0A4F48] outline-none focus:border-[#0A4F48]/35"
              >
                {WATER_STEP_OPTIONS.map((step) => (
                  <option key={step} value={step}>
                    {step} ml
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#0A4F48]"
              />
            </div>

            <button
              type="button"
              onClick={handleAddWater}
              disabled={isWaterSyncing}
              className="client-action-pill min-w-0 flex-1 rounded-full px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap disabled:opacity-60"
            >
              {isWaterSyncing ? "Updating..." : "Add Water"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterIntake;

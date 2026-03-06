import { Button } from "@/components/ui/button";
import { Droplets, Minus, Plus } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import {
  fetchWaterIntake,
  upsertWaterIntake,
} from "@/redux/features/tasks/task.thunk";

function formatLiters(ml) {
  const liters = ml / 1000;
  return Number.isInteger(liters) ? `${liters}L` : `${liters.toFixed(1)}L`;
}

const WaterIntake = () => {
  const [waterStepMl, setWaterStepMl] = useState(250);
  const [showWaterCompletionBurst, setShowWaterCompletionBurst] =
    useState(false);
  const [isWaterSyncing, setIsWaterSyncing] = useState(false);
  const [isWaterLoading, setIsWaterLoading] = useState(true);
  const previousWaterProgressRef = useRef(0);

  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const waterIntakeByDay = useAppSelector((state) => state.tasks.waterIntakeByDay);

  const waterGoalMl = 2000;
  const visualGlassMl = 250;
  const currentGlobalDay = Math.max(
    Number(clientUser?.currentGlobalDay) || 0,
    Number(user?.currentGlobalDay) || 0,
    1,
  );
  const waterIntakeMl = Number(waterIntakeByDay[currentGlobalDay] || 0);

  const waterProgressPercent = useMemo(() => {
    const pct = (waterIntakeMl / waterGoalMl) * 100;
    if (!Number.isFinite(pct)) return 0;
    return Math.max(0, pct);
  }, [waterIntakeMl, waterGoalMl]);

  const waterProgressBarPercent = useMemo(
    () => Math.min(100, waterProgressPercent),
    [waterProgressPercent],
  );

  const waterGlassesTotal = useMemo(
    () => Math.max(1, Math.round(waterGoalMl / visualGlassMl)),
    [waterGoalMl, visualGlassMl],
  );

  const waterGlassesDone = useMemo(() => {
    const done = Math.floor(Math.min(waterIntakeMl, waterGoalMl) / visualGlassMl);
    return Math.max(0, Math.min(waterGlassesTotal, done));
  }, [waterIntakeMl, waterGoalMl, visualGlassMl, waterGlassesTotal]);

  const extraWaterMl = useMemo(
    () => Math.max(0, waterIntakeMl - waterGoalMl),
    [waterIntakeMl, waterGoalMl],
  );

  useEffect(() => {
    const wasComplete = previousWaterProgressRef.current >= 100;
    const isComplete = waterProgressPercent >= 100;
    let burstTimer;

    if (!wasComplete && isComplete) {
      setShowWaterCompletionBurst(true);
      burstTimer = window.setTimeout(() => {
        setShowWaterCompletionBurst(false);
      }, 1400);
    }

    previousWaterProgressRef.current = waterProgressPercent;

    return () => {
      if (burstTimer) {
        window.clearTimeout(burstTimer);
      }
    };
  }, [waterProgressPercent]);

  useEffect(() => {
    if (!user?._id) return;

    setIsWaterLoading(true);
    dispatch(fetchWaterIntake(currentGlobalDay))
      .unwrap()
      .catch((error) => {
        console.error("Failed to fetch water intake:", error);
      })
      .finally(() => {
        setIsWaterLoading(false);
      });
  }, [currentGlobalDay, dispatch, user?._id]);

  const syncWaterIntake = async (nextIntake) => {
    if (!user?._id || isWaterSyncing) return;

    setIsWaterSyncing(true);
    await dispatch(
      upsertWaterIntake({
        waterIntakeMl: nextIntake,
        globalDayIndex: currentGlobalDay,
      }),
    )
      .unwrap()
      .catch((error) => {
        console.error("Failed to sync water intake:", error);
      })
      .finally(() => {
        setIsWaterSyncing(false);
      });
  };

  const adjustWaterIntake = (deltaMl) => {
    const nextIntake = Math.max(0, waterIntakeMl + deltaMl);
    if (nextIntake === waterIntakeMl) return;

     syncWaterIntake(nextIntake);
  };

  const disableControls = isWaterLoading || isWaterSyncing;

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm lg:order-3 order-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#F4DBC7] flex items-center justify-center">
              <Droplets size={18} className="text-[#0A4F48]" />
            </div>
            <div>
              <h2 className="text-[#0A4F48] font-bold text-sm">
                Water Intake Tracker
              </h2>
              <p className="text-xs text-slate-500">Today</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1">
              <label
                htmlFor="water-step"
                className="text-[11px] font-semibold text-slate-500"
              >
                Per tap
              </label>
              <select
                id="water-step"
                value={waterStepMl}
                onChange={(event) => setWaterStepMl(Number(event.target.value))}
                className="bg-transparent text-xs font-bold text-[#0A4F48] outline-none"
                aria-label="Water intake amount per tap"
                disabled={disableControls}
              >
                {Array.from({ length: 9 }, (_, idx) => 100 + idx * 50).map(
                  (step) => (
                    <option key={step} value={step}>
                      {step} ml
                    </option>
                  ),
                )}
              </select>
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => adjustWaterIntake(waterStepMl)}
              disabled={disableControls}
              aria-label="Increase water intake"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-end justify-between mb-2">
          <span className="text-xs font-bold text-[#334155]">
            {formatLiters(waterIntakeMl)} / {formatLiters(waterGoalMl)}
          </span>
          <span className="text-xl font-black text-[#0A4F48]">
            {Math.round(waterProgressPercent)}%
          </span>
        </div>

        <div className="relative">
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#0A4F48] to-[#116D63] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${waterProgressBarPercent}%` }}
            />
          </div>
          {waterProgressPercent >= 100 && (
            <div className="pointer-events-none absolute inset-0 rounded-full border border-[#0A4F48]/40 animate-[goal-pulse_1.2s_ease-out_infinite]" />
          )}
          {showWaterCompletionBurst && (
            <div className="pointer-events-none absolute right-0 top-1/2">
              {[
                { x: "-84px", y: "-34px", size: 6, delay: 0 },
                { x: "-64px", y: "-48px", size: 7, delay: 35 },
                { x: "-40px", y: "-28px", size: 5, delay: 70 },
                { x: "-18px", y: "-56px", size: 6, delay: 105 },
                { x: "-94px", y: "-10px", size: 6, delay: 140 },
                { x: "-76px", y: "18px", size: 7, delay: 175 },
                { x: "-50px", y: "28px", size: 5, delay: 210 },
                { x: "-22px", y: "14px", size: 6, delay: 245 },
                { x: "-100px", y: "-54px", size: 5, delay: 280 },
                { x: "-58px", y: "-72px", size: 5, delay: 315 },
                { x: "-12px", y: "-30px", size: 4, delay: 350 },
                { x: "-8px", y: "22px", size: 4, delay: 385 },
              ].map((particle, idx) => (
                <span
                  key={idx}
                  className="absolute rounded-full bg-[#0A4F48]"
                  style={{
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animation: `water-burst 650ms ease-out ${particle.delay}ms forwards`,
                    "--water-burst-x": particle.x,
                    "--water-burst-y": particle.y,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {waterProgressPercent >= 100 && (
          <p className="mt-2 text-xs font-semibold text-[#0A4F48] animate-[goal-message_1.2s_ease-in-out_infinite]">
            Goal achieved. Keep going.
          </p>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Glasses
            </span>
            <span className="text-xs font-bold text-slate-600">
              {waterGlassesDone}/{waterGlassesTotal}
            </span>
          </div>

          {extraWaterMl > 0 && (
            <p className="mb-2 text-[11px] font-semibold text-[#0A4F48]">
              Extra after target: +{formatLiters(extraWaterMl)}
            </p>
          )}

          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: waterGlassesTotal }).map((_, idx) => {
              const isFilled = idx < waterGlassesDone;
              return (
                <div
                  key={idx}
                  className={
                    "h-8 rounded-xl border transition-all " +
                    (isFilled
                      ? "bg-[#0A4F48] border-transparent"
                      : "bg-[#F8FAFC] border-[#E2E8F0]")
                  }
                  aria-hidden="true"
                />
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Tap +  to update by {waterStepMl} ml (server synced).
          </p>
        </div>
      </div>
      <style>
        {`
          @keyframes goal-pulse {
            0% {
              opacity: 0;
              transform: scale(1);
            }
            40% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: scale(1.08);
            }
          }

          @keyframes goal-message {
            0%,
            100% {
              transform: translateY(0px);
              opacity: 0.8;
            }
            50% {
              transform: translateY(-2px);
              opacity: 1;
            }
          }

          @keyframes water-burst {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(
                calc(-50% + var(--water-burst-x)),
                calc(-50% + var(--water-burst-y))
              ) scale(0.2);
            }
          }
        `}
      </style>
    </>
  );
};

export default WaterIntake;

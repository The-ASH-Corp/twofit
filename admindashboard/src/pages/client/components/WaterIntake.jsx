import { Button } from "@/components/ui/button";
import { Droplets, Minus, Plus } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

function formatLiters(ml) {
  const liters = ml / 1000;
  return Number.isInteger(liters) ? `${liters}L` : `${liters.toFixed(1)}L`;
}

const WaterIntake = () => {
  const [waterIntakeMl, setWaterIntakeMl] = useState(0);
  const [showWaterCompletionBurst, setShowWaterCompletionBurst] =
    useState(false);
  const previousWaterProgressRef = useRef(0);

  const waterGoalMl = 2000;
  const waterStepMl = 250;

  const waterProgressPercent = useMemo(() => {
    const pct = (waterIntakeMl / waterGoalMl) * 100;
    if (!Number.isFinite(pct)) return 0;
    return Math.max(0, Math.min(100, pct));
  }, [waterIntakeMl, waterGoalMl]);

  const waterGlassesTotal = useMemo(
    () => Math.max(1, Math.round(waterGoalMl / waterStepMl)),
    [waterGoalMl, waterStepMl],
  );

  const waterGlassesDone = useMemo(() => {
    const done = Math.floor(waterIntakeMl / waterStepMl);
    return Math.max(0, Math.min(waterGlassesTotal, done));
  }, [waterIntakeMl, waterStepMl, waterGlassesTotal]);

  useEffect(() => {
    const wasComplete = previousWaterProgressRef.current >= 100;
    const isComplete = waterProgressPercent >= 100;
    let burstTimer;

    if (!wasComplete && isComplete) {
      setShowWaterCompletionBurst(true);
      burstTimer = window.setTimeout(() => {
        setShowWaterCompletionBurst(false);
      }, 850);
    }

    previousWaterProgressRef.current = waterProgressPercent;

    return () => {
      if (burstTimer) {
        window.clearTimeout(burstTimer);
      }
    };
  }, [waterProgressPercent]);

  return (
    <>
      {/* Water Intake Tracker (static UI for now) */}
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
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setWaterIntakeMl((prev) => Math.max(0, prev - waterStepMl))
              }
              aria-label="Decrease water intake"
            >
              <Minus size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setWaterIntakeMl((prev) =>
                  Math.min(waterGoalMl, prev + waterStepMl),
                )
              }
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
              style={{ width: `${waterProgressPercent}%` }}
            />
          </div>
          {showWaterCompletionBurst && (
            <div className="pointer-events-none absolute right-0 top-1/2">
              {[
                { x: "-56px", y: "-28px", size: 5, delay: 0 },
                { x: "-42px", y: "-36px", size: 6, delay: 35 },
                { x: "-30px", y: "-22px", size: 4, delay: 70 },
                { x: "-20px", y: "-42px", size: 5, delay: 105 },
                { x: "-66px", y: "-12px", size: 5, delay: 140 },
                { x: "-50px", y: "8px", size: 6, delay: 175 },
                { x: "-36px", y: "16px", size: 4, delay: 210 },
                { x: "-22px", y: "6px", size: 5, delay: 245 },
              ].map((particle, idx) => (
                <span
                  key={idx}
                  className="absolute rounded-full bg-[#0a4f16]"
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

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Glasses
            </span>
            <span className="text-xs font-bold text-slate-600">
              {waterGlassesDone}/{waterGlassesTotal}
            </span>
          </div>

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
            Tap + / − to update (local only).
          </p>
        </div>
      </div>
      <style>
        {`
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
              ) scale(0.15);
            }
          }
        `}
      </style>
    </>
  );
};

export default WaterIntake;

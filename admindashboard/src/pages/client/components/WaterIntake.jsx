import { Droplets, Plus, GlassWater } from "lucide-react";
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
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex flex-col md:flex-row gap-8 items-center transition-all hover:shadow-md">
      {/* Visual Indicator Layer */}
      <div className="relative w-40 h-40 shrink-0">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            className="stroke-gray-100 fill-none"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            className="stroke-[#0A4F48] fill-none transition-all duration-1000 ease-out"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - waterProgressBarPercent / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Droplets className="text-[#0A4F48] w-8 h-8 mb-1 animate-bounce" />
          <span className="text-2xl font-black text-[#0A4F48]">{Math.round(waterProgressPercent)}%</span>
        </div>
        {waterProgressPercent >= 100 && (
          <div className="absolute inset-0 rounded-full border-4 border-[#0A4F48]/20 animate-ping" />
        )}
      </div>

      {/* Control Layer */}
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#0A4F48] font-black text-xs uppercase tracking-[0.2em] mb-1">
              Hydration Tracker
            </h2>
            <p className="text-2xl font-black text-gray-800 tracking-tight">
              {formatLiters(waterIntakeMl)} <span className="text-gray-300">/ {formatLiters(waterGoalMl)}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Per Tap</span>
               <select
                 value={waterStepMl}
                 onChange={(e) => setWaterStepMl(Number(e.target.value))}
                 className="bg-gray-50 text-xs font-black text-[#0A4F48] px-3 py-1.5 rounded-xl outline-none border border-gray-100 focus:border-[#0A4F48]/30 transition-all"
                 disabled={disableControls}
               >
                 {[100, 250, 500].map(val => (
                   <option key={val} value={val}>{val}ml</option>
                 ))}
               </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           {/* Glass grid */}
           <div className="flex flex-wrap gap-2">
              {Array.from({ length: waterGlassesTotal }).map((_, idx) => (
                <div key={idx} className={`w-8 h-10 rounded-lg border-2 flex items-end overflow-hidden transition-all duration-500 ${idx < waterGlassesDone ? 'border-[#0A4F48] bg-[#0A4F48]/5' : 'border-gray-100'}`}>
                   <div 
                     className="w-full bg-[#0A4F48] transition-all duration-700 ease-out" 
                     style={{ height: idx < waterGlassesDone ? '100%' : '0%' }}
                   />
                </div>
              ))}
              {extraWaterMl > 0 && (
                <div className="flex items-center gap-1 ml-2">
                   <div className="w-8 h-10 rounded-lg border-2 border-orange-200 bg-orange-50 flex items-center justify-center">
                      <Plus className="text-orange-400 w-3 h-3" />
                   </div>
                   <span className="text-[10px] font-black text-orange-400">+{formatLiters(extraWaterMl)}</span>
                </div>
              )}
           </div>

           <div className="flex items-center gap-3">
              {/* <button
                onClick={() => adjustWaterIntake(-waterStepMl)}
                disabled={disableControls || waterIntakeMl === 0}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-400 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 active:scale-95"
              >
                <Minus className="w-5 h-5" />
              </button> */}
              <button
                onClick={() => adjustWaterIntake(waterStepMl)}
                disabled={disableControls}
                className="flex-2 bg-[#0A4F48] hover:bg-[#0c5c54] text-white h-14 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-[#0A4F48]/20 transition-all active:scale-95"
              >
                <GlassWater className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">Add Water</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WaterIntake;

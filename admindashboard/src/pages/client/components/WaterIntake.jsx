import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Droplets } from "lucide-react";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import { fetchWaterIntake, upsertWaterIntake } from "@/redux/features/tasks/task.thunk";

// Seeded pseudo-random for stable SSR/hydration-safe positions
const PARTICLE_CONFIG = [
  { x: -60, delay: 0,    dur: 1.6 },
  { x: -40, delay: 0.1,  dur: 1.9 },
  { x: -20, delay: 0.2,  dur: 1.7 },
  { x:   0, delay: 0.05, dur: 2.0 },
  { x:  20, delay: 0.15, dur: 1.8 },
  { x:  40, delay: 0.25, dur: 1.65 },
  { x:  60, delay: 0.08, dur: 1.75 },
  { x: -50, delay: 0.3,  dur: 1.55 },
  { x:  50, delay: 0.18, dur: 1.85 },
  { x: -30, delay: 0.35, dur: 2.0 },
  { x:  30, delay: 0.12, dur: 1.7 },
  { x:  10, delay: 0.28, dur: 1.9 },
];

function HydrationCelebration({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-hydration-fade-out" />

      {/* Floating drops */}
      {PARTICLE_CONFIG.map((p, i) => (
        <div
          key={i}
          className="absolute animate-hydration-float-up"
          style={{
            bottom: "48%",
            left: `calc(50% + ${p.x}px)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        >
          <Droplets
            size={i % 3 === 0 ? 28 : i % 3 === 1 ? 20 : 14}
            className="text-[#0A4F48] fill-[#0A4F48] opacity-90"
          />
        </div>
      ))}

      {/* Celebration card */}
      <div className="relative animate-hydration-burst animate-hydration-fade-out bg-white rounded-[28px] px-10 py-8 shadow-2xl flex flex-col items-center gap-3 pointer-events-auto">
        <div className="w-16 h-16 rounded-full bg-[#E6FFFA] flex items-center justify-center mb-1">
          <Droplets size={32} className="text-[#0A4F48] fill-[#0A4F48]" />
        </div>
        <p className="text-[22px] font-black text-gray-800 tracking-tight text-center leading-snug">
          Hydration Goal<br />Achieved! 💧
        </p>
        <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest text-center">
          2.5L today — well done!
        </p>
      </div>
    </div>
  );
}

const WaterIntake = () => {
  const [waterStepMl, setWaterStepMl] = useState(250);
  const [isWaterSyncing, setIsWaterSyncing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const waterIntakeByDay = useAppSelector((state) => state.tasks.waterIntakeByDay);

  const waterGoalMl = 2500;
  const currentGlobalDay = Math.max(Number(user?.currentGlobalDay) || 1, 1);
  const waterIntakeMl = Number(waterIntakeByDay[currentGlobalDay] || 0);

  const waterProgressPercent = useMemo(() => {
    return Math.min(Math.round((waterIntakeMl / waterGoalMl) * 100), 100);
  }, [waterIntakeMl, waterGoalMl]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWaterIntake(currentGlobalDay));
    }
  }, [currentGlobalDay, dispatch, user?._id]);

  const syncWaterIntake = async (nextIntake) => {
    if (!user?._id || isWaterSyncing) return;
    setIsWaterSyncing(true);
    try {
      const result = await dispatch(
        upsertWaterIntake({
          waterIntakeMl: Math.max(0, nextIntake),
          globalDayIndex: currentGlobalDay,
        })
      ).unwrap();
      if (result?.goalJustAchieved) {
        setShowCelebration(true);
      }
    } catch (_) {
      // silently ignore
    } finally {
      setIsWaterSyncing(false);
    }
  };

  const handleAddWater = () => syncWaterIntake(waterIntakeMl + waterStepMl);
  const handleRemoveWater = () => syncWaterIntake(waterIntakeMl - waterStepMl);
  const dismissCelebration = useCallback(() => setShowCelebration(false), []);

  const isGoalComplete = waterProgressPercent >= 100;

  // SVG ring params — shared between mobile & desktop
  const mobileR = 72;
  const mobileCir = 2 * Math.PI * mobileR;
  const mobileOffset = mobileCir - (waterProgressPercent / 100) * mobileCir;

  const desktopR = 85;
  const desktopCir = 2 * Math.PI * desktopR;
  const desktopOffset = desktopCir - (waterProgressPercent / 100) * desktopCir;

  return (
    <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
      {showCelebration && <HydrationCelebration onDone={dismissCelebration} />}

      {/* ── MOBILE LAYOUT ── */}
      <div className="flex flex-col items-center p-8 gap-8 md:hidden relative">
        {/* Water drop decoration — top right */}
        <Droplets className="absolute top-5 right-6 text-[#0A4F48]/10 w-9 h-9" />

        {/* Title */}
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.35em]">Hydration</p>

        {/* Circular Ring */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className={`w-full h-full -rotate-90 ${isGoalComplete ? "animate-hydration-ring-glow" : ""}`}>
            <circle
              cx="96"
              cy="96"
              r={mobileR}
              className="stroke-[#EBF3F2] fill-none"
              strokeWidth="12"
            />
            <circle
              cx="96"
              cy="96"
              r={mobileR}
              stroke={isGoalComplete ? "#059669" : "#0A4F48"}
              fill="none"
              strokeWidth="12"
              strokeDasharray={mobileCir}
              strokeDashoffset={mobileOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <p className="text-[36px] font-black text-gray-800 leading-none tracking-tighter">
              {(waterIntakeMl / 1000).toFixed(1)}
              <span className="text-[20px] font-bold"> L</span>
            </p>
            <p className={`text-[11px] font-bold mt-1 uppercase tracking-widest ${isGoalComplete ? "text-emerald-600" : "text-gray-400"}`}>
              {isGoalComplete ? "Goal reached!" : `of ${(waterGoalMl / 1000).toFixed(1)}L`}
            </p>
          </div>
        </div>

        {/* +/- Controls */}
        <div className="flex items-center justify-center gap-8">
          {/* Minus */}
          <button
            onClick={handleRemoveWater}
            disabled={isWaterSyncing || waterIntakeMl <= 0}
            className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 text-2xl font-light hover:border-[#0A4F48] hover:text-[#0A4F48] transition-all active:scale-95 disabled:opacity-40"
          >
            −
          </button>

          {/* Center drop button */}
          <button
            onClick={handleAddWater}
            disabled={isWaterSyncing}
            className="w-16 h-16 rounded-full bg-[#0A4F48] flex items-center justify-center shadow-xl shadow-[#0A4F48]/30 hover:bg-[#004d44] transition-all active:scale-95 disabled:opacity-50"
          >
            <Droplets size={24} className="text-white fill-white" />
          </button>

          {/* Plus */}
          <button
            onClick={handleAddWater}
            disabled={isWaterSyncing}
            className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 text-2xl font-light hover:border-[#0A4F48] hover:text-[#0A4F48] transition-all active:scale-95 disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex items-center gap-12 p-10 relative overflow-hidden">
        {/* Large Circular Ring */}
        <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
          <svg className={`w-full h-full -rotate-90 ${isGoalComplete ? "animate-hydration-ring-glow" : ""}`}>
            <circle cx="112" cy="112" r={desktopR} className="stroke-[#EBF3F2] fill-none" strokeWidth="14" />
            <circle
              cx="112"
              cy="112"
              r={desktopR}
              stroke={isGoalComplete ? "#059669" : "#0A4F48"}
              fill="none"
              strokeWidth="14"
              strokeDasharray={desktopCir}
              strokeDashoffset={desktopOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <p className={`text-[44px] font-black leading-none tracking-tighter ${isGoalComplete ? "text-emerald-600" : "text-gray-800"}`}>
              {waterProgressPercent}%
            </p>
            <p className={`text-[12px] font-black mt-1 uppercase tracking-[0.2em] ${isGoalComplete ? "text-emerald-500" : "text-gray-400"}`}>
              {isGoalComplete ? "Complete!" : "Hydration"}
            </p>
          </div>
        </div>

        {/* Right: Info & Controls */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-[22px] font-black text-gray-800 tracking-tight">Daily Hydration</h2>
            <div className="flex items-center gap-2 text-[13px] font-bold text-gray-500">
              <span>{(waterIntakeMl / 1000).toFixed(1)}L</span>
              <span className="text-gray-300">/</span>
              <span>{(waterGoalMl / 1000).toFixed(1)}L</span>
            </div>
          </div>

          {/* Drops Grid */}
          <div className="grid grid-cols-5 gap-y-4 gap-x-2 w-fit">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex justify-center">
                <Droplets
                  size={24}
                  className={`transition-colors duration-500 ${
                    i < Math.floor(waterIntakeMl / 250) ? "text-[#0A4F48] fill-[#0A4F48]" : "text-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={handleRemoveWater}
              disabled={isWaterSyncing || waterIntakeMl <= 0}
              className="flex-1 border-2 border-gray-200 text-gray-500 py-4 rounded-[20px] text-[14px] font-black uppercase tracking-widest hover:border-[#0A4F48] hover:text-[#0A4F48] transition-all active:scale-95 disabled:opacity-40"
            >
              − Remove
            </button>
            <button
              onClick={handleAddWater}
              disabled={isWaterSyncing}
              className="flex-1 bg-[#0A4F48] hover:bg-[#004d44] text-white py-4 rounded-[20px] text-[14px] font-black uppercase tracking-widest shadow-xl shadow-[#0A4F48]/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isWaterSyncing ? "Updating..." : "+ Add Water"}
            </button>
          </div>
        </div>

        {/* Background decoration */}
        <Droplets className="absolute -bottom-6 -right-6 text-gray-50/50 w-32 h-32 rotate-12 pointer-events-none" />
      </div>
    </div>
  );
};

export default WaterIntake;

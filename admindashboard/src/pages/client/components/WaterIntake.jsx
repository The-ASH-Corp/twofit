import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Droplets } from "lucide-react";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import { fetchWaterIntake, upsertWaterIntake } from "@/redux/features/tasks/task.thunk";

const WaterIntake = () => {
  const [waterStepMl, setWaterStepMl] = useState(250);
  const [isWaterSyncing, setIsWaterSyncing] = useState(false);

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
    await dispatch(
      upsertWaterIntake({
        waterIntakeMl: Math.max(0, nextIntake),
        globalDayIndex: currentGlobalDay,
      })
    ).unwrap().finally(() => setIsWaterSyncing(false));
  };

  const handleAddWater = () => syncWaterIntake(waterIntakeMl + waterStepMl);
  const handleRemoveWater = () => syncWaterIntake(waterIntakeMl - waterStepMl);

  // SVG ring params — shared between mobile & desktop
  const mobileR = 72;
  const mobileCir = 2 * Math.PI * mobileR;
  const mobileOffset = mobileCir - (waterProgressPercent / 100) * mobileCir;

  const desktopR = 85;
  const desktopCir = 2 * Math.PI * desktopR;
  const desktopOffset = desktopCir - (waterProgressPercent / 100) * desktopCir;

  return (
    <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">

      {/* ── MOBILE LAYOUT ── */}
      <div className="flex flex-col items-center p-8 gap-8 md:hidden relative">
        {/* Water drop decoration — top right */}
        <Droplets className="absolute top-5 right-6 text-[#0A4F48]/10 w-9 h-9" />

        {/* Title */}
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.35em]">Hydration</p>

        {/* Circular Ring */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
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
              stroke="#0A4F48"
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
            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
              of {(waterGoalMl / 1000).toFixed(1)}L
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
          <svg className="w-full h-full -rotate-90">
            <circle cx="112" cy="112" r={desktopR} className="stroke-[#EBF3F2] fill-none" strokeWidth="14" />
            <circle
              cx="112"
              cy="112"
              r={desktopR}
              stroke="#0A4F48"
              fill="none"
              strokeWidth="14"
              strokeDasharray={desktopCir}
              strokeDashoffset={desktopOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <p className="text-[44px] font-black text-gray-800 leading-none tracking-tighter">
              {waterProgressPercent}%
            </p>
            <p className="text-[12px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">Hydration</p>
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

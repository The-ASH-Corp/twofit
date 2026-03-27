import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Droplets, ChevronDown } from "lucide-react";
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
    return Math.round((waterIntakeMl / waterGoalMl) * 100);
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
        waterIntakeMl: nextIntake,
        globalDayIndex: currentGlobalDay,
      })
    ).unwrap().finally(() => setIsWaterSyncing(false));
  };

  const handleAddWater = () => {
    syncWaterIntake(waterIntakeMl + waterStepMl);
  };

  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, waterProgressPercent) / 100) * circumference;

  return (
    <div className="bg-white p-10 rounded-[48px] shadow-[0_15px_60px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col md:flex-row items-center gap-12 group transition-all duration-500 hover:shadow-xl relative overflow-hidden">
      
      {/* LEFT: Large Circular Percentage */}
      <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90 scale-100">
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-[#EBF3F2] fill-none"
            strokeWidth="14"
          />
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-[#0A4F48] fill-none transition-all duration-1000 ease-out"
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <p className="text-[44px] font-black text-gray-800 leading-none tracking-tighter">
            {waterProgressPercent}%
          </p>
          <p className="text-[12px] font-black text-gray-400 mt-1 uppercase tracking-[0.2em]">
            Hydration
          </p>
        </div>
      </div>

      {/* RIGHT: Info & Controls */}
      <div className="flex-1 flex flex-col gap-8 w-full">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-black text-gray-800 tracking-tight">
            Daily Hydration
          </h2>
          <button className="flex items-center gap-2 bg-[#F1F5F9] text-gray-600 px-4 py-2 rounded-2xl text-[13px] font-bold hover:bg-gray-200 transition-colors">
            {waterStepMl}ml <ChevronDown size={14} />
          </button>
        </div>

        {/* Drops Grid (10 drops like image) */}
        <div className="grid grid-cols-5 gap-y-4 gap-x-2 w-fit">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex justify-center">
              <Droplets 
                size={24} 
                className={`transition-colors duration-500 ${
                  i < (waterIntakeMl / 250) ? "text-[#0A4F48] fill-[#0A4F48]" : "text-gray-200"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAddWater}
          disabled={isWaterSyncing}
          className="w-full bg-[#0A4F48] hover:bg-[#004d44] text-white py-4.5 rounded-[24px] text-[15px] font-black uppercase tracking-widest shadow-xl shadow-[#0A4F48]/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isWaterSyncing ? "Updating..." : "Add Water"}
        </button>
      </div>

      {/* Background decoration */}
      <Droplets className="absolute -bottom-6 -right-6 text-gray-50/50 w-32 h-32 rotate-12 pointer-events-none" />
    </div>
  );
};

export default WaterIntake;



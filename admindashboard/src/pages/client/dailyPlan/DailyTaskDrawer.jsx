import React from "react";
import { X, Activity, Utensils, Heart, Plus } from "lucide-react";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";

export default function DailyTaskDrawer({
  selectedDate,
  tasks,
  allMissed,
  onClose,
  onTaskClick,
}) {
  const user = useAppSelector(selectUser);
  if (!selectedDate) return null;

  const statusStyles = {
    verified: "bg-[#A7F3D0] text-[#0A4F48]",
    pending: "bg-yellow-50 text-yellow-700",
    rejected: "bg-red-50 text-red-700",
    todo: "bg-white text-[#0A4F48] border border-[#0A4F48]/10",
    missed: "bg-gray-100 text-gray-700",
    completed: "bg-[#A7F3D0] text-[#0A4F48]",
    skipped: "bg-[#FEE2E2] text-[#991B1B]",
    improve: "bg-orange-50 text-orange-700",
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case "Workout":
        return <Activity className="w-4 h-4 text-white" />;
      case "Meal":
        return <Utensils className="w-4 h-4 text-white" />;
      case "Therapy":
        return <Heart className="w-4 h-4 text-white" />;
      default:
        return <Activity className="w-4 h-4 text-white" />;
    }
  };

  const dateObj = new Date(selectedDate);
  const dayName = dateObj.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
  const dayOfMonth = dateObj.getDate();
  const monthName = dateObj.toLocaleString("en-US", { month: "short" });
  const yearName = dateObj.getFullYear();
  const formattedDate = `${dayOfMonth} ${monthName} ${yearName}`;

  const totalTasks = tasks?.length || 0;
  const verifiedTasks = tasks?.filter((t) => t.status.toLowerCase() === "verified").length || 0;
  const completionPercent = totalTasks > 0 ? Math.round((verifiedTasks / totalTasks) * 100) : 0;
  
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="fixed inset-0 z-50 flex lg:justify-end items-end lg:items-stretch">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 lg:bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full lg:w-[450px] lg:h-full max-h-[90vh] lg:max-h-none bg-white shadow-2xl flex flex-col rounded-t-[40px] lg:rounded-none animate-in slide-in-from-bottom lg:slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[12px] font-black tracking-[0.1em] text-gray-400 uppercase mb-1">
              {dayName} PROGRESS
            </span>
            <h2 className="text-[32px] font-black text-[#0A4F48] leading-tight">
              {formattedDate}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mt-1"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Summary Card */}
          {!allMissed && totalTasks > 0 && (
            <div className="bg-[#E6FFFA] rounded-[32px] p-6 flex items-center gap-6">
              {/* Circular Progress (Simplified SVG) */}
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#D1FAE5"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#0A4F48"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={175.9}
                    strokeDashoffset={175.9 * (1 - completionPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14px] font-black text-[#0A4F48]">
                    {completionPercent}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-[16px] font-black text-[#0A4F48] mb-0.5">
                  Great pace, {firstName}!
                </h3>
                <p className="text-[13px] font-medium text-[#0A4F48]/70">
                  {verifiedTasks} of {totalTasks} tasks completed today.
                </p>
              </div>
            </div>
          )}

          {/* Task List */}
          <div className="space-y-3">
            {allMissed ? (
               <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-3xl">
                 <p className="text-[14px] font-bold">You were not logged in that day</p>
               </div>
            ) : tasks && tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-5 bg-[#F2F4F4] rounded-[24px] hover:bg-gray-100 transition-all cursor-pointer group"
                  onClick={() => onTaskClick && onTaskClick(task)}
                >
                  <div className="w-12 h-12 rounded-full bg-[#0A4F48] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    {getTaskIcon(task.type)}
                  </div>
                  
                  <span className="flex-1 text-[16px] font-bold text-gray-800 tracking-tight">
                    {task.name}
                  </span>

                  <span
                    className={`text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full ${
                      statusStyles[task.status.toLowerCase()] ||
                      statusStyles.pending
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-[14px]">No tasks for this day</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

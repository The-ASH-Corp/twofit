import React from "react";
import { X, Activity, Utensils, Heart, CheckCircle2, Circle } from "lucide-react";
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
    verified: "bg-[#E6FFFA] text-[#0A4F48] border-none",
    pending: "bg-yellow-50 text-yellow-700 border-none",
    rejected: "bg-red-50 text-red-700 border-none",
    todo: "bg-white text-gray-400 border border-gray-100 uppercase",
    missed: "bg-gray-100 text-gray-700 border-none",
    completed: "bg-[#E6FFFA] text-[#0A4F48] border-none",
    skipped: "bg-rose-50 text-rose-500 border-none",
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case "Workout":
        return <Activity className="w-5 h-5 text-[#0A4F48]" />;
      case "Meal":
        return <Utensils className="w-5 h-5 text-[#0A4F48]" />;
      case "Therapy":
        return <Heart className="w-5 h-5 text-[#0A4F48]" />;
      default:
        return <Activity className="w-5 h-5 text-[#0A4F48]" />;
    }
  };

  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const totalTasks = tasks?.length || 0;
  const verifiedTasks = tasks?.filter((t) => t.status.toLowerCase() === "verified").length || 0;
  const completionPercent = totalTasks > 0 ? Math.round((verifiedTasks / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[500px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out p-8 lg:p-12">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="text-[10px] font-black tracking-[3px] text-gray-400 uppercase mb-2 block">
              Overview
            </span>
            <h2 className="text-[32px] font-bold text-gray-900 leading-tight">
              {formattedDate}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 no-scrollbar space-y-10">
          
          {/* Pace Card */}
          <div className="bg-[#F6FBF9] rounded-[32px] p-8 flex items-center gap-8 border border-[#E6FFFA]">
            {/* Circular Progress */}
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#E6FFFA"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#0A4F48"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 * (1 - completionPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[20px] font-black text-[#0A4F48]">
                  {completionPercent}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-bold text-gray-900">
                Great pace
              </h3>
              <p className="text-[14px] font-medium text-gray-400 leading-relaxed">
                You're just getting started today. Let's make it count!
              </p>
            </div>
          </div>

          {/* Protocol List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[12px] font-black tracking-[2px] text-gray-400 uppercase">Today's Protocol</h3>
               <div className="bg-[#E6FFFA] text-[#0A4F48] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                 {totalTasks} Tasks
               </div>
            </div>

            <div className="space-y-4">
              {allMissed ? (
                 <div className="text-center py-20 bg-gray-50 rounded-[32px]">
                   <p className="text-sm font-bold text-gray-400 italic">"Offline day - rest is part of the plan"</p>
                 </div>
              ) : tasks && tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 p-4 rounded-[24px] hover:bg-gray-50 transition-all cursor-pointer group"
                    onClick={() => onTaskClick && onTaskClick(task)}
                  >
                    <div className="w-14 h-14 rounded-[20px] bg-[#F6FBF9] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                      {getTaskIcon(task.type)}
                    </div>
                    
                    <span className="flex-1 text-[17px] font-bold text-gray-800 tracking-tight">
                      {task.name}
                    </span>

                    <div
                      className={`text-[9px] font-black tracking-widest px-4 py-2 rounded-lg ${
                        statusStyles[task.status.toLowerCase()] ||
                        statusStyles.todo
                      }`}
                    >
                      {task.status === 'todo' ? 'TODO' : task.status.toUpperCase()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400 font-medium">
                  No tasks tracked for this day.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

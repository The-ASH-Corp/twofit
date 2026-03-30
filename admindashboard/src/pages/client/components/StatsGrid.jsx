import React from "react";
import { 
  Calendar, 
  LayoutGrid, 
  Weight, 
  Flame 
} from "lucide-react";

export default function StatsGrid({ statsData }) {
  const stats = [
    {
      label: "Program Days",
      value: statsData?.programDays.split(" ")[0] || "0/30",
      unit: "Days",
      icon: Calendar,
      color: "bg-[#E6FFFA]",
      textColor: "text-[#38B2AC]",
    },
    {
      label: "Compliance",
      value: statsData?.compliance || "0%",
      unit: "",
      icon: LayoutGrid,
      color: "bg-[#EBF3F2]",
      textColor: "text-[#0A4F48]",
    },
    {
      label: "Current Weight",
      value: statsData?.currentWeight || "--",
      unit: "kg",
      icon: Weight,
      color: "bg-[#FDF8F3]",
      textColor: "text-[#DD6B20]",
    },
    {
      label: "Active Streak",
      value: statsData?.activeStreak || "0",
      unit: "Days",
      icon: Flame,
      color: "bg-[#FFF5F5]",
      textColor: "text-[#E53E3E]",
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-2 sm:mt-4 md:mt-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white p-4 sm:p-5 md:p-8 rounded-3xl md:rounded-[36px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col items-start gap-3 sm:gap-4 md:gap-5 transition-all hover:shadow-lg hover:-translate-y-1 group"
          >
            <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
              <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.textColor}`} />
            </div>
            
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.16em] sm:tracking-[0.2em] leading-none">
                {stat.label}
              </p>
              <p className="text-[34px] sm:text-[32px] font-black text-gray-800 leading-none">
                {stat.value}
              </p>
              {stat.unit && (
                <p className="text-[12px] sm:text-[13px] md:text-[14px] font-bold text-gray-400 mt-1 lowercase tracking-tight">
                  {stat.unit}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


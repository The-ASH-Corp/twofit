import React from "react";
import { 
  Calendar, 
  LayoutGrid, 
  Weight, 
  Flame 
} from "lucide-react";

const stats = [
  {
    label: "Program Days",
    value: "12/30",
    unit: "Days",
    icon: Calendar,
    color: "bg-[#E6FFFA]",
    textColor: "text-[#38B2AC]",
  },
  {
    label: "Compliance",
    value: "31%",
    unit: "",
    icon: LayoutGrid,
    color: "bg-[#EBF3F2]",
    textColor: "text-[#0A4F48]",
  },
  {
    label: "Current Weight",
    value: "75",
    unit: "kg",
    icon: Weight,
    color: "bg-[#FDF8F3]",
    textColor: "text-[#DD6B20]",
  },
  {
    label: "Active Streak",
    value: "0",
    unit: "Days",
    icon: Flame,
    color: "bg-[#FFF5F5]",
    textColor: "text-[#E53E3E]",
  }
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white p-8 rounded-[36px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col items-start gap-5 transition-all hover:shadow-lg hover:-translate-y-1 group"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
              <Icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            
            <div className="space-y-1">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
                {stat.label}
              </p>
              <p className="text-[32px] font-black text-gray-800 leading-none">
                {stat.value}
              </p>
              {stat.unit && (
                <p className="text-[14px] font-bold text-gray-400 mt-1 lowercase tracking-tight">
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


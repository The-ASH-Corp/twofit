import { assets } from "@/assets/asset";
import KpiCard from "@/components/cards/KpiCard";
import React from "react";
import ProgressChart from "../components/ProgressChart";
import WeightChart from "../components/WeightChart";

export default function Progress() {

  const compliance = [
    {
      title: "Diet",
      Missed: "Missed Diet: 26",
      percentage: "55%",
      color: "#0A4F48",
    },
    {
      title: "Workout",
      Missed: "Missed Workout: 29",
      percentage: "30%",
      color: "#EBF3F2",
    },
    {
      title: "Therapy",
      Missed: "Missed Therapy: 16",
      percentage: "15%",
      color: "#F4DBC7",
    },
  ];

  return (
    <div className="grid grid-cols-[70%_28%] gap-4 h-full">
      <div>
        <p className="text-[#0A4F48] font-bold text-[16px]">Overall Progress</p>
        <div className="flex gap-6">
          <KpiCard
            title="Total Experts"
            value="150"
            icon={assets.website}
            bg="#FFFFFF"
          />
          <KpiCard
            title="Total Monthly Salary"
            value="12,300,000"
            icon={assets.website}
            bg="#FFFFFF"
          />
          <KpiCard
            title="Total Incentives"
            value="1,200,300"
            icon={assets.chats}
            bg="#FFFFFF"
          />
          <KpiCard
            title="Average Expert Rating"
            value="$250,000"
            icon={assets.filter}
            bg="#FFFFFF"
          />
        </div>

        <div className="flex gap-6 mt-6">
          <div className="flex-1 bg-white rounded-xl p-4">
            <p>Weight Progress</p>
            <ProgressChart />
          </div>

          <div className="flex-1 bg-white rounded-xl p-4">
            <p>Measurements</p>
            <WeightChart />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 h-full ">
        <p className="text-[16px] font-bold  text-[#0A4F48] ">Streaks</p>
        <div className="p-4 space-y-4 bg-[#F8F8F8] rounded-2xl mt-4">
          <div className="flex justify-between">
            <p className="font-500 text-[12px]">Active Streaks</p>
            <p className="text-[#0A4F48] font-bold text-xs">12 Days</p>
          </div>
          <div className="flex justify-between">
            <p className="font-400 text-[12px] text-[#66706D]">Longest Streaks</p>
            <p className="text-xs ">16 Days</p>
          </div>
        </div>
        
                <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-between w-full py-[7px]">
            <h2 className="font-bold text-[16px] text-[#0A4F48]">Compliance</h2>
            <span className="text-[16px] font-bold">78%</span>
          </div>
          <div className="flex flex-col items-center w-full gap-4">
            {compliance.map((items, i) => (
              <div key={i} className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
                <div
                  className="absolute left-0 top-0 w-2 h-full  rounded-xs"
                  style={{ background: items.color }}
                ></div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-[12px] ">{items.title}</p>
                  <div>
                    <span className="text-[12px] text-[#66706D] px-1.5 border-r border-r-[#DBDEDD]">
                      {items.Missed}
                    </span>
                    <span className="px-1.5 text-[11px] font-bold text-[#0A4F48]">
                      {items.percentage}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
      </div>
    </div>
  );
}

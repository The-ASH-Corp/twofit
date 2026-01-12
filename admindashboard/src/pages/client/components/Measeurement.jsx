import React from "react";
import { assets } from "@/assets/asset";

export default function Measeurement() {
  const measurements = [
    {
      label: "Chest",
      before: "93 cm",
      current: "96 cm",
      color: "bg-[#0A4F48]",
      active: true,
    },
    {
      label: "Waist",
      before: "92 cm",
      current: "89 cm",
      color: "bg-[#F4DBC7]",
      active: false,
    },
    {
      label: "Hips",
      before: "101 cm",
      current: "99 cm",
      color: "bg-[#EBF3F2]",
      active: false,
    },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm mt-4">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[#0A4F48] font-bold text-sm">Measurements</h3>
        <img
          src={assets.threeDotVector}
          alt="more"
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="space-y-6">
        {measurements.map((m, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`w-1.5 h-10 rounded-full ${m.color}`}></div>
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[14px] font-bold text-gray-800">
                {m.label}
              </span>
              <div className="flex gap-4 items-center">
                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
                  Before{" "}
                  <span className="font-bold text-gray-800">{m.before}</span>
                </span>
                <span
                  className={`text-[12px] font-bold px-3 py-1 rounded-lg ${
                    m.active
                      ? "bg-[#0A4F48] text-white shadow-sm"
                      : "text-[#0A4F48] border border-emerald-100 bg-emerald-50/30"
                  }`}
                >
                  {m.current}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

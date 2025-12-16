import React from "react";

export default function KpiCard({ title, value, icon, bg = "#F8F8F8" }) {
  return (
    <div
      className="flex  w-full    items-center rounded-xl p-4"
      style={{ backgroundColor: bg }}
    >
      <div>
        <p className="text-[12px] text-[#0A4F48] font-regular ">
          {title}
        </p>
        <h2 className="text-[20px] font-bold text-[#0A4F48]">
          {value}
        </h2>
      </div>

      <div className="ml-auto w-10 h-10 flex items-center justify-center rounded-full bg-[#0A4F48]">
        <img
          src={icon}
          alt={title}
          className="w-5 h-5 text-white"
        />
      </div>
    </div>
  );
}

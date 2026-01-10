import React from "react";

export default function KpiCard({ title, value, icon, bg, iconColor }) {
  return (
    <div className="w-full h-full rounded-2xl p-5 flex flex-col justify-between shadow-sm bg-white">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full"
        style={{ backgroundColor: bg }}
      >
        <img
          src={icon}
          alt={title}
          className="w-5 h-5"
          style={{ filter: iconColor ? "brightness(0) invert(1)" : "none" }}
        />
      </div>
      <div className="mt-4">
        <h2 className="text-[20px] font-bold text-[#0A4F48] leading-tight">
          {value}
        </h2>
        <p className="text-[12px] text-gray-400 font-medium mt-1">{title}</p>
      </div>
    </div>
  );
}

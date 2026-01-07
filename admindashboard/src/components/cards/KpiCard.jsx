import React from "react";

export default function KpiCard({ title, value, icon, bg , iconClass}) {
  return (
    <div
      className="w-full items-center rounded-xl p-3 flex justify-between shadow"
      style={{ backgroundColor: bg }}
    >
      <div>
        <p className="text-[12px] text-[#0A4F48] font-regular ">{title}</p>
        <h2 className="text-[20px] font-bold text-[#0A4F48]">{value}</h2>
      </div>
      <div className={`w-11 h-11 p-2 rounded-[20px] ${iconClass}`}>
        <img src={icon} alt={title} className="w-9 h-6 text-white  " />
      </div>
    </div>
  );
}

import React from "react";

export default function KpiCard({ title, value, icon, bg }) {
  return (
    <div
      className="w-[100%] items-center rounded-xl p-3 flex justify-between shadow"
      style={{ backgroundColor: bg }}
    >
      <div>
        <p className="text-[12px] text-[#0A4F48] font-regular ">{title}</p>
                <h2 className="text-[20px] font-bold text-[#0A4F48]">{value}</h2>

      </div>
      <div className="bg-green-900 w-8 h-8 p-2 rounded-full">
        <img src={icon} alt={title} className="w-5 h-5 text-white  " />
      </div>
    </div>
  );
}

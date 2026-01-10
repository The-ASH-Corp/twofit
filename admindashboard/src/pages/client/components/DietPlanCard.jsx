import React from "react";
import { assets } from "@/assets/asset";

export default function DietPlanCard() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-4">
      <h3 className="text-[#0A4F48] font-bold text-sm mb-5 leading-none">
        Diet Plan
      </h3>
      <div className="flex items-center justify-between bg-[#FDF8F3] p-4 rounded-[20px] border border-[#FBEAD9]/50">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-[#FBEAD9] flex items-center justify-center rounded-xl shadow-sm">
            <img src={assets.pdfVector} alt="pdf" className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-gray-800 leading-none mb-1.5">
              Breakfast-oats.pdf
            </p>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
              PDF • 2.4 MB
            </p>
          </div>
        </div>
        <button className="bg-white text-[12px] font-bold px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors">
          View
        </button>
      </div>
    </div>
  );
}

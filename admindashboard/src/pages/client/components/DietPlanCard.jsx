import React from "react";
import { FileText, MoreHorizontal } from "lucide-react";

export default function DietPlanCard({ dietPlanPdf }) {
  const handleViewPdf = () => {
    if (dietPlanPdf) {
      const fullUrl = `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${dietPlanPdf}`;
      window.open(fullUrl, "_blank");
    }
  };

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-6 group transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-gray-800 font-black text-[15px] uppercase tracking-widest">
          Diet Plan
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div 
        className="bg-[#F8FAFA] p-4 rounded-[24px] flex items-center justify-between border border-gray-100 transition-all hover:border-[#0A4F48]/10 group/item cursor-pointer"
        onClick={handleViewPdf}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-[18px] flex items-center justify-center text-rose-500 shadow-sm group-hover/item:scale-105 transition-transform">
            <FileText size={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[13px] font-black text-gray-800 tracking-tight leading-none mb-1 max-w-[120px] truncate">
              {dietPlanPdf?.split('/').pop() || "1771065315273..."}
            </h4>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
              Diet Guide PDF
            </span>
          </div>
        </div>
        
        <button className="text-[#0A4F48] font-black text-[13px] hover:underline px-2">
          View
        </button>
      </div>
    </div>
  );
}



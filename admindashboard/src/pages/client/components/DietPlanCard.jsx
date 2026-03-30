import React from "react";
import { FileText, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DietPlanCard({ dietPlanPdf }) {
  const navigate = useNavigate();

  const handleDownloadPdf = (e) => {
    e.stopPropagation();
    if (dietPlanPdf) {
      const fullUrl = `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${dietPlanPdf}`;
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = dietPlanPdf.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewDietPage = () => {
    navigate("/client/diet");
  };

  return (
    <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl md:rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-5 sm:gap-6 group transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-gray-400 font-black text-[15px] uppercase tracking-widest">
          Daily Diet Plan
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadPdf}
            className="p-2 text-gray-400 hover:text-[#0A4F48] hover:bg-[#F1F5F9] rounded-xl transition-all"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div 
        className="bg-[#F8FAFA] p-4 sm:p-5 rounded-2xl md:rounded-3xl flex items-center justify-between border border-gray-100 transition-all hover:border-[#0A4F48]/10 group/item cursor-pointer shadow-sm hover:shadow-md"
        onClick={handleViewDietPage}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 rounded-[18px] flex items-center justify-center text-rose-500 shadow-sm group-hover/item:scale-105 transition-transform">
            <FileText size={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[14px] font-black text-gray-800 tracking-tight leading-none mb-1 max-w-[140px] truncate">
              {dietPlanPdf?.split('/').pop() || "Diet_Guide_v1.pdf"}
            </h4>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
              Client Diet Guide
            </span>
          </div>
        </div>
        
        <div className="bg-white p-2 rounded-xl shadow-sm text-[#0A4F48] group-hover/item:bg-[#0A4F48] group-hover/item:text-white transition-all">
          <Eye size={16} />
        </div>
      </div>
    </div>
  );
}



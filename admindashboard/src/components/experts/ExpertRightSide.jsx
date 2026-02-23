
import React, { useMemo } from "react";
import { MoreHorizontal, FileText, Target, FileIcon, Download, DownloadCloud } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ENV } from "../../utils/env";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpertRightSide = ({ expert }) => {
  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const baseUrl = (ENV.API_BASE_URL || "").replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  const complianceStats = useMemo(() => {
    const users = expert?.assignedUsers || [];
    if (users.length === 0) {
      return {
        totalClients: 0,
        avgCompliance: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
      };
    }

    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let totalCompliance = 0;

    users.forEach((user) => {
      const compliance = Number(user?.compliance ?? 0);
      totalCompliance += compliance;

      if (compliance > 75) {
        highCount += 1;
      } else if (compliance >= 40) {
        mediumCount += 1;
      } else {
        lowCount += 1;
      }
    });

    const avgCompliance = Math.round(totalCompliance / users.length);

    return {
      totalClients: users.length,
      avgCompliance,
      highCount,
      mediumCount,
      lowCount,
    };
  }, [expert?.assignedUsers]);

  const complianceData = useMemo(() => {
    if (complianceStats.totalClients === 0) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#E5E7EB"],
            borderWidth: 0,
            cutout: "85%",
            borderRadius: 4,
          },
        ],
      };
    }

    return {
      labels: ["High", "Medium", "Low"],
      datasets: [
        {
          data: [
            complianceStats.highCount,
            complianceStats.mediumCount,
            complianceStats.lowCount,
          ],
          backgroundColor: ["#0A4F48", "#94A3B8", "#F59E0B"], // Brand Green, Slate, Amber
          hoverBackgroundColor: ["#0F766E", "#64748B", "#D97706"],
          borderWidth: 0,
          cutout: "85%",
          borderRadius: 4,
          spacing: 2,
        },
      ],
    };
  }, [complianceStats]);

  const getPercent = (count) => {
    if (!complianceStats.totalClients) return "0%";
    return `${Math.round((count / complianceStats.totalClients) * 100)}%`;
  };

  const complianceOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const documents = useMemo(() => {
    const docs = [];
    if (expert?.certifications) {
      docs.push({
        name: "Certification",
        url: getFileUrl(expert.certifications),
        type: "Certification",
        date: "N/A"
      });
    }
  
    return docs;
  }, [expert]);

  return (
    <div className="flex flex-col gap-6">
       
       {/* 1. Compliance Chart Section */}
       <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden shrink-0">
          <div className="px-6 py-5 border-b border-[#F1F5F9] bg-[#FAFCFF] flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#0A4F48]">
                    <Target size={20} strokeWidth={2} />
                </div>
                <div>
                    <h2 className="text-[#1E293B] font-bold text-lg tracking-tight leading-none">Compliance</h2>
                    <p className="text-[11px] text-[#64748B] font-medium mt-1">Client adherence stats</p>
                </div>
            </div>
            {complianceStats.totalClients > 0 && (
                <div className="text-right">
                    <span className="block text-xl font-black text-[#0A4F48] leading-none">{complianceStats.avgCompliance}%</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600/70">AVG Rating</span>
                </div>
            )}
          </div>

          <div className="p-6 relative">
             <div className="relative w-full aspect-square max-h-[180px] flex items-center justify-center mb-6">
                <div className="relative w-[160px] h-[160px]">
                    <Doughnut data={complianceData} options={complianceOptions} />
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-[#1E293B] tracking-tighter">{complianceStats.totalClients}</span>
                        <span className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-widest mt-1">Clients</span>
                    </div>
                </div>
             </div>

             {/* Custom Legend */}
             <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase mb-1">High</span>
                    <span className="text-lg font-bold text-[#0A4F48]">{getPercent(complianceStats.highCount)}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">Med</span>
                    <span className="text-lg font-bold text-slate-600">{getPercent(complianceStats.mediumCount)}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-amber-50/50 border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-600 uppercase mb-1">Low</span>
                    <span className="text-lg font-bold text-amber-600">{getPercent(complianceStats.lowCount)}</span>
                </div>
             </div>
          </div>
       </div>

       {/* 2. Documents Section */}
       <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden shrink-0">
          <div className="px-6 py-5 border-b border-[#F1F5F9] bg-[#FAFCFF] flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#0A4F48]">
                    <FileText size={20} strokeWidth={2} />
                </div>
                <div>
                    <h2 className="text-[#1E293B] font-bold text-lg tracking-tight leading-none">Documents</h2>
                    <p className="text-[11px] text-[#64748B] font-medium mt-1">Contracts & Certifications</p>
                </div>
            </div>
          </div>

          <div className="overflow-y-visible p-4 space-y-3">
             {documents.length > 0 ? (
                 documents.map((doc, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] hover:bg-white hover:shadow-sm transition-all duration-200">
                       <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center justify-center shrink-0">
                             <FileIcon size={18} />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                             <span className="text-sm font-bold text-[#334155] truncate">{doc.name}</span>
                             <span className="text-[10px] font-medium text-[#94A3B8] flex items-center gap-1.5">
                                {doc.type} • {doc.date}
                             </span>
                          </div>
                       </div>
                       
                       <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#0A4F48] hover:bg-emerald-50 transition-all shrink-0"
                       >
                          <DownloadCloud size={16} />
                       </a>
                    </div>
                 ))
             ) : (
                 <div className="text-center text-xs text-gray-400 py-4">
                     No documents found.
                 </div>
             )}
          </div>
       </div>

    </div>
  );
};
export default ExpertRightSide;

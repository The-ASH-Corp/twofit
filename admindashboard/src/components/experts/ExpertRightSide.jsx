
import React, { useMemo } from "react";
import { Target } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpertRightSide = ({ expert }) => {
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

  return (
    <div className="flex h-full flex-col gap-4 sm:gap-6">
      {/* 1. Compliance Chart Section */}
      <div className="flex shrink-0 flex-col overflow-hidden rounded-3xl border border-[#EEF2F6] bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-3 border-b border-[#F1F5F9] bg-[#FAFCFF] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#0A4F48]">
              <Target size={20} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[#1E293B] font-bold text-lg tracking-tight leading-none">
                Compliance
              </h2>
              <p className="text-[11px] text-[#64748B] font-medium mt-1">
                Client adherence stats
              </p>
            </div>
          </div>
          {complianceStats.totalClients > 0 && (
            <div className="text-left sm:text-right">
              <span className="block text-xl font-black text-[#0A4F48] leading-none">
                {complianceStats.avgCompliance}%
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600/70">
                Avg Compliance
              </span>
            </div>
          )}
        </div>

        <div className="relative p-4 sm:p-6">
          <div className="mb-6 flex aspect-square w-full max-h-[180px] items-center justify-center">
            <div className="relative h-36 w-36 sm:h-40 sm:w-40">
              <Doughnut data={complianceData} options={complianceOptions} />
              {/* Center Text */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black tracking-tighter text-[#1E293B] sm:text-3xl">
                  {complianceStats.totalClients}
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  Clients
                </span>
              </div>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl border border-emerald-100 bg-emerald-50/50 p-2">
              <span className="mb-1 text-[10px] font-bold uppercase text-emerald-600">
                High
              </span>
              <span className="text-lg font-bold text-[#0A4F48]">
                {getPercent(complianceStats.highCount)}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-2">
              <span className="mb-1 text-[10px] font-bold uppercase text-slate-500">
                Med
              </span>
              <span className="text-lg font-bold text-slate-600">
                {getPercent(complianceStats.mediumCount)}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-amber-100 bg-amber-50/50 p-2">
              <span className="mb-1 text-[10px] font-bold uppercase text-amber-600">
                Low
              </span>
              <span className="text-lg font-bold text-amber-600">
                {getPercent(complianceStats.lowCount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExpertRightSide;

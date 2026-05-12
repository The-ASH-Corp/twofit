import React, { useMemo } from "react";
import DonutChart from "./AdminChart";
import { Target, TrendingUp, Activity, PieChart } from "lucide-react";

const HeadRightSide = ({ dashboardData }) => {
  // Performance data rendering logic based on dashboardData
  const performanceInfo = useMemo(() => {
    // Default values
    const defaultPerf = { programs: 30, experts: 45, clients: 25 };
    const adminPerf = dashboardData?.adminPerformance;

    const total = adminPerf?.programs + adminPerf?.experts + adminPerf?.clients;

    const toPercent = (val) =>
      total > 0 ? Math.round((val / total) * 100) : 0;

    const programsPct = toPercent(adminPerf?.programs);
    const expertsPct = toPercent(adminPerf?.experts);
    const clientsPct = toPercent(adminPerf?.clients);

    // Use expertPerformance.taskCompletion as the center average compliance score
    // If no data, use a placeholder for visual demonstration
    const avgCompliance = dashboardData?.expertPerformance?.taskCompletion || 0;

    return {
      average: avgCompliance,
      metrics: [
        {
          label: "Programs",
          value: `${programsPct}%`,
          color: "bg-[#0A4F48]",
          textColor: "text-[#0A4F48]",
          trend: "+2.4%",
        },
        {
          label: "Experts",
          value: `${expertsPct}%`,
          color: "bg-[#4B5563]", // Slate-600 like
          textColor: "text-[#4B5563]",
          trend: "+1.2%",
        },
        {
          label: "Clients",
          value: `${clientsPct}%`,
          color: "bg-[#D97706]", // Amber-600
          textColor: "text-[#D97706]",
          trend: "-0.5%",
        },
      ],
      chartData: {
        high: programsPct,
        medium: expertsPct,
        low: clientsPct,
      },
    };
  }, [dashboardData]);

  return (
    <div className="flex flex-col h-full min-h-[400px] lg:min-h-0 bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)]">
      {/* Enhanced Header */}
      <div className="px-6 py-5 border-b border-[#F1F5F9] bg-[#FAFCFF] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#0A4F48]">
            <Activity size={20} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[#1E293B] font-bold text-lg tracking-tight leading-none">
              Performance
            </h2>
            <p className="text-[11px] text-[#64748B] font-medium mt-1">
              Key indicators & metrics
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#059669] text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <TrendingUp size={12} strokeWidth={2.5} />
          <span>Active</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 flex flex-col items-center justify-between flex-1 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#0A4F48]/5 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

        <div className="relative w-full aspect-square max-h-[220px] flex items-center justify-center p-2 mb-4">
          <div className="relative z-10 scale-110 drop-shadow-xl">
            <DonutChart
              percentage={performanceInfo.average}
              high={performanceInfo.chartData.high}
              medium={performanceInfo.chartData.medium}
              low={performanceInfo.chartData.low}
              size={160}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="w-full grid grid-cols-3 gap-3">
          {performanceInfo.metrics.map((metric, i) => (
            <div
              key={i}
              className="group flex flex-col items-center justify-center p-3 rounded-xl bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] hover:bg-white hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-full h-0.5 ${metric.color} opacity-20 group-hover:opacity-100 transition-opacity`}
              ></div>

              <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider mb-1 group-hover:scale-105 transition-transform">
                {metric.label}
              </span>
              <span
                className={`text-xl font-black tracking-tight ${metric.textColor} group-hover:scale-110 transition-transform duration-300`}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeadRightSide;

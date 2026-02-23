import React, { useMemo } from "react";
import DonutChart from "./AdminChart";
import { Loader2, TrendingUp, Users, Smartphone, Monitor } from "lucide-react";

const AdminRightSide = ({ admin, dashboardData }) => {
  const totals = useMemo(() => {
    const programs = dashboardData?.totalPrograms ?? admin?.program?.length ?? 0;
    const experts = dashboardData?.totalExperts ?? admin?.experts?.length ?? 0;
    const clients = dashboardData?.totalClients ?? 0;
    return { programs, experts, clients };
  }, [dashboardData, admin]);

  const totalEntities = totals.programs + totals.experts + totals.clients;
  const toPercent = (value) =>
    totalEntities > 0 ? Math.round((value / totalEntities) * 100) : 0;

  const programsPct = toPercent(totals.programs);
  const expertsPct = toPercent(totals.experts);
  const clientsPct = toPercent(totals.clients);

  const avgCompliance = useMemo(() => {
    const datasets = dashboardData?.graphData?.compliance?.datasets || [];
    const values = datasets.flatMap((ds) =>
      Array.isArray(ds?.data) ? ds.data : [],
    );
    const numeric = values.filter((v) => Number.isFinite(v));
    if (numeric.length === 0) return 0;
    const sum = numeric.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / numeric.length);
  }, [dashboardData]);

  const metrics = [
    { label: "Programs", value: `${programsPct}%`, color: "bg-[#0A4F48]", icon: Monitor },
    { label: "Experts", value: `${expertsPct}%`, color: "bg-[#EBF3F2]", icon: Users },
    { label: "Clients", value: `${clientsPct}%`, color: "bg-[#F4DBC7]", icon: Smartphone },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 sm:p-5 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[#0A4F48]">
                <TrendingUp size={20} strokeWidth={2} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-800 leading-none">Performance</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Key metrics & overview</p>
             </div>
         </div>
      </div>

       {/* Chart Section */}
       <div className="p-4 sm:p-6 flex flex-col items-center justify-center gap-6 flex-1 relative overflow-hidden min-h-[300px]">
        
        {/* Decorative Background Elements */}
        {/* Removed decorative ring - it was causing alignment issues and adds visual noise */}
        
        <div className="relative z-10 w-full flex items-center justify-center p-2">
            <DonutChart
              percentage={avgCompliance}
              high={programsPct}
              medium={expertsPct}
              low={clientsPct}
              size={170}
            />
        </div>

        {/* Legend Grid */}
        <div className="w-full grid grid-cols-1 gap-2 mt-4 px-2 sm:px-0">
            {metrics.map((metric, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all hover:shadow-sm cursor-default group">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${metric.color}`}></div>
                        <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                             <div className="h-1 w-12 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                 <div className={`h-full ${metric.color} opacity-50 w-[70%]`}></div>
                             </div>
                        </div>
                    </div>
                    <span className="text-lg font-black text-slate-700 tabular-nums tracking-tight group-hover:scale-110 transition-transform">
                        {metric.value}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRightSide;

import React, { useMemo } from "react";
import { Scale, Ruler, TrendingUp, TrendingDown, Minus, LineChart as ChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExpertClientProfileRightSide = ({ client }) => {

  const weightStats = useMemo(() => {
    const history = client?.weightHistory || [];
    if (history.length === 0) return { start: 0, current: 0, change: 0 };
    
    const start = history[0]?.weight || 0;
    const current = history[history.length - 1]?.weight || 0;
    const change = current - start;
    
    return { start, current, change };
  }, [client?.weightHistory]);

  const measurements = useMemo(() => {
     const history = client?.measurementHistory || [];
     const first = history[0] || {};
     const last = history[history.length - 1] || {};

     return [
       { label: "Chest", start: first.chest || 0, current: last.chest || 0 },
       { label: "Waist", start: first.waist || 0, current: last.waist || 0 },
       { label: "Hips", start: first.hip || 0, current: last.hip || 0 },
     ];
  }, [client?.measurementHistory]);

  const assessmentData = useMemo(() => {
    if (!client?.weeklyCheckIns) return [];
    return client.weeklyCheckIns.map(item => ({
      week: `Week ${item.weekIndex}`,
      rating: item.responses?.[0]?.rating || 0,
      label: item.responses?.[0]?.description || "N/A"
    })).sort((a, b) => {
       const wA = parseInt(a.week.replace("Week ", ""));
       const wB = parseInt(b.week.replace("Week ", ""));
       return wA - wB;
    });
  }, [client?.weeklyCheckIns]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Assessment Progress Graph */}
      

      {/* 2. Weight Analysis */}
      <div className="bg-white rounded-3xl p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
               <Scale size={18} />
            </div>
            <h3 className="font-bold text-[#1E293B] text-lg">Weight Progress</h3>
         </div>

         <div className="flex flex-col gap-4">
            {/* Main Stat */}
            <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Current Weight</span>
                  <span className="text-2xl font-black text-[#1E293B]">{weightStats.current} <span className="text-sm font-bold text-[#94A3B8]">kg</span></span>
               </div>
               <div className={`flex flex-col items-end ${weightStats.change > 0 ? "text-rose-500" : weightStats.change < 0 ? "text-emerald-500" : "text-slate-400"}`}>
                   <span className="flex items-center gap-1 font-bold text-sm">
                      {weightStats.change > 0 ? <TrendingUp size={14} /> : weightStats.change < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                      {Math.abs(weightStats.change).toFixed(1)} kg
                   </span>
                   <span className="text-[10px] font-bold opacity-80">Since start</span>
               </div>
            </div>

            {/* Sub Stats */}
            <div className="grid grid-cols-2 gap-3">
               <div className="p-3 bg-white border border-[#F1F5F9] rounded-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Start</span>
                  <span className="text-sm font-bold text-[#334155]">{weightStats.start} kg</span>
               </div>
               <div className="p-3 bg-white border border-[#F1F5F9] rounded-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Target</span>
                  <span className="text-sm font-bold text-[#334155]">{client?.targetWeight || "N/A"} kg</span>
               </div>
            </div>
         </div>
      </div>

      {/* 3. Body Measurements */}
      <div className="bg-white rounded-3xl p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
               <Ruler size={18} />
            </div>
            <h3 className="font-bold text-[#1E293B] text-lg">Measurements</h3>
         </div>

         <div className="flex flex-col gap-3">
            <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-[#94A3B8] px-2 mb-1">
               <div className="col-span-4">Area</div>
               <div className="col-span-4 text-center">Inches</div>
               <div className="col-span-4 text-right">Change</div>
            </div>
            
            {measurements.map((item, i) => {
               const change = item.current - item.start;
               return (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#E2E8F0] transition-colors">
                     <div className="col-span-4 font-bold text-[#334155] text-sm">
                        {item.label}
                     </div>
                     <div className="col-span-4 flex items-center justify-center gap-1.5">
                        <span className="text-xs font-medium text-[#64748B] line-through decoration-slate-300">{item.start}</span>
                        <span className="text-xs font-bold text-[#334155]">{item.current}</span>
                     </div>
                     <div className={`col-span-4 text-right text-xs font-bold ${change < 0 ? "text-emerald-500" : change > 0 ? "text-rose-500" : "text-slate-400"}`}>
                        {change > 0 ? "+" : ""}{change.toFixed(1)}
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <ChartIcon size={18} />
                </div>
                <h3 className="font-bold text-[#1E293B] text-lg">Assessment Progress</h3>
            </div>
         </div>

         <div className="h-[180px] w-full mt-2">
            {assessmentData.length === 0 ? (
               <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-50 rounded-2xl">
                  <ChartIcon size={24} className="opacity-40" />
                  <span className="text-[11px] font-medium uppercase tracking-widest">No assessments yet</span>
               </div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={assessmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0A4F48" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#0A4F48" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid horizontal={true} vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                     <XAxis 
                        dataKey="week" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 600 }}
                        dy={8}
                     />
                     <YAxis
                        domain={[0, 5]}
                        ticks={[0, 1, 2, 3, 4, 5]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                     />
                     <Tooltip 
                        content={({ active, payload }) => {
                           if (active && payload && payload.length) {
                              return (
                                 <div className="bg-[#1E293B] p-3 shadow-2xl rounded-xl border border-white/10 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{payload[0].payload.week}</span>
                                    <div className="flex items-center gap-2">
                                       <span className="text-xl font-black text-white">{payload[0].value}</span>
                                       <span className="text-[11px] font-bold text-emerald-400">{payload[0].payload.label}</span>
                                    </div>
                                 </div>
                              );
                           }
                           return null;
                        }}
                     />
                     <Area
                        type="monotone"
                        dataKey="rating"
                        stroke="#0A4F48"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRating)"
                        activeDot={{ r: 5, fill: '#0A4F48', stroke: '#fff', strokeWidth: 3 }}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            )}
         </div>
      </div>
      
    </div>
  );
};

export default ExpertClientProfileRightSide;


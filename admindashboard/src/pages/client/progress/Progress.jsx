import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  TrendingDown,
  BadgeCheck,
  Zap,
  X,
  Plus,
} from "lucide-react";
import ProgressChart from "../components/ProgressChart";
import WeightUpdate from "./WeightUpdate";
import MeasurementUpdate from "./MeasurementUpdate";
import HoldPlan from "./HoldPlan";
import ExtendPlan from "./ExtendPlan";
import MobileBottomNav from "../components/MobileBottomNav";
import AdherenceStreaks from "../components/AdherenceStreaks";
import { useAppSelector } from "@/redux/store/hooks";
import { useDispatch } from "react-redux";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import {
  fetchClientComplianceStats,
  getClient,
} from "@/redux/features/client/client.thunk";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import { SyncLoader } from "react-spinners";

export default function Progress() {
  const [program, setProgram] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAppSelector(selectUser);
  const selectedClient = useAppSelector(selectSelectedClient);
  const dispatch = useDispatch();
  const clientData = selectedClient || user;

  const clampPercent = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return 0;
    return Math.min(Math.max(Math.round(num), 0), 100);
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const programId =
        typeof user?.programType === "object"
          ? user?.programType?._id
          : user?.programType;
      const program = await dispatch(getProgramById(programId)).unwrap();
      await dispatch(getClient({ id: user?._id })).unwrap();
      const compliance = await dispatch(fetchClientComplianceStats(user?._id)).unwrap();
      setComplianceData(compliance);
      setProgram(program.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, user?._id, user?.programType]);

  useEffect(() => {
    if (user?._id && user?.programType) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, user?._id, user?.programType]);

  const sortedWeightHistory = [...(clientData?.weightHistory || [])].sort(
    (a, b) => new Date(a?.date) - new Date(b?.date)
  );
  const sortedMeasurementHistory = [...(clientData?.measurementHistory || [])].sort(
    (a, b) => new Date(a?.date) - new Date(b?.date)
  );

  const lastWeightUpdateDate =
    sortedWeightHistory[sortedWeightHistory.length - 1]?.date || "";
  const lastMeasurementUpdateDate =
    sortedMeasurementHistory[sortedMeasurementHistory.length - 1]?.date || "";

  const shouldShowWeightUpdateButton = () => {
    if (!lastWeightUpdateDate) return true;
    const daysSinceLastUpdate = (new Date() - new Date(lastWeightUpdateDate)) / (1000 * 60 * 60 * 24);
    return daysSinceLastUpdate >= 7;
  };

  const shouldShowMeasurementUpdateButton = () => {
    if (!lastMeasurementUpdateDate) return true;
    const daysSinceLastUpdate = (new Date() - new Date(lastMeasurementUpdateDate)) / (1000 * 60 * 60 * 24);
    return daysSinceLastUpdate >= 7;
  };

  // Data processing for KPIs
  const startWeight = sortedWeightHistory[0]?.weight || 0;
  const currentWeight = clientData?.currentWeight || 0;
  const weightChange = currentWeight - startWeight;

  const startMeasurements = sortedMeasurementHistory[0] || {
    chest: 0,
    waist: 0,
    hip: 0,
  };
  const currentMeasurements =
    sortedMeasurementHistory[sortedMeasurementHistory.length - 1] || {
    chest: 0,
    waist: 0,
    hip: 0,
  };

  const currentDay = Number(clientData?.currentGlobalDay) || 1;
  const totalDuration =
    parseInt(program?.plan?.duration, 10) || Number(program?.plan?.duration) || 0;
  const programProgressPercent = clampPercent(
    totalDuration > 0 ? (currentDay / totalDuration) * 100 : 0
  );

  const kpiData = [
    {
      title: "PROGRAM DAYS",
      value: (
        <span className="text-[32px] lg:text-[40px] font-black tracking-tighter text-[#0A4F48] leading-none">
          {clientData?.currentGlobalDay || 1}
          <span className="text-gray-300">/{program?.plan?.duration || 0}</span>
        </span>
      ),
      icon: <Calendar size={18} className="text-[#0A4F48] hidden lg:block" />,
      subtitle: (
        <div className="w-full bg-[#D8EFE7] h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-[#0A4F48] h-full"
            style={{
              width: `${programProgressPercent}%`,
            }}
          />
        </div>
      ),
    },
    {
      title: "WEIGHT PROGRESS",
      value: (
        <span className="text-[32px] lg:text-[40px] font-black tracking-tighter text-[#0A4F48] leading-none">
          {currentWeight} <span className="text-[16px] font-bold text-gray-500 tracking-normal">kg</span>
        </span>
      ),
      icon: <TrendingDown size={18} className="text-white bg-[#0A4F48] rounded-[4px] p-0.5 hidden lg:block" />,
      subtitle: (
        <div className="flex items-center gap-1.5 text-gray-500 lg:text-rose-500 text-[10px] lg:text-[12px] font-bold mt-2">
          <TrendingDown size={14} className="hidden lg:block" />
          {weightChange > 0 ? "+" : ""}
          <span className="text-gray-800 lg:text-rose-500">
            <TrendingDown size={12} className="inline lg:hidden mr-1" />
            {weightChange} kg
          </span> <span className="text-gray-400">from start</span>
        </div>
      ),
    },
    {
      title: "OVERALL COMPLIANCE",
      value: (
        <span className="text-[32px] lg:text-[40px] font-black tracking-tighter text-[#0A4F48] leading-none">
          {complianceData?.overall || 0}%
        </span>
      ),
      icon: <BadgeCheck size={20} className="text-[#0A4F48] hidden lg:block" />,
      subtitle: (
        <div className="text-gray-500 text-[10px] lg:text-[11px] font-medium mt-2 leading-tight">
          <span className="hidden lg:inline">Compliance score of the program</span>
          <span className="inline lg:hidden">Early stages</span>
        </div>
      ),
    },
    {
      title: "ACTIVE STREAK",
      value: (
        <span className="text-[32px] lg:text-[40px] font-black tracking-tighter text-[#8C5A35] lg:text-[#0A4F48] leading-none">
          {complianceData?.streaks?.activeStreak || 0} <span className="text-[16px] lg:text-[20px] font-bold tracking-normal">Days</span>
        </span>
      ),
      icon: <Zap size={18} className="text-[#0A4F48] fill-[#0A4F48] hidden lg:block" />,
      subtitle: (
        <div className="text-gray-500 text-[10px] lg:text-[11px] font-medium mt-2 leading-tight">
          <span className="hidden lg:inline">Start today to build momentum</span>
          <span className="inline lg:hidden text-gray-500 font-bold">Let's start today!</span>
        </div>
      ),
    },
  ];

  const complianceBreakdown = [
    {
      title: "DIET",
      percentage: clampPercent(complianceData?.diet),
      color: "#0A4F48",
    },
    {
      title: "WORKOUT",
      percentage: clampPercent(complianceData?.workout),
      color: "#0A4F48",
    },
    {
      title: "THERAPY",
      percentage: clampPercent(complianceData?.therapy),
      color: "#0A4F48",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FBFA] lg:bg-[#F8FAFA] lg:p-8 p-4 min-h-screen pb-32 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="hidden lg:flex justify-between items-center mb-8">
        <h1 className="text-gray-800 font-black text-[28px] tracking-tight">
          Progress Overview
        </h1>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-6">
        {/* ROW 1: KPIs (Mobile: order-1) */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 order-1">
          {kpiData.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-[24px] lg:rounded-[32px] p-5 lg:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-50 lg:border-white flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start lg:mb-6 mb-3">
                <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-gray-500">
                  {kpi.title}
                </h4>
                {kpi.icon}
              </div>
              <div>
                {kpi.value}
                {kpi.subtitle}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Breakdown (Mobile: order-2, Desktop: order-4 | col-6) */}
        <div className="lg:col-span-6 order-2 lg:order-4 bg-[#F2F5F4] lg:bg-white rounded-[32px] p-6 lg:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-center gap-10">
          <h3 className="font-black text-[16px] lg:text-[18px] text-gray-800 tracking-tight leading-snug w-full lg:hidden block">
            Compliance
          </h3>
          {/* Donut Chart */}
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-gray-200 lg:text-gray-100"
                strokeWidth="5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#0A4F48]"
                strokeWidth="5"
                strokeDasharray={`${complianceData?.overall || 4}, 100`}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[32px] lg:text-[36px] font-black text-gray-800 lg:text-[#0A4F48] leading-none mb-1 tracking-tighter">{complianceData?.overall || 4}%</span>
              <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 mt-1">TOTAL</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full">
            <h3 className="font-black text-[18px] text-gray-800 tracking-tight leading-snug mb-6 hidden lg:block">
              Compliance<br />Breakdown
            </h3>

            <div className="space-y-4 lg:space-y-4 mb-2 lg:mb-6">
              {complianceBreakdown.map((item, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-center mb-1 lg:mb-1.5">
                    <span className="text-[9px] lg:text-[12px] font-black tracking-widest text-gray-500 lg:text-gray-800">{item.title}</span>
                    <span className="text-[9px] lg:text-[14px] font-black text-gray-500 lg:text-[#0A4F48]">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E7EBEA] lg:bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-500 font-medium leading-relaxed hidden lg:block">
              You're currently below your target.<br />Consistency in your Diet Plan is your strongest area this week.
            </p>
          </div>
        </div>

        {/* Weight Progress Chart (Mobile: order-3, Desktop: order-2 | col-6) */}
        <div className="lg:col-span-6 order-3 lg:order-2 bg-white rounded-[32px] p-6 lg:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col">
          <div className="flex justify-between items-center mb-2 lg:mb-6">
            <h3 className="font-black text-[15px] lg:text-[18px] text-gray-800 tracking-tight">
              Weight Progress
            </h3>
            {shouldShowWeightUpdateButton() && (
              <button
                onClick={() => {
                  setIsOpen(true);
                  setPanelType("weight");
                }}
                className="text-[10px] uppercase font-black tracking-widest text-[#0A4F48] bg-[#E6FFFA] px-3 py-1.5 rounded-full hover:bg-[#A7F3D0] transition-colors"
              >
                Update
              </button>
            )}
          </div>

          {/* Unified chart on both desktop and mobile using live backend data */}
          <div className="w-full flex-1">
            <ProgressChart />
          </div>
        </div>

        {/* Measurements Stack (Mobile: order-4, Desktop: order-3 | col-6) */}
        <div className="lg:col-span-6 order-4 lg:order-3 bg-white rounded-[32px] p-6 lg:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col">
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h3 className="font-black text-[15px] lg:text-[18px] text-gray-800 tracking-tight">
              Measurements
            </h3>
            {shouldShowMeasurementUpdateButton() && (
              <button
                onClick={() => {
                  setIsOpen(true);
                  setPanelType("measurement");
                }}
                className="text-[10px] uppercase font-black tracking-widest text-[#0A4F48] bg-[#E6FFFA] px-3 py-1.5 rounded-full hover:bg-[#A7F3D0] transition-colors"
              >
                Update
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6 lg:space-y-8">
            {[
              { label: "CHEST", current: currentMeasurements.chest || 0, initial: startMeasurements.chest || 0 },
              { label: "WAIST", current: currentMeasurements.waist || 0, initial: startMeasurements.waist || 0 },
              { label: "HIPS", current: currentMeasurements.hip || 0, initial: startMeasurements.hip || 0 },
            ].map((m, i) => {
              const maxVal = Math.max(m.current, m.initial, 1);
              const currentPct = (m.current / maxVal) * 100;
              const initialPct = (m.initial / maxVal) * 100;

              return (
                <div key={i} className="flex flex-col lg:flex-row lg:items-center relative">
                  {/* Measurement Track Overlay */}
                  <div className="flex justify-between items-center w-full gap-4 relative">
                     <span className="text-[10px] font-black tracking-widest uppercase text-gray-800 w-12 shrink-0">{m.label}</span>
                     
                     {/* Overlay bars: initial in light color, current in dark color */}
                     <div className="flex-1 h-3 lg:h-10 rounded-full w-full bg-[#E5ECE9] lg:bg-transparent overflow-hidden relative">
                        {/* Initial Bar */}
                        <div
                          className="absolute left-0 top-0 h-full bg-[#E6FFFA] rounded-[12px] z-0 transition-all duration-1000"
                          style={{ width: `${initialPct}%` }}
                        />
                        {/* Current Bar */}
                        <div
                          className="absolute left-0 top-0 h-full bg-[#0A4F48] rounded-[12px] z-10 transition-all duration-1000 shadow-sm"
                          style={{ width: `${currentPct}%` }}
                        />
                     </div>

                     <span className="text-[10px] lg:text-[11px] font-black text-gray-800 lg:w-32 text-right shrink-0">
                       {m.current} cm <span className="text-gray-400 font-bold">VS {m.initial} CM</span>
                     </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center lg:justify-start gap-4 lg:gap-6 mt-8">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <div className="w-2.5 h-2.5 rounded-full lg:rounded-[3px] bg-[#D4E4E0] lg:bg-[#E6FFFA]" />
              <span className="text-[9px] lg:text-[10px] font-black tracking-widest uppercase text-gray-500">INITIAL</span>
            </div>
            <div className="flex items-center gap-1.5 lg:gap-2">
              <div className="w-2.5 h-2.5 rounded-full lg:rounded-[3px] bg-[#0A4F48]" />
              <span className="text-[9px] lg:text-[10px] font-black tracking-widest uppercase text-gray-500">CURRENT</span>
            </div>
          </div>
        </div>

        {/* Daily Adherence Streaks (Mobile: order-5, Desktop: order-5 | col-6) */}
        <div className="lg:col-span-6 order-5 lg:order-5 mt-4 lg:mt-0 bg-transparent xl:bg-none">
           <AdherenceStreaks user={user} program={program} />
        </div>

        {/* ROW 4: Footer Cards (Mobile: order-6 hidden, Desktop: order-6 | col-12) */}
        <div className="hidden lg:grid lg:col-span-12 lg:grid-cols-[2fr_1fr] gap-6 order-6 mt-4">
          <div className="bg-[#0A4F48] rounded-[32px] p-10 flex text-white relative overflow-hidden shadow-[0_10px_40px_rgba(10,79,72,0.3)] min-h-[220px]">
            <div className="relative z-10 max-w-lg flex flex-col justify-center">
              <h3 className="font-black text-[24px] tracking-tight mb-4">Expert Analysis</h3>
              <p className="text-[14px] font-medium leading-relaxed text-[#A7F3D0] mb-6 pr-8">
                Based on your weight trend and compliance, we recommend increasing your water intake by 500ml and focusing on the Diet Plan adherence for the next 4 days to hit your weekly target.
              </p>
              <div>
                <button className="bg-white text-[#0A4F48] px-6 py-3 rounded-full text-[12px] font-black tracking-widest uppercase hover:bg-gray-50 transition-colors shadow-sm">
                  Get Detailed Plan
                </button>
              </div>
            </div>
            {/* Visual Decoration / Chart abstract on right */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-linear-to-l from-[#073D38] to-transparent pointer-events-none" />
            <div className="absolute right-10 bottom-0 opacity-60 w-64 h-64 pointer-events-none border-b border-r border-[#A7F3D0]/20 hidden lg:flex flex-col items-end justify-end pb-8 pr-8">
               <div className="w-full h-px bg-linear-to-r from-transparent to-[#A7F3D0]/20 mb-8" />
               <div className="w-3/4 h-px bg-linear-to-r from-transparent to-[#A7F3D0]/20 mb-8" />
               <div className="w-1/2 h-px bg-linear-to-r from-transparent to-[#A7F3D0]/20 mb-8" />
               <TrendingDown size={120} className="text-[#A7F3D0]/10 absolute -top-10 -left-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Update Drawer/Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-full lg:w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-[18px] text-[#0A4F48]">
                {panelType === "weight" && "Update Weight"}
                {panelType === "measurement" && "Update Measurements"}
                {panelType === "hold" && "Hold Plan"}
                {panelType === "extend" && "Extend Plan"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {panelType === "weight" && (
                <WeightUpdate onClose={() => setIsOpen(false)} />
              )}
              {panelType === "measurement" && (
                <MeasurementUpdate onClose={() => setIsOpen(false)} />
              )}
              {panelType === "hold" && (
                <HoldPlan onClose={() => setIsOpen(false)} />
              )}
              {panelType === "extend" && (
                <ExtendPlan onClose={() => setIsOpen(false)} />
              )}
            </div>
          </div>
        </div>
      )}
      <MobileBottomNav />
    </div>
  );
}

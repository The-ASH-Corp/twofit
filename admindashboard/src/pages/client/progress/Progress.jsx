import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  Brain,
  Calendar,
  Dumbbell,
  Droplet,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";
import ProgressChart from "../components/ProgressChart";
import WeightUpdate from "./WeightUpdate";
import MeasurementUpdate from "./MeasurementUpdate";
import HoldPlan from "./HoldPlan";
import ExtendPlan from "./ExtendPlan";
import MobileBottomNav from "../components/MobileBottomNav";
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

      const programResponse = await dispatch(
        getProgramById(programId),
      ).unwrap();
      await dispatch(getClient({ id: user?._id })).unwrap();
      const compliance = await dispatch(
        fetchClientComplianceStats(user?._id),
      ).unwrap();

      setComplianceData(compliance);
      setProgram(programResponse.data);
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
    (a, b) => new Date(a?.date) - new Date(b?.date),
  );
  const sortedMeasurementHistory = [
    ...(clientData?.measurementHistory || []),
  ].sort((a, b) => new Date(a?.date) - new Date(b?.date));

  const lastWeightUpdateDate =
    sortedWeightHistory[sortedWeightHistory.length - 1]?.date || "";
  const lastMeasurementUpdateDate =
    sortedMeasurementHistory[sortedMeasurementHistory.length - 1]?.date || "";

  const shouldShowWeightUpdateButton = () => {
    if (!lastWeightUpdateDate) return true;
    const daysSinceLastUpdate =
      (new Date() - new Date(lastWeightUpdateDate)) / (1000 * 60 * 60 * 24);
    return daysSinceLastUpdate >= 7;
  };

  const shouldShowMeasurementUpdateButton = () => {
    if (!lastMeasurementUpdateDate) return true;
    const daysSinceLastUpdate =
      (new Date() - new Date(lastMeasurementUpdateDate)) /
      (1000 * 60 * 60 * 24);
    return daysSinceLastUpdate >= 7;
  };

  const startWeight = Number(sortedWeightHistory[0]?.weight) || 0;
  const currentWeight = Number(clientData?.currentWeight) || 0;
  const weightChange = currentWeight - startWeight;

  const startMeasurements = sortedMeasurementHistory[0] || {
    chest: 0,
    waist: 0,
    hip: 0,
  };
  const currentMeasurements = sortedMeasurementHistory[
    sortedMeasurementHistory.length - 1
  ] || {
    chest: 0,
    waist: 0,
    hip: 0,
  };

  const currentDay = Number(clientData?.currentGlobalDay) || 1;
  const totalDuration =
    parseInt(program?.plan?.duration, 10) ||
    Number(program?.plan?.duration) ||
    0;
  const programProgressPercent = clampPercent(
    totalDuration > 0 ? (currentDay / totalDuration) * 100 : 0,
  );

  const overallCompliance = clampPercent(complianceData?.overall);
  const activeStreak = Number(complianceData?.streaks?.activeStreak) || 0;

  const complianceStatusText =
    overallCompliance >= 70 ? "On Target" : "Below Target";
  const complianceStatusClass =
    overallCompliance >= 70 ? "text-[#0A7B4E]" : "text-[#D14B3A]";

  const formattedWeightDelta = `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)}kg`;

  const measurementRows = useMemo(
    () => [
      {
        label: "Chest",
        current: Number(currentMeasurements?.chest) || 0,
        start: Number(startMeasurements?.chest) || 0,
      },
      {
        label: "Waist",
        current: Number(currentMeasurements?.waist) || 0,
        start: Number(startMeasurements?.waist) || 0,
      },
      {
        label: "Hips",
        current: Number(currentMeasurements?.hip) || 0,
        start: Number(startMeasurements?.hip) || 0,
      },
    ],
    [
      currentMeasurements?.chest,
      currentMeasurements?.waist,
      currentMeasurements?.hip,
      startMeasurements?.chest,
      startMeasurements?.waist,
      startMeasurements?.hip,
    ],
  );

  const complianceBreakdown = [
    {
      title: "Workout",
      percentage: clampPercent(complianceData?.workout),
      icon: Dumbbell,
    },
    {
      title: "Diet",
      percentage: clampPercent(complianceData?.diet),
      icon: Droplet,
    },
    {
      title: "Therapy",
      percentage: clampPercent(complianceData?.therapy),
      icon: Brain,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  }

  return (
    <div className="client-page-container">
      <div className="client-page-shell">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <section className="client-card rounded-[22px] p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7B8C84]">
                Program Days
              </p>
              <Calendar size={16} className="text-[#0A7B4E]" />
            </div>
            <p className="mt-2 text-[34px] leading-none font-black text-[#1F2F29] sm:text-[38px]">
              {currentDay}
              <span className="text-[22px] text-[#A2AFA9] sm:text-[24px]">
                {" "}
                / {totalDuration || 0}
              </span>
            </p>
            <div className="mt-5 h-1.5 rounded-full bg-[#DBE6DF]">
              <div
                className="h-full rounded-full bg-[#0A7B4E]"
                style={{ width: `${programProgressPercent}%` }}
              />
            </div>
          </section>

          <section className="client-card rounded-[22px] p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7B8C84]">
                Weight Progress
              </p>
              <TrendingDown size={16} className="text-[#0A7B4E]" />
            </div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-[34px] leading-none font-black text-[#1F2F29] sm:text-[38px]">
                {currentWeight.toFixed(1)}
                <span className="text-[22px] text-[#6F7E77] sm:text-[24px]">
                  {" "}
                  kg
                </span>
              </p>
              <span className="text-[20px] font-black text-[#0A7B4E] sm:text-[22px]">
                {formattedWeightDelta}
              </span>
            </div>
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#99A7A1]">
              Last 7 Days
            </p>
          </section>

          <section className="client-card rounded-[22px] p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7B8C84]">
                Compliance
              </p>
              <BadgeCheck size={16} className="text-[#0A7B4E]" />
            </div>
            <p className="mt-2 text-[34px] leading-none font-black text-[#1F2F29] sm:text-[38px]">
              {overallCompliance}
              <span className="text-[22px] text-[#6F7E77] sm:text-[24px]">
                {" "}
                %
              </span>
            </p>
            <p
              className={`mt-3 text-[13px] font-black ${complianceStatusClass}`}
            >
              {complianceStatusText}
            </p>
          </section>

          <section className="client-card rounded-[22px] p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#7B8C84]">
                Active Streak
              </p>
              <Zap size={16} className="text-[#0A7B4E]" />
            </div>
            <p className="mt-2 text-[34px] leading-none font-black text-[#1F2F29] sm:text-[38px]">
              {activeStreak}
              <span className="text-[22px] text-[#6F7E77] sm:text-[24px]">
                {" "}
                Days
              </span>
            </p>
            <p className="mt-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#99A7A1]">
              Keep Going!
            </p>
          </section>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.9fr_1fr]">
          <div className="space-y-6">
            <section className="client-card rounded-[24px] p-5 sm:p-6 lg:p-7">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[30px] leading-none font-black text-[#1F2F29] sm:text-[34px]">
                  Weight Progress
                </h3>

                <div className="flex items-center gap-2">
                  {shouldShowWeightUpdateButton() && (
                    <button
                      onClick={() => {
                        setIsOpen(true);
                        setPanelType("weight");
                      }}
                      className="rounded-full border border-[#D6E2DC] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#0A7B4E]"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <ProgressChart />
              </div>
            </section>

            <section className="client-card rounded-[24px] p-5 sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-[720px]">
                  <h3 className="text-[30px] leading-none font-black text-[#1F2F29] sm:text-[32px]">
                    Expert Analysis
                  </h3>
                  <p className="mt-4 text-[17px] font-medium leading-relaxed text-[#6D7C75]">
                    Our nutrition team has analyzed your first{" "}
                    {Math.min(currentDay, 7)} days. Your consistency is
                    improving, and hydration plus workout completion will push
                    your next milestone faster.
                  </p>
                  <button
                    type="button"
                    className="mt-5 rounded-full bg-[#087B44] px-6 py-2.5 text-[14px] font-black text-white shadow-[0_10px_20px_rgba(8,123,68,0.25)]"
                  >
                    View Full Report
                  </button>
                </div>

                <div className="hidden rounded-[16px] bg-[#E8F1EC] p-4 text-[#BFD3C8] md:block">
                  <Activity size={34} />
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="client-card rounded-[24px] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[28px] leading-none font-black text-[#1F2F29] sm:text-[30px]">
                  Measurements
                </h3>
                {shouldShowMeasurementUpdateButton() && (
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setPanelType("measurement");
                    }}
                    className="rounded-full border border-[#D6E2DC] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#0A7B4E]"
                  >
                    Update
                  </button>
                )}
              </div>

              <div className="mt-5 space-y-5">
                {measurementRows.map((item) => {
                  const maxVal = Math.max(item.current, item.start, 1);
                  const currentPercent = (item.current / maxVal) * 100;
                  const diff = item.current - item.start;
                  const diffDisplay = `${diff > 0 ? "+" : ""}${diff.toFixed(1)}cm`;

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[14px] font-black text-[#2A3A33]">
                          {item.label}
                        </p>
                        <p className="text-[14px] font-black text-[#6A7B73]">
                          {item.current.toFixed(1)} cm
                          <span className="ml-2 text-[#0A7B4E]">
                            {diffDisplay}
                          </span>
                        </p>
                      </div>
                      <div className="h-3 rounded-full bg-[#DEE8E2]">
                        <div
                          className="h-full rounded-full bg-[#0A7B4E] transition-all duration-700"
                          style={{ width: `${Math.max(currentPercent, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="client-card rounded-[24px] p-5 sm:p-6">
              <h3 className="text-[28px] leading-none font-black text-[#1F2F29] sm:text-[30px]">
                Compliance
              </h3>

              <div className="mt-5 flex items-center justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    <path
                      className="text-[#DCE7E1]"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#0A7B4E]"
                      strokeWidth="4"
                      strokeDasharray={`${overallCompliance}, 100`}
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[32px] leading-none font-black text-[#1F2F29]">
                      {overallCompliance}%
                    </span>
                    <span className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#8EA098]">
                      Overall
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {complianceBreakdown.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-center justify-between rounded-[20px] border border-[#DEE7E2] bg-[#EFF3F1] px-4 py-3 shadow-[inset_1px_1px_0_rgba(255,255,255,0.88),inset_-1px_-1px_0_rgba(181,196,187,0.26),0_6px_10px_rgba(157,172,164,0.12)]"
                    >
                      <span className="inline-flex items-center gap-2.5 text-[16px] font-black text-[#2F3E38]">
                        <Icon size={18} className="text-[#0A7B4E]" />
                        {item.title}
                      </span>
                      <span className="rounded-full border border-[#E7EEEA] bg-[#FBFDFC] px-4 py-1.5 text-[12px] font-black text-[#34423C] shadow-[0_3px_6px_rgba(154,169,160,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]">
                        {item.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative flex h-full w-full flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300 lg:w-[400px]">
            <div className="flex items-center justify-between border-b border-gray-100 p-6 pb-4">
              <h2 className="text-[18px] font-bold text-[#0A4F48]">
                {panelType === "weight" && "Update Weight"}
                {panelType === "measurement" && "Update Measurements"}
                {panelType === "hold" && "Hold Plan"}
                {panelType === "extend" && "Extend Plan"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6 text-gray-400" />
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

import React, { useEffect, useState, useMemo } from "react";
import { SyncLoader } from "react-spinners";

import {
  Users,
  UserRoundPen,
  UserStar,
  BicepsFlexed,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { founderDashboardData } from "@/redux/features/founder/founder.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectFounderDashBoard,
  selectFounderStatus,
} from "@/redux/features/founder/founder.selector";
import useRecentNotifications from "@/hooks/useRecentNotifications";
import RecentNotificationsCard from "@/components/notifications/FounderRecentNotificationsCard";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { notifications, loading: notificationsLoading } =
    useRecentNotifications(4);

  useEffect(() => {
    dispatch(founderDashboardData());
  }, [dispatch]);

  const data = useAppSelector(selectFounderDashBoard);
  const status = useAppSelector(selectFounderStatus);

  const [founder, setFounder] = useState();
  const [growthDuration, setGrowthDuration] = useState(6);
  const [complianceDuration, setComplianceDuration] = useState(12);
  const [adminPerformanceDuration, setAdminPerformanceDuration] = useState(12);
  const [expertPerformanceDuration, setExpertPerformanceDuration] =
    useState(12);
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    dispatch(
      founderDashboardData({
        adminDuration: `${adminPerformanceDuration}m`,
        expertDuration: `${expertPerformanceDuration}m`,
      }),
    );
  }, [dispatch, adminPerformanceDuration, expertPerformanceDuration]);

  useEffect(() => {
    setFounder(data);
  }, [data]);

  const getSlicedData = (array, duration) => {
    if (!array || !Array.isArray(array)) return [];
    const start = Math.max(0, array.length - duration);
    return array.slice(start);
  };

  const toggleDuration = (current, setter) => {
    if (current === 3) setter(6);
    else if (current === 6) setter(12);
    else setter(3);
  };

  const getDatasetByLabel = (datasets, label) => {
    const ds = datasets?.find(
      (d) => d.label?.toLowerCase() === label.toLowerCase(),
    );
    return ds?.data || [];
  };
  const growthDataRaw = founder?.data?.graphData?.growth;
  const complianceDataRaw = founder?.data?.graphData?.compliance;

  const growthData = {
    labels: getSlicedData(growthDataRaw?.labels, growthDuration),
    datasets: [
      {
        label: "Active",
        data: getSlicedData(
          getDatasetByLabel(growthDataRaw?.datasets, "Active"),
          growthDuration,
        ),
        backgroundColor: "#F4DBC7",
        hoverBackgroundColor: "#F7E6D7",
        borderRadius: 8,
        barThickness: 14,
      },
      {
        label: "Inactive",
        data: getSlicedData(
          getDatasetByLabel(growthDataRaw?.datasets, "Inactive"),
          growthDuration,
        ),
        backgroundColor: "#EBF3F2",
        hoverBackgroundColor: "#F0F6F5",
        borderRadius: 8,
        barThickness: 14,
      },
      {
        label: "New",
        data: getSlicedData(
          getDatasetByLabel(growthDataRaw?.datasets, "New"),
          growthDuration,
        ),
        backgroundColor: "#0A4F48",
        hoverBackgroundColor: "#0D6159",
        borderRadius: 8,
        barThickness: 14,
      },
    ],
  };

  const complianceData = {
    labels: getSlicedData(complianceDataRaw?.labels, complianceDuration),
    datasets: ["Workout", "Therapy", "Diet"].map((label) => {
      const dataset = (complianceDataRaw?.datasets || []).find(
        (ds) => ds.label === label,
      ) || {
        data: [],
      };
      const color =
        label === "Workout"
          ? "#F4DBC7"
          : label === "Therapy"
            ? "#0A4F48"
            : "#EBF3F2";
      return {
        ...dataset,
        label,
        data: getSlicedData(dataset.data || [], complianceDuration).map(
          (v) => v / 3,
        ),
        backgroundColor: color,
        borderRadius: 12,
        borderSkipped: false,
        barThickness: 32,
        maxBarThickness: 32,
        borderWidth: 3,
        borderColor: "#FFFFFF",
        hoverBorderWidth: 0,
      };
    }),
  };
  const expertPerformanceData = useMemo(() => {
    const perf = founder?.data?.expertPerformance || {
      taskCompletion: 0,
      rating: 0,
      // clientsAssigned: 0,
    };
    return {
      labels: ["Task Completion", "Rating", "Clients Assigned"],
      datasets: [
        {
          data: [
            perf.taskCompletion,
            (perf.rating / 5) * 100,
            // perf.clientsAssigned,
          ],
          backgroundColor: ["#0A4F48", "#EBF3F2", "#F4DBC7"],
          borderWidth: 0,
          cutout: "75%",
          hoverOffset: 1,
          spacing: 3,
          borderRadius: 8,
        },
      ],
      raw: {
        taskCompletion: perf.taskCompletion,
        rating: perf.rating,
        // clientsAssigned: perf.clientsAssigned,
      },
      isZero:
        perf.taskCompletion === 0 &&
        perf.rating === 0 &&
        perf.clientsAssigned === 0,
    };
  }, [founder]);

  const subAdminPerformanceData = useMemo(() => {
    const perf = founder?.data?.adminPerformance || {
      programs: 0,
      experts: 0,
      clients: 0,
    };
    const total =
      (perf.programs || 0) + (perf.experts || 0) + (perf.clients || 0);
    const toPct = (val) => (total > 0 ? Math.round((val / total) * 100) : 0);

    return {
      labels: ["Programs", "Experts", "Clients"],
      datasets: [
        {
          data: [
            toPct(perf.programs),
            toPct(perf.experts),
            toPct(perf.clients),
          ],
          backgroundColor: ["#0A4F48", "#EBF3F2", "#F4DBC7"],
          borderWidth: 0,
          cutout: "75%",
          hoverOffset: 1,
          spacing: 3,
          borderRadius: 8,
        },
      ],
      raw: {
        programs: perf.programs,
        experts: perf.experts,
        clients: perf.clients,
      },
      isZero: total === 0,
    };
  }, [founder]);

  const calculateTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
      if (diffInHours === 0) {
        if (diffInMinutes < 5) return "Just now";
        return `${diffInMinutes} mins ago`;
      }
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return `${diffInDays} Days Ago`;
    }
  };

  const progressReportsRaw =
    founder?.data?.latestReports?.map((report) => ({
      ...report,
      time: calculateTimeAgo(report.time),
    })) || [];

  const progressReports =
    filterCategory === "All Categories"
      ? progressReportsRaw
      : progressReportsRaw.filter((report) => report.type === filterCategory);

  const trainers = founder?.data?.Trainers || 0;
  const dietitians = founder?.data?.Dietitians || 0;
  const therapists = founder?.data?.Therapists || 0;
  const hasExperts = trainers > 0 || dietitians > 0 || therapists > 0;
  const expertsSummaryData = {
    labels: hasExperts ? ["Trainers", "Dietitians", "Therapists"] : ["No Data"],
    datasets: [
      {
        data: hasExperts ? [trainers, dietitians, therapists] : [1],
        backgroundColor: hasExperts
          ? ["#0A4F48", "#EBF3F2", "#F4DBC7"]
          : ["#E5E7EB"],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "80%",
        hoverOffset: hasExperts ? 1 : 0,
        spacing: hasExperts ? 3 : 0,
        borderRadius: 6,
      },
    ],
  };

  const growthMaxValue = Math.max(
    0,
    ...growthData.datasets.flatMap((ds) => ds.data || []),
  );
  const growthYAxisMax =
    growthMaxValue === 0
      ? 10
      : growthMaxValue % 10 === 0
        ? growthMaxValue + 10
        : Math.ceil(growthMaxValue / 10) * 10;

  const growthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#000",
        bodyColor: "#666",
        borderColor: "#eee",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#66706D",
        },
      },
      y: {
        beginAtZero: true,
        max: growthYAxisMax,
        ticks: {
          font: {
            size: 11,
          },
          color: "#66706D",
        },
        grid: {
          color: "#f0f0f0",
        },
      },
    },
  };

  const stackedOptions = {
    ...growthOptions,
    layout: { padding: { top: 8 } },
    plugins: {
      ...growthOptions.plugins,
      tooltip: {
        ...growthOptions.plugins.tooltip,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw !== null) {
              label += Math.round(context.raw * 3) + "%";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ...growthOptions.scales.x,
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#94A3B8" },
        categoryPercentage: 0.55,
        barPercentage: 0.8,
      },
      y: {
        ...growthOptions.scales.y,
        stacked: true,
        max: 100,
        ticks: {
          stepSize: 25,
          font: { size: 11 },
          color: "#94A3B8",
          callback: (value) => value + "%",
        },
        grid: { color: "#E9EEF5" },
      },
    },
  };

  const performanceOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            if (label === "Rating") {
              const actualRating = ((value / 100) * 5).toFixed(1);
              return `${label}: ${actualRating}/5`;
            }
            return `${label}: ${Math.round(value)}%`;
          },
        },
      },
    },
  };

  if (status === "loading" && !founder)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );

  return (
    <>
      <BackgroundAnimation />
      <div className="flex flex-col gap-4 md:gap-6 p-3 md:p-5 lg:p-8 bg-transparent min-h-full font-sans max-w-[1600px] mx-auto relative z-10">
        {/* Welcome Header */}
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0A4F48] tracking-tight">
            Overview
          </h1>
          <p className="text-xs md:text-sm text-[#66706D]">
            Track your platform's growth and performance metrics.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            {
              label: "Total Clients",
              value: founder?.data?.totalClient || 0,
              icon: <Users size={20} className="text-white md:w-6 md:h-6" />,
              bg: "bg-linear-to-br from-[#0A4F48] to-[#128a7e] text-white",
              iconBg: "bg-white/20",
              border: "border-transparent",
              textColor: "text-white",
              subTextColor: "text-white/80",
            },
            {
              label: "Heads",
              value: founder?.data?.totalHeads || 0,
              icon: (
                <UserRoundPen
                  size={20}
                  className="text-[#DAA520] md:w-6 md:h-6"
                />
              ),
              bg: "bg-white hover:bg-[#FAF3E0]/30",
              border: "border-[#DAA520]/20",
              iconBg: "bg-[#FAF3E0]",
              textColor: "text-[#0A4F48]",
              subTextColor: "text-[#66706D]",
            },
            {
              label: "Admins",
              value: founder?.data?.totalAdmins || 0,
              icon: (
                <UserStar size={20} className="text-[#0A4F48] md:w-6 md:h-6" />
              ),
              bg: "bg-white hover:bg-[#EBF3F2]/50",
              border: "border-[#0A4F48]/10",
              iconBg: "bg-[#EBF3F2]",
              textColor: "text-[#0A4F48]",
              subTextColor: "text-[#66706D]",
            },
            {
              label: "Total Programs",
              value: founder?.data?.totalPrograms || 0,
              icon: (
                <BicepsFlexed
                  size={20}
                  className="text-[#DAA520] md:w-6 md:h-6"
                />
              ),
              bg: "bg-white hover:bg-[#FAF3E0]/30",
              border: "border-[#DAA520]/20",
              iconBg: "bg-[#FAF3E0]",
              textColor: "text-[#0A4F48]",
              subTextColor: "text-[#66706D]",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} ${card.border ? `border ${card.border}` : ""} p-5 md:p-6 rounded-[20px] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group cursor-default relative overflow-hidden`}
            >
              {/* Subtle pattern for the first card */}
              {i === 0 && (
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              )}

              <div className="flex flex-col gap-1 z-10">
                <span
                  className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${card.subTextColor}`}
                >
                  {card.label}
                </span>
                <span
                  className={`text-2xl md:text-3xl font-black tracking-tight ${card.textColor}`}
                >
                  {card.value}
                </span>
              </div>
              <div
                className={`${card.iconBg} p-3 md:p-3.5 rounded-xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10`}
              >
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 md:gap-6 xl:flex-row flex-col">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-4 md:gap-6 min-w-0">
            {/* Row 2: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <DashboardCard
                title="Client Growth"
                subTitle={`Last ${growthDuration} Months`}
                onToggle={() =>
                  toggleDuration(growthDuration, setGrowthDuration)
                }
              >
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
                  <LegendItem color="#F4DBC7" label="Active" />
                  <LegendItem color="#DBDEDD" label="Inactive" />
                  <LegendItem color="#0A4F48" label="New" />
                </div>
                <div className="h-56 md:h-64 relative">
                  {growthData?.labels?.length > 0 ? (
                    <Bar data={growthData} options={growthOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No data available
                    </div>
                  )}
                </div>
              </DashboardCard>

              <DashboardCard
                title="Client Compliance"
                subTitle={`Last ${complianceDuration} Months`}
                onToggle={() =>
                  toggleDuration(complianceDuration, setComplianceDuration)
                }
              >
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
                  <LegendItem color="#EBF3F2" label="Diet" />
                  <LegendItem color="#F4DBC7" label="Workout" />
                  <LegendItem color="#0A4F48" label="Therapy" />
                </div>
                <div className="h-56 md:h-64">
                  {complianceData?.labels?.length > 0 ? (
                    <Bar data={complianceData} options={stackedOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No data available
                    </div>
                  )}
                </div>
              </DashboardCard>
            </div>

            {/* Row 3: Admin & Expert Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <DashboardCard
                title="Admin Performance"
                subTitle={
                  adminPerformanceDuration === 12
                    ? "Last Year"
                    : `Last ${adminPerformanceDuration} M`
                }
                onToggle={() =>
                  toggleDuration(
                    adminPerformanceDuration,
                    setAdminPerformanceDuration,
                  )
                }
              >
                <div className="h-56 md:h-64 relative flex items-center justify-center py-2">
                  {!subAdminPerformanceData.isZero ? (
                    <Doughnut
                      data={subAdminPerformanceData}
                      options={performanceOptions}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No data available
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-dashed border-gray-100">
                  {[
                    {
                      label: "Programs",
                      val: subAdminPerformanceData.raw.programs,
                      color: "bg-[#0A4F48]",
                    },
                    {
                      label: "Experts",
                      val: subAdminPerformanceData.raw.experts,
                      color: "bg-[#EBF3F2]",
                    },
                    {
                      label: "Clients",
                      val: subAdminPerformanceData.raw.clients,
                      color: "bg-[#F4DBC7]",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 group cursor-default"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.color}`}
                        ></span>
                        <span className="text-[9px] md:text-[10px] uppercase text-[#94A3B8] font-bold">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-base md:text-lg font-bold text-[#0A4F48] group-hover:scale-110 transition-transform">
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard
                title="Expert Performance"
                subTitle={
                  expertPerformanceDuration === 12
                    ? "Last Year"
                    : `Last ${expertPerformanceDuration} M`
                }
                onToggle={() =>
                  toggleDuration(
                    expertPerformanceDuration,
                    setExpertPerformanceDuration,
                  )
                }
              >
                <div className="h-56 md:h-64 relative flex items-center justify-center py-2">
                  {!expertPerformanceData.isZero ? (
                    <Doughnut
                      data={expertPerformanceData}
                      options={performanceOptions}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No data available
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-dashed border-gray-100">
                  {[
                    {
                      label: "Tasks",
                      val: expertPerformanceData?.raw?.taskCompletion
                        ? `${expertPerformanceData.raw.taskCompletion}%`
                        : 0,
                      color: "bg-[#0A4F48]",
                    },
                    {
                      label: "Rating",
                      val: expertPerformanceData?.raw?.rating ?? 0,
                      suffix: "/5",
                      color: "bg-[#EBF3F2]",
                    },
                    // {
                    //   label: "Assigned",
                    //   val: expertPerformanceData?.raw?.clientsAssigned ?? 0,
                    //   color: "bg-[#F4DBC7]",
                    // },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 group cursor-default"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.color}`}
                        ></span>
                        <span className="text-[9px] md:text-[10px] uppercase text-[#94A3B8] font-bold">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-base md:text-lg font-bold text-[#0A4F48] group-hover:scale-110 transition-transform">
                        {item.val}{item.suffix || ""}
                      </span>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>

            {/* Row 4: Latest Progress Reports */}
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] border border-[#EEF2F6] flex flex-col min-h-[400px] overflow-hidden transition-shadow duration-300">
              <div className="p-4 md:p-6 lg:p-8 flex items-center justify-between border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-1 h-4 md:h-5 bg-[#DAA520] rounded-full"></div>
                  <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
                    Latest Progress Reports
                  </h3>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 px-2.5 py-1.5 md:px-3 bg-white hover:bg-gray-50 border border-[#E2E8F0] rounded-lg text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase tracking-wider transition-all shadow-sm"
                  >
                    <span className="hidden sm:inline">{filterCategory}</span>
                    <span className="sm:hidden">
                      {filterCategory === "All Categories"
                        ? "All"
                        : filterCategory}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${showFilter ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showFilter && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#F1F5F9] rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                      {["All Categories", "Diet", "Workout", "Therapy"].map(
                        (cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setFilterCategory(cat);
                              setShowFilter(false);
                            }}
                            className={`w-full text-left px-5 py-2.5 text-xs font-semibold transition-colors ${filterCategory === cat ? "bg-[#F0FDF4] text-[#0A4F48]" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
                          >
                            {cat}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[10px] md:text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold border-b border-[#F1F5F9]">
                      <th className="px-4 py-3 md:px-6 md:py-4 md:pl-8">
                        Client
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4">Type</th>
                      <th className="px-4 py-3 md:px-6 md:py-4">Expert</th>
                      <th className="px-4 py-3 md:px-6 md:py-4">
                        Submitted By
                      </th>
                      <th className="px-4 py-3 md:px-6 md:py-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {progressReports.length > 0 ? (
                      progressReports.map((report, i) => (
                        <tr
                          key={i}
                          className="hover:bg-[#F8FAFC]/50 transition-colors group cursor-default"
                        >
                          <td className="px-4 py-3 md:px-6 md:py-4 md:pl-8 text-[12px] md:text-[13px] font-bold text-[#1E293B] group-hover:text-[#0A4F48] transition-colors">
                            {report.name}
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 text-[12px] md:text-[13px] text-[#475569] font-medium">
                            {report.type}
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 text-sm">
                            <span
                              className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[9px] md:text-[10px] font-bold border ${
                                report.expert === "Dietitian"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : report.expert === "Trainer"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-100"
                              }`}
                            >
                              {report.expert}
                            </span>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 text-[12px] md:text-[13px] text-[#475569]">
                            {report.submittedBy}
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-[12px] text-[#94A3B8] font-medium group-hover:text-[#64748B]">
                            {report.time}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-12 text-center text-sm text-[#94A3B8] italic"
                        >
                          No progress reports found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:w-80 flex flex-col gap-4 md:gap-6 shrink-0">
            {/* Experts Gauge Card */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#EEF2F6] flex flex-col group hover:border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
                  Experts Overview
                </h3>
                <MoreHorizontal
                  size={20}
                  className="text-[#94A3B8] group-hover:text-[#0A4F48] transition-colors cursor-pointer"
                />
              </div>
              <div className="h-40 md:h-48 relative flex items-center justify-center my-2 md:my-4">
                <Doughnut
                  data={expertsSummaryData}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    cutout: "85%",
                  }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10%] flex flex-col items-center">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-wide text-[#94A3B8] font-bold">
                    Total
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-[#1E293B] tracking-tighter">
                    {founder?.data?.totalExperts || 0}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                {[
                  {
                    label: "Trainers",
                    count: founder?.data?.Trainers || 0,
                    color: "bg-[#0A4F48]",
                  },
                  {
                    label: "Dietitians",
                    count: founder?.data?.Dietitians || 0,
                    color: "bg-[#EBF3F2]",
                  },
                  {
                    label: "Therapists",
                    count: founder?.data?.Therapists || 0,
                    color: "bg-[#FFD7A8]",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 md:p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-default group/item"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${item.color} shadow-sm ring-1 ring-white`}
                      ></div>
                      <span className="text-[11px] md:text-[12px] text-[#64748B] font-bold uppercase tracking-wide group-hover/item:text-[#334155] transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[13px] md:text-[14px] font-bold text-[#1E293B]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <RecentNotificationsCard
              notifications={notifications}
              loading={notificationsLoading}
              className="min-h-0"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const DashboardCard = ({ title, subTitle, children, onToggle }) => (
  <div className="bg-white p-5 md:p-6 rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#Eef2f6] flex flex-col group h-full hover:border-[#E2E8F0]">
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-1 h-4 md:h-5 bg-[#DAA520] rounded-full group-hover:h-6 md:group-hover:h-8 group-hover:bg-[#0A4F48] transition-all duration-500 ease-out"></div>
        <div>
          <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
            {title}
          </h3>
          {/* Optional tiny line or dot if needed */}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#0A4F48] border border-[#F1F5F9] rounded-lg text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase tracking-wider transition-all duration-300"
      >
        {subTitle} <ChevronDown size={14} />
      </button>
    </div>
    {children}
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shadow-sm ring-1 ring-white"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-[11px] md:text-xs text-[#66706D] font-medium">{label}</span>
  </div>
);

export default Dashboard;

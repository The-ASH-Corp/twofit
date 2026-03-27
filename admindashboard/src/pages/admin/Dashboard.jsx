import React, { useEffect, useState } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  GraduationCap,
  BookOpen,
  UserCircle,
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
import { getDashboardData } from "@/redux/features/admins/admin.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import useRecentNotifications from "@/hooks/useRecentNotifications";
import RecentNotificationsCard from "@/components/notifications/RecentNotificationsCard";
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
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [growthDuration, setGrowthDuration] = useState(6);
  const [complianceDuration, setComplianceDuration] = useState(12);
  const [reportCategory, setReportCategory] = useState("All Categories");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const { notifications, loading: notificationsLoading } =
    useRecentNotifications(4);

  const getDashboardDatas = async () => {
    const data = await dispatch(
      getDashboardData({ adminId: user?._id, duration: "12m" }),
    );
    setDashboardData(data.payload);
  };

  useEffect(() => {
    getDashboardDatas();
  }, [user?._id]); // Add dependency

  const getSlicedData = (array, duration) => {
    if (!array || !Array.isArray(array)) return [];
    const start = Math.max(0, array.length - duration);
    return array.slice(start);
  };

  // Helper to toggle duration
  const toggleDuration = (current, setter) => {
    if (current === 3) setter(6);
    else if (current === 6) setter(12);
    else setter(3);
  };

  // Helper to safely get dataset by label
  const getDatasetByLabel = (datasets, label) => {
    const ds = datasets?.find(
      (d) => d.label?.toLowerCase() === label.toLowerCase(),
    );
    return ds?.data || [];
  };

  const hasGraphData = (data) => {
    return (
      data &&
      data.labels &&
      data.labels.length > 0 &&
      data.datasets?.some((ds) => ds.data?.some((val) => val > 0))
    );
  };

  // --- Expert Performance Data Calculation ---
  // const totalPrograms = dashboardData?.totalPrograms || 0;
  // const totalExp = dashboardData?.totalExperts || 0;
  // const totalCli = dashboardData?.totalClients || 0;

  // const totalEntities = totalPrograms + totalExp + totalCli; // Total for percentage calculation

  // const getPercent = (val) => {
  //   if (totalEntities === 0) return 0;
  //   return Math.round((val / totalEntities) * 100);
  // };

  // const progPct = getPercent(totalPrograms);
  // const expPct = getPercent(totalExp);
  // const cliPct = getPercent(totalCli);

  // const hasPerformanceData = totalEntities > 0;
  // const performanceData = {
  //   labels: hasPerformanceData
  //     ? ["Programs", "Experts", "Clients"]
  //     : ["No Data"],
  //   datasets: [
  //     {
  //       data: hasPerformanceData ? [totalPrograms, totalExp, totalCli] : [1],
  //       backgroundColor: hasPerformanceData
  //         ? ["#0A4F48", "#E6EFEE", "#FFD7A8"]
  //         : ["#E5E7EB"],
  //       borderWidth: 0,
  //       rotation: 270,
  //       cutout: "80%",
  //       hoverOffset: hasPerformanceData ? 15 : 0,
  //       spacing: hasPerformanceData ? 1 : 0,
  //       borderRadius: 8,
  //     },
  //   ],
  // };

  const complianceData = {
    labels: getSlicedData(
      dashboardData?.graphData?.compliance?.labels,
      complianceDuration,
    ),
    datasets: [
      {
        label: "Workout",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.compliance?.datasets,
            "Workout",
          ),
          complianceDuration,
        ).map((v) => v / 3),
        backgroundColor: "#F4DBC7",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
        maxBarThickness: 30,
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
      {
        label: "Therapy",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.compliance?.datasets,
            "Therapy",
          ),
          complianceDuration,
        ).map((v) => v / 3),
        backgroundColor: "#0A4F48",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
        maxBarThickness: 30,
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
      {
        label: "Diet",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.compliance?.datasets,
            "Diet",
          ),
          complianceDuration,
        ).map((v) => v / 3),
        backgroundColor: "#EBF3F2",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 30,
        maxBarThickness: 30,
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
     
      
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#0A4F48",
        titleFont: { size: 14, weight: "bold" },
        bodyColor: "#66706D",
        bodyFont: { size: 12 },
        borderColor: "rgba(0,0,0,0.05)",
        borderWidth: 1,
        padding: 12,
        boxPadding: 8,
        usePointStyle: true,
        cornerRadius: 12,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + "%";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#66706D" },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          font: { size: 11 },
          color: "#66706D",
          callback: (value) => value + "%",
        },
        grid: { color: "#F0F0F0", drawBorder: false },
      },
    },
  };
  const growthData = {
    labels: getSlicedData(
      dashboardData?.graphData?.growth?.labels,
      growthDuration,
    ),
    datasets: [
      {
        label: "Active",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.growth?.datasets,
            "Active",
          ),
          growthDuration,
        ),
        backgroundColor: "#F4DBC7",
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: "Inactive",
        data: getSlicedData(
          getDatasetByLabel(
            dashboardData?.graphData?.growth?.datasets,
            "Inactive",
          ),
          growthDuration,
        ),
        backgroundColor: "#EBF3F2",
        borderRadius: 4,
        barThickness: 16,
      },
      {
        label: "New",
        data: getSlicedData(
          getDatasetByLabel(dashboardData?.graphData?.growth?.datasets, "New"),
          growthDuration,
        ),
        backgroundColor: "#0A4F48",
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };
  const trainers = dashboardData?.totalTrainers || 0;
  const dietitians = dashboardData?.totalDietitians || 0;
  const therapists = dashboardData?.totalTherapists || 0;
  const hasExperts = trainers > 0 || dietitians > 0 || therapists > 0;

  const expertsSummaryData = {
    labels: hasExperts ? ["Trainers", "Dietitians", "Therapists"] : ["No Data"],
    datasets: [
      {
        data: hasExperts ? [trainers, dietitians, therapists] : [1],
        backgroundColor: hasExperts
          ? ["#0A4F48", "#EBF3F2", "#FAF3E0"]
          : ["#E5E7EB"],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "80%",
        hoverOffset: hasExperts ? 15 : 0,
        spacing: hasExperts ? 1 : 0,
        borderRadius: 8,
      },
    ],
  };
  const stackedOptions = {
    ...chartOptions,
    layout: { padding: { top: 8 } },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
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
        ...chartOptions.scales.x,
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#94A3B8" },
        categoryPercentage: 0.55,
        barPercentage: 0.8,
      },
      y: {
        ...chartOptions.scales.y,
        stacked: true,
        ticks: {
          stepSize: 25,
          font: { size: 11 },
          color: "#94A3B8",
          callback: (value) => value + "%",
        },
        grid: { color: "#E9EEF5", drawBorder: false },
      },
    },
  };

  const formatReportTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const diffDays = Math.floor(
      (startOfToday - startOfDate) / (1000 * 60 * 60 * 24),
    );
    const timeString = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    if (diffDays === 0) return `Today, ${timeString}`;
    if (diffDays === 1) return `Yesterday, ${timeString}`;
    if (diffDays > 1) return `${diffDays} Days Ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const progressReports = (dashboardData?.latestReports || [])
    .slice(0, 10)
    .map((report) => ({
      ...report,
      time: formatReportTime(report.createdAt),
    }));

  const filteredProgressReports =
    reportCategory === "All Categories"
      ? progressReports
      : progressReports.filter((report) => report.expert === reportCategory);

  const topMetricCards = [
    {
      label: "Clients",
      value: dashboardData?.totalClients || 0,
      icon: <GraduationCap size={20} className="text-white md:w-6 md:h-6" />,
      bg: "bg-linear-to-br from-[#0A4F48] to-[#128a7e] text-white",
      iconBg: "bg-white/20",
      border: "border-transparent",
      textColor: "text-white",
      subTextColor: "text-white/80",
    },
    {
      label: "Total Programs",
      value: dashboardData?.totalPrograms || 0,
      icon: <BookOpen size={20} className="text-[#DAA520] md:w-6 md:h-6" />,
      bg: "bg-white hover:bg-[#FAF3E0]/30",
      iconBg: "bg-[#FAF3E0]",
      border: "border-[#DAA520]/20",
      textColor: "text-[#0A4F48]",
      subTextColor: "text-[#66706D]",
    },
    {
      label: "Experts",
      value: dashboardData?.totalExperts || 0,
      icon: <UserCircle size={20} className="text-[#0A4F48] md:w-6 md:h-6" />,
      bg: "bg-white hover:bg-[#EBF3F2]/50",
      iconBg: "bg-[#EBF3F2]",
      border: "border-[#0A4F48]/10",
      textColor: "text-[#0A4F48]",
      subTextColor: "text-[#66706D]",
    },
  ];

  return (
    <>
      <BackgroundAnimation />
      <div className="flex flex-col gap-4 md:gap-6 p-3 md:p-5 lg:p-8 bg-transparent min-h-full max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col gap-1 mb-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0A4F48] tracking-tight">
            Overview
          </h1>
          <p className="text-xs md:text-sm text-[#66706D]">
            Track your clients, experts, and key dashboard performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {topMetricCards.map((card, i) => (
            <div
              key={card.label}
              className={`${card.bg} ${card.border ? `border ${card.border}` : ""} p-5 md:p-6 rounded-[20px] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group cursor-default relative overflow-hidden`}
            >
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
          {/* Row 2: Sub Admin & Expert Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="Client Growth"
              subTitle={`Last ${growthDuration} Months`}
              onToggle={() => toggleDuration(growthDuration, setGrowthDuration)}
            >
              <div className="flex gap-4 mb-4">
                <LegendItem color="#F4DBC7" label="Active" />
                <LegendItem color="#EBF3F2" label="Inactive" />
                <LegendItem color="#0A4F48" label="New" />
              </div>
              <div className="h-64 relative">
                {hasGraphData(growthData) ? (
                  <Bar data={growthData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <span className="text-sm text-gray-400">
                      No data for this period
                    </span>
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
              <div className="flex gap-4 mb-4">
                <LegendItem color="#EBF3F2" label="Diet" />
                <LegendItem color="#F4DBC7" label="Workout" />
                <LegendItem color="#0A4F48" label="Therapy" />
              </div>
              <div className="h-64 relative">
                {hasGraphData(complianceData) ? (
                  <Bar data={complianceData} options={stackedOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <span className="text-sm text-gray-400">
                      No data for this period
                    </span>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>

          {/* Row 4: Latest Progress Reports */}
          <div className="bg-white rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] border border-[#EEF2F6] flex flex-col min-h-[400px] overflow-hidden transition-shadow duration-300">
            <div className="p-4 md:p-6 lg:p-8 flex items-center justify-between border-b border-[#F1F5F9]">
              <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
                Latest Progress Reports
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowCategoryMenu((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[10px] font-bold text-[#64748B] uppercase tracking-wider"
                >
                  {reportCategory} <ChevronDown size={14} />
                </button>
                {showCategoryMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-[#F1F5F9] rounded-xl shadow-xl z-10 overflow-hidden py-1">
                    {[
                      "All Categories",
                      "Trainer",
                      "Dietitian",
                      "Therapist",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setReportCategory(option);
                          setShowCategoryMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-[#F8FAFC] ${
                          reportCategory === option
                            ? "text-[#0A4F48] bg-[#F0FDF4]"
                            : "text-[#64748B]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="bg-[#F8FAFC] text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold border-b border-[#F1F5F9]">
                    <th className="px-4 py-3 md:px-6 md:py-4 md:pl-8">Client Name</th>
                    <th className="px-4 py-3 md:px-6 md:py-4">Task Type</th>
                    <th className="px-4 py-3 md:px-6 md:py-4">Expert</th>
                    <th className="px-4 py-3 md:px-6 md:py-4">Submitted By</th>
                    <th className="px-4 py-3 md:px-6 md:py-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredProgressReports.length > 0 ? (
                    filteredProgressReports.map((report, i) => (
                      <tr
                        key={i}
                        className="hover:bg-[#F8FAFC]/50 transition-colors"
                      >
                        <td className="px-4 py-3 md:px-6 md:py-4 md:pl-8 text-[12px] md:text-[13px] font-bold text-[#1E293B]">
                          {report.name}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-[12px] md:text-[13px] text-[#475569]">
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
                        <td className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-[12px] text-[#94A3B8] font-medium">
                          {report.time}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-sm text-[#94A3B8] italic"
                      >
                        No progress reports found matching your criteria
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
          {/* Experts Gauge Card at the top of Sidebar */}
          <div className="bg-white p-5 md:p-6 rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#EEF2F6] flex flex-col h-[400px] group hover:border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">Experts Overview</h3>
              <MoreHorizontal size={20} className="text-[#94A3B8] group-hover:text-[#0A4F48] transition-colors" />
            </div>
            <div className="flex-1 relative flex items-center justify-center -mt-12">
              <div className="w-full h-48">
                <Doughnut
                  data={expertsSummaryData}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    cutout: "80%",
                  }}
                />
              </div>
              <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-wide text-[#94A3B8] font-bold">
                  Total
                </span>
                <span className="text-3xl md:text-4xl font-black text-[#1E293B] tracking-tighter">
                  {dashboardData?.totalExperts || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              {[
                {
                  label: "Trainers",
                  count: dashboardData?.totalTrainers || 0,
                  color: "bg-[#0A4F48]",
                },
                {
                  label: "Dietitians",
                  count: dashboardData?.totalDietitians || 0,
                  color: "bg-[#EBF3F2]",
                },
                {
                  label: "Therapists",
                  count: dashboardData?.totalTherapists || 0,
                  color: "bg-[#FAF3E0]",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 md:p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${item.color} shadow-sm ring-1 ring-white`}
                    ></div>
                    <span className="text-[11px] md:text-[12px] text-[#64748B] font-bold uppercase tracking-wide">
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
          {/* this graph is un-nessessory the details are already showing the KPI card */}
          {/* <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-[#0A4F48] mb-6">
              Expert Performance
            </h3>
            <div className="h-44 mb-6">
              <Doughnut
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
            <div className="space-y-4">
              <PerformanceRow
                color="bg-[#0A4F48]"
                label="Programs"
                value={`${progPct}%`}
              />
              <PerformanceRow
                color="bg-[#E6EFEE]"
                label="Experts"
                value={`${expPct}%`}
              />
              <PerformanceRow
                color="bg-[#FFD7A8]"
                label="Clients"
                value={`${cliPct}%`}
              />
            </div>
          </div> */}
          {/* Recent Notifications */}
          <RecentNotificationsCard
            notifications={notifications}
            loading={notificationsLoading}
          />
        </div>
      </div>
      </div>
    </>
  );
}

const DashboardCard = ({ title, subTitle, onToggle, children }) => (
  <div className="bg-white p-5 md:p-6 rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#EEF2F6] flex flex-col group h-full hover:border-[#E2E8F0]">
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-1 h-4 md:h-5 bg-[#DAA520] rounded-full group-hover:h-6 md:group-hover:h-8 group-hover:bg-[#0A4F48] transition-all duration-500 ease-out"></div>
        <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
          {title}
        </h3>
      </div>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#0A4F48] border border-[#F1F5F9] rounded-lg text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase tracking-wider transition-all duration-300"
      >
        {subTitle} <ChevronDown size={14} />
      </button>
    </div>
    {children}
  </div>
);

const LegendItem = ({ color, label, value }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-[12px] md:text-[13px] text-[#64748B] font-semibold whitespace-nowrap uppercase tracking-wide">
      {label} <strong className="text-[#0A4F48]">{value}</strong>
    </span>
  </div>
);

const PerformanceRow = ({ color, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-sm ${color}`}></div>
      <span className="text-xs font-medium text-[#66706D]">{label}</span>
    </div>
    <span className="text-xs font-bold text-[#0A4F48]">{value}</span>
  </div>
);

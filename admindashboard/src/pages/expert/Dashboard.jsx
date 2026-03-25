import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  UserRoundPen,
  UserStar,
  BicepsFlexed,
  MoreHorizontal,
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ReviewDrawer from "./components/ReviewDrawer";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import {
  getClientComplianceGraphData,
  getCoachDashboardStats,
  getCoachRatingGraph,
} from "@/redux/features/coach/coach.thunk";
import { getPendingSubmissions } from "@/redux/features/tasks/task.thunk";
import { socket } from "@/utils/socket";
import { selectToken } from "@/redux/features/auth/auth.selectores";
import HabitProgress from "./components/HabitProgress";
import RecentNotificationsCard from "@/components/notifications/RecentNotificationsCard";
import useRecentNotifications from "@/hooks/useRecentNotifications";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function Dashboard() {
  const [selectedReview, setSelectedReview] = useState(null);
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const { pendingTasks } = useAppSelector((state) => state.tasks);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [clientComplianceGraphData, setClientComplianceGraphData] =
    useState(null);
  const [complianceDuration, setComplianceDuration] = useState("12");
  const [ratingGraphData, setRatingGraphData] = useState(null);
  const [ratingDuration, setRatingDuration] = useState("6");
  const { notifications, loading: notificationsLoading } =
    useRecentNotifications(4);

  // Group pending tasks by user and day
  const groupedPendingTasks = useMemo(() => {
    if (!pendingTasks || pendingTasks.length === 0) return [];

    const groups = {};

    pendingTasks.forEach((task) => {
      const key = `${task.userId?._id}-${task.globalDayIndex}`;
      if (!groups[key]) {
        groups[key] = {
          userId: task.userId,
          programId: task.programId,
          globalDayIndex: task.globalDayIndex,
          weekIndex: task.weekIndex,
          dayIndex: task.dayIndex,
          tasks: [],
          createdAt: task.createdAt,
        };
      }
      groups[key].tasks.push(task);
    });

    return Object.values(groups);
  }, [pendingTasks]);

  const fetchData = useCallback(async () => {
    dispatch(getCoachDashboardStats(user?._id)).then((res) => {
      if (res.meta?.requestStatus === "fulfilled") {
        setDashboardStats(res.payload);
      }
    });
    dispatch(getClientComplianceGraphData(complianceDuration)).then((res) => {
      if (res.meta?.requestStatus === "fulfilled") {
        setClientComplianceGraphData(res.payload);
      }
    });
    dispatch(
      getCoachRatingGraph({ id: user?._id, duration: ratingDuration }),
    ).then((res) => {
      if (res.meta?.requestStatus === "fulfilled") {
        setRatingGraphData(res.payload);
      }
    });
    dispatch(getPendingSubmissions());
  }, [dispatch, user?._id, complianceDuration, ratingDuration]);

  useEffect(() => {
    if (user?._id && token) {
      fetchData();

      // Socket.IO Setup
      socket.auth = { userId: user?._id, token: token };
      socket.connect();

      socket.on("connect", () => {
        console.log("Dashboard socket connected");
        socket.emit("join_task_rooms", { role: user.role });
      });

      socket.on("new_task_submission", () => {
        fetchData(); // Refresh data in real-time
      });

      socket.on("task_updated", () => {
        fetchData(); // Refresh data in real-time
      });

      return () => {
        socket.off("connect");
        socket.off("new_task_submission");
        socket.off("task_updated");
        socket.disconnect();
      };
    }
  }, [fetchData, user?._id, user?.role, token]);

  // Compliance Chart Data
  const complianceData = useMemo(() => {
    if (
      !clientComplianceGraphData ||
      !clientComplianceGraphData.monthwiseCompliance ||
      clientComplianceGraphData.monthwiseCompliance.length === 0
    ) {
      return null;
    }

    const { monthwiseCompliance } = clientComplianceGraphData;

    // Define month order to sort correctly if needed, or assume API returns in order
    // For now assuming API returns sorted or in correct display order

    return {
      labels: monthwiseCompliance.map((item) => item.month),
      datasets: [
        {
          label: "High",
          data: monthwiseCompliance.map((item) => item.High),
          backgroundColor: "#0A4F48",
          borderRadius: 6,
          barPercentage: 0.6,
        },
        {
          label: "Medium",
          data: monthwiseCompliance.map((item) => item.Medium),
          backgroundColor: "#F4DBC7",
          borderRadius: 6,
          barPercentage: 0.6,
        },
        {
          label: "Low",
          data: monthwiseCompliance.map((item) => item.Low),
          backgroundColor: "#EBF3F2",
          borderRadius: 6,
          barPercentage: 0.6,
        },
      ],
    };
  }, [clientComplianceGraphData]);

  const complianceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12, weight: "500" },
          color: "#374151",
          generateLabels: function (chart) {
            const datasets = chart.data.datasets;
            const totals = Array(chart.data.labels.length).fill(0);
            datasets.forEach((dataset) => {
              dataset.data.forEach((value, index) => {
                totals[index] += value;
              });
            });

            return datasets.map((dataset, i) => {
              return {
                text: `${dataset.label}`,
                fillStyle: dataset.backgroundColor,
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i,
              };
            });
          },
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1F2937",
        bodyColor: "#6B7280",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        bodyFont: { size: 12 },
        titleFont: { size: 13, weight: "600" },
        callbacks: {
          title: function (context) {
            return context[0].label 
          },
          label: function (context) {
            return (
              " " +
              context.dataset.label +
              "          " +
              context.parsed.y +
              "%"
            );
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "#9CA3AF", font: { size: 11 } },
        border: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          color: "#9CA3AF",
          font: { size: 11 },
          callback: (value) => value + "%",
        },
        grid: { color: "#F3F4F6", drawBorder: false },
        border: { display: false },
      },
    },
  };

  // Rating Score Chart Data
  const ratingData = useMemo(() => {
    if (
      !ratingGraphData ||
      !ratingGraphData.ratingData ||
      ratingGraphData.ratingData.length === 0
    ) {
      return null;
    }

    const { ratingData } = ratingGraphData;

    return {
      labels: ratingData.map((item) => item.month),
      datasets: [
        {
          data: ratingData.map((item) => item.rating),
          backgroundColor: ["#F4DBC7"],
          borderRadius: 6,
          barPercentage: 0.5,
        },
      ],
    };
  }, [ratingGraphData]);

  const ratingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1F2937",
        bodyColor: "#6B7280",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        bodyFont: { size: 12 },
        titleFont: { size: 13, weight: "600" },
        callbacks: {
          title: function (context) {
            return context[0].label 
          },
          label: function (context) {
            return "⭐ " + context.parsed.y;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF", font: { size: 11 } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          color: "#9CA3AF",
          font: { size: 11 },
        },
        grid: {
          color: "#F3F4F6",
          drawBorder: false,
        },
        border: { display: false },
      },
    },
  };

  const getStatusColor = (status) => {
    const statusMap = {
      "In Review": "bg-purple-50 text-purple-700",
      Skipped: "bg-yellow-50 text-yellow-700",
      Missed: "bg-red-50 text-red-700",
    };
    return statusMap[status] || "bg-gray-50 text-gray-700";
  };

  // Performance Doughnut Data
  const performanceData = {
    labels: ["Task Completion", "Client Load", "Rating"],
    datasets: [
      {
        data: [
          dashboardStats?.totalCompliance,
          dashboardStats?.clientLoad,
          dashboardStats?.avarageRating,
        ],
        backgroundColor: ["#0A4F48", "#EBF3F2", "#F4DBC7"],
        borderWidth: 0,
        circumference: 360,
        rotation: -90,
        cutout: "75%",
        hoverOffset: 4,
        spacing: 3,
        borderRadius: 20,
      },
    ],
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) {
                label += ": ";
              }
              if (context.raw !== null && context.raw !== undefined) {
                label += context.raw;
                if (
                  context.label === "Task Completion" ||
                  context.label === "Client Load"
                ) {
                  label += "%";
                }
              }
              return label;
            },
          },
        },
      },
      maintainAspectRatio: false,
      cutout: "75%",
    },
  };

  const topMetricCards = [
    {
      label: "Total Clients",
      value: dashboardStats?.totalClients || 0,
      icon: <Users size={20} className="text-white md:w-6 md:h-6" />,
      bg: "bg-linear-to-br from-[#0A4F48] to-[#128a7e] text-white",
      iconBg: "bg-white/20",
      border: "border-transparent",
      textColor: "text-white",
      subTextColor: "text-white/80",
    },
    {
      label: "Pending Reviews",
      value: pendingTasks?.length || 0,
      icon: (
        <UserRoundPen size={20} className="text-[#DAA520] md:w-6 md:h-6" />
      ),
      bg: "bg-white hover:bg-[#FAF3E0]/30",
      border: "border-[#DAA520]/20",
      iconBg: "bg-[#FAF3E0]",
      textColor: "text-[#0A4F48]",
      subTextColor: "text-[#66706D]",
    },
    {
      label: "Client Compliance",
      value: `${dashboardStats?.totalCompliance || 0}%`,
      icon: <UserStar size={20} className="text-[#0A4F48] md:w-6 md:h-6" />,
      bg: "bg-white hover:bg-[#EBF3F2]/50",
      border: "border-[#0A4F48]/10",
      iconBg: "bg-[#EBF3F2]",
      textColor: "text-[#0A4F48]",
      subTextColor: "text-[#66706D]",
    },
    {
      label: user?.role?.toLowerCase() !== "therapist" ? "Programs" : "Therapy",
      value: dashboardStats?.totalPrograms || 0,
      icon: (
        <BicepsFlexed size={20} className="text-[#DAA520] md:w-6 md:h-6" />
      ),
      bg: "bg-white hover:bg-[#FAF3E0]/30",
      border: "border-[#DAA520]/20",
      iconBg: "bg-[#FAF3E0]",
      textColor: "text-[#0A4F48]",
      subTextColor: "text-[#66706D]",
    },
  ];

  return (
    <>
      <BackgroundAnimation />
      <div className="flex flex-col gap-4 md:gap-6 p-3 md:p-5 lg:p-8 bg-transparent h-[calc(100vh-120px)] overflow-auto no-scrollbar max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col gap-1 mb-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0A4F48] tracking-tight">
            Overview
          </h1>
          <p className="text-xs md:text-sm text-[#66706D]">
            Track your client performance, pending reviews, and growth metrics.
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Charts & Pending Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Compliance Chart */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:border-[#E2E8F0] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-[#1E293B]">
                  Client Compliance
                </h2>
                <select
                  className="text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] rounded-lg px-3 py-1.5 bg-[#F8FAFC] focus:outline-none focus:border-[#0A4F48]"
                  onChange={(e) => setComplianceDuration(e.target.value)}
                >
                  <option value="12">Last Year</option>
                  <option value="6">Last 6 Months</option>
                  <option value="3">Last 3 Months</option>
                </select>
              </div>
              <div className="h-[260px] flex items-center justify-center">
                {complianceData ? (
                  <Bar data={complianceData} options={complianceOptions} />
                ) : (
                  <div className="text-center text-gray-400 text-sm italic">
                    <p>No compliance data available</p>
                    <p className="text-xs mt-1">Try changing the duration</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Score Chart */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:border-[#E2E8F0] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-[#1E293B]">
                  Rating Score
                </h2>
                <select
                  className="text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] rounded-lg px-3 py-1.5 bg-[#F8FAFC] focus:outline-none focus:border-[#0A4F48]"
                  onChange={(e) => setRatingDuration(e.target.value)}
                  value={ratingDuration}
                >
                  <option value="12">Last Year</option>
                  <option value="6">Last 6 Months</option>
                  <option value="3">Last 3 Months</option>
                </select>
              </div>
              <div className="h-[260px] flex items-center justify-center">
                {ratingData ? (
                  <Bar data={ratingData} options={ratingOptions} />
                ) : (
                  <div className="text-center text-gray-400 text-sm italic">
                    <p>No rating data available</p>
                    <p className="text-xs mt-1">Try changing the duration</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {user?.role?.toLowerCase() === "therapist" && <HabitProgress />}

          {/* Pending Reviews Table */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:border-[#E2E8F0] transition-all duration-300">
            <h2 className="text-[16px] font-bold text-[#1E293B] mb-4">
              Pending Reviews
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F1F5F9]">
                    <th className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider pb-3">
                      Client Name
                    </th>
                    <th className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider pb-3">
                      Program
                    </th>
                    <th className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider pb-3">
                      Meal Type
                    </th>
                    <th className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider pb-3">
                      Date & Time
                    </th>
                    <th className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider pb-3">
                      Status
                    </th>
                    <th className="text-left text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider pb-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedPendingTasks?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-center text-gray-400 italic"
                      >
                        No pending reviews for your assigned clients.
                      </td>
                    </tr>
                  ) : (
                    groupedPendingTasks?.map((group) => (
                      <tr
                        key={`${group.userId?._id}-${group.globalDayIndex}`}
                        className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC]/60 transition-colors"
                      >
                        <td className="py-4 text-[13px] text-[#1E293B] font-semibold">
                          {group.userId?.name}
                        </td>
                        <td className="py-4 text-[13px] text-[#64748B]">
                          {group.programId?.title || "N/A"}
                        </td>
                        <td className="py-4 text-[13px] text-[#64748B]">
                          Day {group.globalDayIndex} ({group.tasks.length}{" "}
                          {group.tasks.length === 1 ? "task" : "tasks"})
                        </td>
                        <td className="py-4 text-[13px] text-[#64748B]">
                          {new Date(group.createdAt).toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span
                            className={`text-[12px] font-semibold px-3 py-1 rounded-full ${getStatusColor(
                              "In Review",
                            )}`}
                          >
                            PENDING
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => setSelectedReview(group)}
                            className="bg-[#0A4F48] text-white text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-[#083d37] transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section - My Performance & Daily Activity */}
        <div className="space-y-6">
          {/* My Performance Card */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:border-[#E2E8F0] border border-[#EEF2F6] flex flex-col h-[500px] overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#1E293B]">
                My Performance
              </h3>
              <MoreHorizontal
                size={18}
                className="text-[#94A3B8] hover:text-[#0A4F48] transition-colors cursor-pointer"
              />
            </div>

            {/* Circular Progress Chart */}
            <div className="flex-1 relative flex items-center justify-center -mt-4">
              <div className="w-50 h-50">
                <Doughnut
                  data={performanceData}
                  options={performanceData.options}
                />
              </div>
            </div>

            {/* Performance Metrics List */}
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0A4F48] rounded-l-lg"></div>
                <span className="ml-3 text-[13px] font-medium text-[#475569]">
                  Task Completion
                </span>
                <span className="text-[14px] font-bold text-[#0A4F48]">
                  {dashboardStats?.totalCompliance || 0}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F4DBC7] rounded-l-lg"></div>
                <span className="ml-3 text-[13px] font-medium text-[#475569]">
                  Rating
                </span>
                <span className="text-[14px] font-bold text-[#0A4F48]">
                  {dashboardStats?.avarageRating || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#EBF3F2] rounded-l-lg"></div>
                <span className="ml-3 text-[13px] font-medium text-[#475569]">
                  Client Load
                </span>
                <span className="text-[14px] font-bold text-[#0A4F48]">
                  {dashboardStats?.clientLoad || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Daily Activity Log */}
          <RecentNotificationsCard
            notifications={notifications}
            loading={notificationsLoading}
          />
        </div>
      </div>

      {/* Review Drawer */}
      <ReviewDrawer
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
      </div>
    </>
  );
}

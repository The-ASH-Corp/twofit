import React, { useEffect, useState } from "react";
import { Users, FileText, TrendingUp, Activity } from "lucide-react";
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
import { getCoachDashboardStats } from "@/redux/features/coach/coach.thunk";
import { getPendingSubmissions } from "@/redux/features/tasks/task.thunk";
import { socket } from "@/utils/socket";
import { selectToken } from "@/redux/features/auth/auth.selectores";

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

  // Compliance Chart Data
  const complianceData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "High",
        data: [10, 50, 30, 5, 55, 25, 30, 30, 30, 30, 50, 55],
        backgroundColor: "#0A4F48",
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: "Medium",
        data: [20, 25, 15, 15, 20, 25, 30, 20, 20, 20, 25, 30],
        backgroundColor: "#F4DBC7",
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: "Low",
        data: [45, 0, 30, 55, 0, 25, 15, 25, 25, 25, 0, 0],
        backgroundColor: "#EBF3F2",
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

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
            return context[0].label + " 2025";
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
  const ratingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        data: [3.8, 4.2, 3.5, 4.1, 3.9, 4.0, 4.3, 3.7],
        backgroundColor: ["#F4DBC7"],
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

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
            return context[0].label + " 2025";
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

  // Performance Doughnut Data
  const performanceData = {
    datasets: [
      {
        data: [22, 18, 14],
        backgroundColor: ["#0A4F48", "#EBF3F2", "#F4DBC7"],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "80%",
        hoverOffset: 1,
        spacing: 3,
        borderRadius: 6,
      },
    ],
  };



  // Activity Log Data
  const activityLog = [
    {
      icon: <Users size={16} className="text-[#0A4F48]" />,
      bg: "bg-[#EBF3F2]",
      text: "Meal Uploaded (Lunch: Paneer Salad)",
      time: "10:00 AM",
    },
    {
      icon: <Activity size={16} className="text-[#D4A5A0]" />,
      bg: "bg-[#FAE8E6]",
      text: "Workout Completed (20 mins HIT)",
      time: "8:15 AM",
    },
    {
      icon: <Users size={16} className="text-[#0A4F48]" />,
      bg: "bg-[#EBF3F2]",
      text: "Meal Skipped (Dinner)",
      time: "Yesterday, 6:05 PM",
    },
    {
      icon: <Activity size={16} className="text-[#F4DBC7]" />,
      bg: "bg-[#FAF3E0]",
      text: "Therapy Task Completed",
      time: "2 Days Ago, 2:30 PM",
    },
  ];

  const getStatusColor = (status) => {
    const statusMap = {
      "In Review": "bg-purple-50 text-purple-700",
      Skipped: "bg-yellow-50 text-yellow-700",
      Missed: "bg-red-50 text-red-700",
    };
    return statusMap[status] || "bg-gray-50 text-gray-700";
  };
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const { pendingTasks } = useAppSelector((state) => state.tasks);
  const [dashboardStats, setDashboardStats] = useState(null);

  // Group pending tasks by user and day
  const groupedPendingTasks = React.useMemo(() => {
    if (!pendingTasks || pendingTasks.length === 0) return [];
    
    const groups = {};
    
    pendingTasks.forEach(task => {
      const key = `${task.userId?._id}-${task.globalDayIndex}`;
      if (!groups[key]) {
        groups[key] = {
          userId: task.userId,
          programId: task.programId,
          globalDayIndex: task.globalDayIndex,
          weekIndex: task.weekIndex,
          dayIndex: task.dayIndex,
          tasks: [],
          createdAt: task.createdAt
        };
      }
      groups[key].tasks.push(task);
    });
    
    return Object.values(groups);
  }, [pendingTasks]);


  const fetchData = async () => {
      dispatch(getCoachDashboardStats(user._id)).then((res) => {
        if (res.meta?.requestStatus === "fulfilled") {
          setDashboardStats(res.payload);
        }
      });
    dispatch(getPendingSubmissions());
  };

  useEffect(() => {
    if (user?._id && token) {
      fetchData();

      // Socket.IO Setup
      socket.auth = { userId: user._id, token: token };
      socket.connect();

      socket.on("connect", () => {
        console.log("Dashboard socket connected");
        socket.emit("join_task_rooms", { role: user.role });
      });

      socket.on("new_task_submission", (data) => {
        console.log("New task submission received via socket:", data);
        fetchData(); // Refresh data in real-time
      });

      socket.on("task_updated", (data) => {
        console.log("Task updated via socket:", data);
        fetchData(); // Refresh data in real-time
      });

      return () => {
        socket.off("connect");
        socket.off("new_task_submission");
        socket.off("task_updated");
        socket.disconnect();
      };
    }
  }, [dispatch, user?._id, token]);

  console.log(user?.role.toLowerCase())
  return (
    <div className="flex flex-col gap-6 p-1 bg-[#F8F9FA] h-[calc(100vh-120px)] overflow-auto no-scrollbar">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#EBF3F2] flex items-center justify-center">
            <Users size={20} className="text-[#0A4F48]" />
          </div>
          <div>
            <p className="text-[13px] text-gray-500 font-medium">
              Total Clients
            </p>
            <p className="text-[24px] font-bold text-gray-900">
              {dashboardStats?.totalClients || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#FAE8E6] flex items-center justify-center">
            <FileText size={20} className="text-[#D4A5A0]" />
          </div>
          <div>
            <p className="text-[13px] text-gray-500 font-medium">
              Pending Reviews
            </p>
            <p className="text-[24px] font-bold text-gray-900">
              {pendingTasks?.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
            <TrendingUp size={20} className="text-[#45C4A2]" />
          </div>
          <div>
            <p className="text-[13px] text-gray-500 font-medium">
              Client Compliance
            </p>
            <p className="text-[24px] font-bold text-gray-900">{dashboardStats?.totalCompliance || 0}%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
            <Activity size={20} className="text-[#45C4A2]" />
          </div>
          <div>
            <p className="text-[13px] text-gray-500 font-medium">{user?.role.toLowerCase() !== "therapist" ? "Programs" : "Therapy"}</p>
            <p className="text-[24px] font-bold text-gray-900">
              {dashboardStats?.totalPrograms || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Charts & Pending Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Client Compliance Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-gray-900">
                  Client Compliance
                </h2>
                <select className="text-[13px] text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0A4F48]">
                  <option>Last Year</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <div className="h-[260px]">
                <Bar data={complianceData} options={complianceOptions} />
              </div>
            </div>

            {/* Rating Score Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold text-gray-900">
                  Rating Score
                </h2>
                <select className="text-[13px] text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0A4F48]">
                  <option>Last 8 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <div className="h-[260px]">
                <Bar data={ratingData} options={ratingOptions} />
              </div>
            </div>
          </div>

          {/* Pending Reviews Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-[16px] font-bold text-gray-900 mb-4">
              Pending Reviews
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-[12px] font-semibold text-gray-500 uppercase tracking-wider pb-3">
                      Client Name
                    </th>
                    <th className="text-left text-[12px] font-semibold text-gray-500 uppercase tracking-wider pb-3">
                      Program
                    </th>
                    <th className="text-left text-[12px] font-semibold text-gray-500 uppercase tracking-wider pb-3">
                      Meal Type
                    </th>
                    <th className="text-left text-[12px] font-semibold text-gray-500 uppercase tracking-wider pb-3">
                      Date & Time
                    </th>
                    <th className="text-left text-[12px] font-semibold text-gray-500 uppercase tracking-wider pb-3">
                      Status
                    </th>
                    <th className="text-left text-[12px] font-semibold text-gray-500 uppercase tracking-wider pb-3">
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
                        className="border-b border-gray-50 hover:bg-gray-50/50"
                      >
                        <td className="py-4 text-[13px] text-gray-900 font-medium">
                          {group.userId?.name}
                        </td>
                        <td className="py-4 text-[13px] text-gray-600">
                          {group.programId?.title || "N/A"}
                        </td>
                        <td className="py-4 text-[13px] text-gray-600">
                          Day {group.globalDayIndex} ({group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'})
                        </td>
                        <td className="py-4 text-[13px] text-gray-600">
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
                            className="bg-[#0A4F48] text-white text-[13px] font-medium px-5 py-2 rounded-lg hover:bg-[#083d37] transition-colors"
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
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-[16px] font-bold text-gray-900 mb-6">
              My Performance
            </h2>

            {/* Circular Progress Chart */}
            <div className="flex justify-center items-center mb-6 pt-4">
              <div className="relative w-48 h-28">
                <Doughnut
                  data={performanceData}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    cutout: "80%",
                  }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ top: "10px" }}
                >
                  <div className="text-center">
                    <p className="text-[32px] font-bold text-gray-900">50%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#0A4F48]"></div>
                  <span className="text-[13px] text-gray-600">
                    Task Completion
                  </span>
                </div>
                <span className="text-[15px] font-bold text-gray-900">50%</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#F4DBC7]"></div>
                  <span className="text-[13px] text-gray-600">Rating</span>
                </div>
                <span className="text-[15px] font-bold text-gray-900">
                  {dashboardStats?.avarageRating || 0}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#EBF3F2]"></div>
                  <span className="text-[13px] text-gray-600">Client Load</span>
                </div>
                <span className="text-[15px] font-bold text-gray-900">73%</span>
              </div>
            </div>
          </div>

          {/* Daily Activity Log */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-[16px] font-bold text-gray-900 mb-4">
              Daily Activity Log
            </h2>
            <div className="space-y-4">
              {activityLog.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-900 font-medium leading-tight">
                      {activity.text}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Drawer */}
      <ReviewDrawer
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}

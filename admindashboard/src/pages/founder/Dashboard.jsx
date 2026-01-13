import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  FileText,
  Layout,
  MoreHorizontal,
  Bell,
  TrendingUp,
  ChevronDown,
  Flame,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  RefreshCw,
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
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { founderDashboardData } from "@/redux/features/founder/founder.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectFounderDashBoard,
  selectFounderStatus,
} from "@/redux/features/founder/founder.selector";

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
  Filler
);

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(founderDashboardData());
  }, [dispatch]);

  const data = useAppSelector(selectFounderDashBoard);
  // const error = useAppSelector(selectFounderError);
  const status = useAppSelector(selectFounderStatus);

  const [founder, setFounder] = useState();

  useEffect(() => {
    setFounder(data);
    console.log(data);
  }, [data]);
  // Mock Data for Charts
  const growthData = {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Active",
        data: [40, 45, 42, 48, 45, 50],
        backgroundColor: "#F4DBC7",
        borderRadius: 4,
        barThickness: 12,
      },
      {
        label: "Inactive",
        data: [50, 55, 52, 58, 55, 54],
        backgroundColor: "#EBF3F2",
        borderRadius: 4,
        barThickness: 12,
      },
      {
        label: "New",
        data: [30, 35, 32, 38, 35, 30],
        backgroundColor: "#0A4F48",
        borderRadius: 4,
        barThickness: 12,
      },
    ],
  };

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
        label: "Diet",
        data: [30, 35, 70, 68, 72, 75, 74, 76, 78, 80, 79, 82],
        backgroundColor: "#0A4F48",
        borderRadius: 4,
      },
      {
        label: "Workout",
        data: [40, 45, 50, 48, 52, 55, 63, 65, 67, 69, 68, 70],
        backgroundColor: "#F4DBC7",
        borderRadius: 4,
      },
      {
        label: "Therapy",
        data: [30, 35, 40, 38, 42, 45, 52, 54, 56, 58, 57, 60],
        backgroundColor: "#EBF3F2",
        borderRadius: 4,
      },
    ],
  };

  // const newClientsData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //   datasets: [
  //     {
  //       label: "Clients joined",
  //       data: [45, 52, 40, 75, 55, 65],
  //       borderColor: "#0A4F48",
  //       backgroundColor: (context) => {
  //         const ctx = context.chart.ctx;
  //         const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  //         gradient.addColorStop(0, "rgba(10, 79, 72, 0.1)");
  //         gradient.addColorStop(1, "rgba(10, 79, 72, 0)");
  //         return gradient;
  //       },
  //       fill: true,
  //       tension: 0.4,
  //       borderWidth: 3,
  //       pointBackgroundColor: "#fff",
  //       pointBorderColor: "#0A4F48",
  //       pointBorderWidth: 2,
  //       pointRadius: 4,
  //       pointHoverRadius: 6,
  //     },
  //   ],
  // };

  const expertPerformanceData = {
    labels: ["Task Completion", "Rating", "Clients Assigned"],
    datasets: [
      {
        data: [40, 85, 60],
        backgroundColor: ["#0A4F48", "#EBF3F2", "#F4DBC7"],
        borderWidth: 0,
        cutout: "75%",
        hoverOffset: 1,
        spacing: 3,
        borderRadius: 8,
      },
    ],
  };

  const subAdminPerformanceData = {
    labels: ["Programs", "Experts", "Clients "],
    datasets: [
      {
        data: [70, 85, 60],
        backgroundColor: ["#0A4F48", "#EBF3F2", "#F4DBC7"],
        borderWidth: 0,
        cutout: "75%",
        hoverOffset: 1,
        spacing: 3,
        borderRadius: 8,
      },
    ],
  };

  const expertsSummaryData = {
    labels: ["Trainers", "Dietitians", "Therapists"],
    datasets: [
      {
        data: [
          founder?.data?.Trainers,
          founder?.data?.Dietitians,
          founder?.data?.Therapists,
        ],
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

  const chartOptions = {
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
        max: 100,
        ticks: {
          stepSize: 25,
          font: {
            size: 11,
          },
          color: "#66706D",
          callback: (value) => value + "%",
        },
        grid: {
          color: "#f0f0f0",
        },
      },
    },
  };

  const progressReports = [
    {
      name: "Neha Sharma",
      type: "Diet",
      expert: "Dietitian",
      submittedBy: "Dietitian Anjali",
      time: "Today, 10:15 AM",
    },
    {
      name: "Aarav Kumar",
      type: "Workout",
      expert: "Trainer",
      submittedBy: "Trainer Rahul",
      time: "Today, 9:40 AM",
    },
    {
      name: "Vikram Singh",
      type: "Therapy",
      expert: "Therapist",
      submittedBy: "Dietitian Priya",
      time: "Yesterday, 7:10 PM",
    },
    {
      name: "Sonali Jain",
      type: "Measurements",
      expert: "Trainer",
      submittedBy: "Dietitian Anjali",
      time: "Yesterday, 5:20 PM",
    },
    {
      name: "Riya Mehta",
      type: "Diet",
      expert: "Dietitian",
      submittedBy: "Therapist Mira",
      time: "2 Days Ago",
    },
    {
      name: "Neha Sharma",
      type: "Weight",
      expert: "Trainer",
      submittedBy: "Dietitian Anjali",
      time: "2 Days Ago",
    },
    {
      name: "Aarav Kumar",
      type: "Therapy",
      expert: "Therapist",
      submittedBy: "Trainer Rahul",
      time: "3 Days Ago",
    },
  ];

  

  return (
    <div className="flex flex-col gap-6 p-1 bg-[#F8F9FA] h-[calc(100vh-120px)] overflow-auto  no-scrollbar">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Clients",
            value: founder?.data?.totalClient,
            icon: <Users size={20} className="text-[#0A4F48]" />,
            bg: "bg-[#EBF3F2]",
          },
          {
            label: "Headers",
            value: founder?.data?.totalHeads,
            icon: <UserCheck size={20} className="text-[#DAA520]" />,
            bg: "bg-[#FAF3E0]",
          },
          {
            label: "Sub Admins",
            value: founder?.data?.totalAdmins,
            icon: <FileText size={20} className="text-[#0A4F48]" />,
            bg: "bg-[#EBF3F2]",
          },
          {
            label: "Total Programs",
            value: founder?.data?.totalPrograms,
            icon: <Layout size={20} className="text-[#DAA520]" />,
            bg: "bg-[#FAF3E0]",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm text-[#66706D] font-medium">
                {card.label}
              </span>
              <span className="text-2xl font-bold text-[#0A4F48]">
                {card.value}
              </span>
            </div>
            <div className={`${card.bg} p-3 rounded-full`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-6 lg:flex-row flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Row 2: Client Growth & Client Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Client Growth" subTitle="Last 6 Months">
              <div className="flex items-center gap-4 mb-4">
                <LegendItem color="#F4DBC7" label="Active" />
                <LegendItem color="#DBDEDD" label="Inactive" />
                <LegendItem color="#0A4F48" label="New" />
              </div>
              <div className="h-64 relative">
                <Bar data={growthData} options={chartOptions} />
              </div>
            </DashboardCard>

            <DashboardCard title="Client Compliance" subTitle="Last Year">
              <div className="flex items-center gap-4 mb-4">
                <LegendItem color="#0A4F48" label="Diet" />
                <LegendItem color="#F4DBC7" label="Workout" />
                <LegendItem color="#EBF3F2" label="Therapy" />
              </div>
              <div className="h-64">
                <Bar
                  data={complianceData}
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      x: { ...chartOptions.scales.x, stacked: true },
                      y: { ...chartOptions.scales.y, stacked: true },
                    },
                  }}
                />
              </div>
            </DashboardCard>
          </div>

          {/* Row 3: New Clients Joined & Expert Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Sub Admin Performance" subTitle="Last Months">
              <div className="h-64 relative flex items-center justify-center">
                <Doughnut
                  data={subAdminPerformanceData}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                  }}
                />
                {/* <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-[#0A4F48]">4.6</span>
                  <span className="text-xs text-[#66706D]">Avg Rating</span>
                </div> */}
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#0A4F48]"></div>
                  <span className="text-[11px] text-[#66706D]">
                    Programs{" "}
                    <strong className="text-[#0A4F48] text-[12px]">50%</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#EBF3F2]"></div>
                  <span className="text-[11px] text-[#66706D]">
                    Experts{" "}
                    <strong className="text-[#0A4F48] text-[12px]">50%</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#F4DBC7]"></div>
                  <span className="text-[11px] text-[#66706D]">
                    Clients{" "}
                    <strong className="text-[#0A4F48] text-[12px]">73%</strong>
                  </span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Expert Performance" subTitle="Last Months">
              <div className="h-64 relative flex items-center justify-center">
                <Doughnut
                  data={expertPerformanceData}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                  }}
                />
                {/* <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-[#0A4F48]">4.6</span>
                  <span className="text-xs text-[#66706D]">Avg Rating</span>
                </div> */}
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#0A4F48]"></div>
                  <span className="text-[12px] text-[#66706D]">
                    Task Completion{" "}
                    <strong className="text-[#0A4F48] text-[12px]">
                      1.8 h
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#EBF3F2]"></div>
                  <span className="text-[12px] text-[#66706D]">
                    Rating{" "}
                    <strong className="text-[#0A4F48] text-[12px]">4.6</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-xs bg-[#F4DBC7]"></div>
                  <span className="text-[12px] text-[#66706D]">
                    Clients Assigned{" "}
                    <strong className="text-[#0A4F48] text-[12px]">73%</strong>
                  </span>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Row 4: Latest Progress Reports */}
          <div className="bg-white rounded-2xl shadow-sm flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0A4F48]">
                Latest Progress Reports
              </h3>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-xs font-medium text-[#66706D]">
                All Categories <ChevronDown size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8F9FA] text-[11px] uppercase tracking-wider text-[#66706D] font-bold">
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Report Type</th>
                    <th className="px-6 py-4">Expert</th>
                    <th className="px-6 py-4">Submitted By</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {progressReports.map((report, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {report.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#66706D]">
                        {report.type}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            report.expert === "Dietitian"
                              ? "bg-[#FAF3E0] text-[#DAA520]"
                              : report.expert === "Trainer"
                              ? "bg-[#EBF3F2] text-[#0A4F48]"
                              : "bg-[#F0FDF4] text-[#15803D]"
                          }`}
                        >
                          {report.expert}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#66706D]">
                        {report.submittedBy}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#66706D]">
                        {report.time}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#66706D]">
                        <MoreHorizontal
                          size={18}
                          className="cursor-pointer hover:text-gray-900"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 flex flex-col gap-6">
          {/* Experts Gauge Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[#0A4F48]">Experts</h3>
              <MoreHorizontal size={20} className="text-gray-400" />
            </div>
            <div className="h-48 relative flex items-center justify-center">
              <Doughnut
                data={expertsSummaryData}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  cutout: "80%",
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10%] flex flex-col items-center">
                <span className="text-[10px] text-[#66706D] font-medium">
                  Total Experts
                </span>
                <span className="text-3xl font-bold text-[#0A4F48]">
                  {founder?.data?.totalExperts}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {[
                {
                  label: "Trainers",
                  count: founder?.data?.Trainers,
                  color: "bg-[#0A4F48]",
                },
                {
                  label: "Dietitians",
                  count: founder?.data?.Dietitians,
                  color: "bg-[#EBF3F2]",
                },
                {
                  label: "Therapists",
                  count: founder?.data?.Therapists,
                  color: "bg-[#FFD7A8]",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-sm ${item.color}`}></div>
                    <span className="text-xs text-[#66706D] font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0A4F48]">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden ">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#0A4F48]">
                Recent Notifications
              </h3>
              <MoreHorizontal size={20} className="text-gray-400" />
            </div>
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar">
              {[
                {
                  icon: <Bell size={16} className="text-[#0A4F48]" />,
                  bg: "bg-[#EBF3F2]",
                  text: "WhatsApp delivery failed for 14 messages",
                  time: "Today, 11:20 AM",
                },
                {
                  icon: <MessageSquare size={16} className="text-[#DAA520]" />,
                  bg: "bg-[#FAF3E0]",
                  text: 'New feedback received: "Trainer was very helpful"',
                  time: "Today, 10:00 AM",
                },
                {
                  icon: <RefreshCw size={16} className="text-[#45C4A2]" />,
                  bg: "bg-[#F0FDF4]",
                  text: "Dietitian Priya has 5 pending meal reviews",
                  time: "Yesterday, 6:05 PM",
                },
                {
                  icon: <Bell size={16} className="text-[#DAA520]" />,
                  bg: "bg-[#FAF3E0]",
                  text: "Client Neha requested expert change",
                  time: "2 Days Ago, 2:30 PM",
                },
              ].map((notif, i) => (
                <div key={i} className="flex gap-4">
                  <div
                    className={`${notif.bg} p-2.5 h-fit rounded-full flex-shrink-0`}
                  >
                    {notif.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-[#0A4F48] leading-tight">
                      {notif.text}
                    </p>
                    <span className="text-[10px] text-[#66706D]">
                      {notif.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, subTitle, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-base font-bold text-[#0A4F48]">{title}</h3>
      <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-[10px] font-semibold text-[#66706D] uppercase tracking-wider">
        {subTitle} <ChevronDown size={14} />
      </button>
    </div>
    {children}
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-2.5 h-2.5 rounded-sm"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-xs text-[#66706D] font-medium">{label}</span>
  </div>
);

export default Dashboard;

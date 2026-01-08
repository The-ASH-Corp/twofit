import React, { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Bell,
  ChevronDown,
  MessageSquare,
  RefreshCw,
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
export default function Dashboard() {
const [dashboardData, setDashboardData] = useState(null);
const dispatch = useDispatch();
const user =useAppSelector(selectUser)

const getDashboardDatas =async () => {
 const data =await dispatch(getDashboardData(user._id))
 setDashboardData(data.payload)
};

  useEffect(() => {
    getDashboardDatas();
  }, []);

  const performanceData = {
    labels: ["Programs", "Experts", "Clients"],
    datasets: [
      {
        data: [50, 20, 30],
        backgroundColor: ["#0A4F48", "#E6EFEE", "#FFD7A8"],
        borderWidth: 0,
        rotation: 270,
        cutout: "80%",
        hoverOffset: 15,
        spacing: 1,
        borderRadius: 8,
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
        label: "Therapy",
        data: [15, 25, 30, 10, 60, 22, 28, 62, 25, 45, 28, 50],
        backgroundColor: "#0A4F48",
        borderRadius: 10,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        barThickness: 24,
      },
      {
        label: "Workout",
        data: [62, 22, 42, 45, 12, 32, 45, 18, 50, 48, 45, 22],
        backgroundColor: "#F4DBC7",
        borderRadius: 10,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        barThickness: 24,
      },
      {
        label: "Diet",
        data: [23, 53, 28, 45, 28, 46, 27, 20, 25, 7, 27, 28],
        backgroundColor: "#EBF3F2",
        borderRadius: 10,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        barThickness: 24,
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
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Active",
        data: [75, 80, 78, 85, 82, 90],
        backgroundColor: "#F4DBC7",
        borderRadius: 4,
        barThickness: 12,
      },
      {
        label: "Inactive",
        data: [40, 45, 42, 48, 45, 50],
        backgroundColor: "#EBF3F2",
        borderRadius: 4,
        barThickness: 12,
      },
      {
        label: "New",
        data: [60, 70, 65, 80, 75, 85],
        backgroundColor: "#0A4F48",
        borderRadius: 4,
        barThickness: 12,
      },
    ],
  };

  const expertsSummaryData = {
    labels: ["Trainers", "Dietitians", "Therapists", ],
    datasets: [
      {
        data: [dashboardData?.totalTrainers||0, dashboardData?.totalDietitians||0, dashboardData?.totalTherapists||0],
        backgroundColor: ["#0A4F48", "#45C4A2", "#FFD7A8",],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "80%",
        hoverOffset: 15,
        spacing: 1,
        borderRadius: 8,
      },
    ],
  };
  const stackedOptions = {
    ...chartOptions,
    scales: {
      x: { ...chartOptions.scales.x, stacked: true },
      y: { ...chartOptions.scales.y, stacked: true },
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
  console.log(dashboardData);
  
  return (
    <div className="flex flex-col gap-6 p-1 bg-[#F8F9FA]">
      <div className="flex gap-6 lg:flex-row flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Row 1: Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Clients",
                value: dashboardData?.totalClients||0,
                icon: <GraduationCap size={22} className="text-white" />,
                bg: "bg-[#0A4F48]",
              },
              {
                label: "Total Programs",
                value: dashboardData?.totalPrograms||0,
                icon: <BookOpen size={22} className="text-[#0A4F48]" />,
                bg: "bg-[#FAF3E0]",
              },
              {
                label: "Experts",
                value: dashboardData?.totalExperts||0,
                icon: <UserCircle size={22} className="text-white" />,
                bg: "bg-[#0A4F48]",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 h-[100px]"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#66706D] font-medium">
                    {card.label}
                  </span>
                  <span className="text-2xl font-bold text-[#0A4F48]">
                    {card.value}
                  </span>
                </div>
                <div className={`${card.bg} p-2.5 rounded-full`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
          {/* Row 2: Sub Admin & Expert Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Client Growth" subTitle="Last 6 Months">
              <div className="flex gap-4 mb-4">
                <LegendItem color="#F2F2F2" label="Active" />
                <LegendItem color="#E6EFEE" label="Inactive" />
                <LegendItem color="#0A4F48" label="New" />
              </div>
              <div className="h-64">
                <Bar data={growthData} options={chartOptions} />
              </div>
            </DashboardCard>

            <DashboardCard title="Client Compliance" subTitle="Last Year">
              <div className="flex gap-4 mb-4">
                <LegendItem color="#EBF3F2" label="Diet" />
                <LegendItem color="#F4DBC7" label="Workout" />
                <LegendItem color="#0A4F48" label="Therapy" />
              </div>
              <div className="h-64">
                <Bar data={complianceData} options={stackedOptions} />
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
                    <th className="px-6 py-4">Task Type</th>
                    <th className="px-6 py-4">Expert</th>
                    <th className="px-6 py-4">Submitted By</th>
                    <th className="px-6 py-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {progressReports.map((report, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#0A4F48]">
                        {report.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#011412]">
                        {report.type}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-md text-[10px] font-bold ${
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
                      <td className="px-6 py-4 text-sm text-[#011412]">
                        {report.submittedBy}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#66706D]">
                        {report.time}
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
          {/* Experts Gauge Card at the top of Sidebar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col h-[400px] border border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0A4F48]">Experts</h3>
              <MoreHorizontal size={20} className="text-gray-400" />
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
                <span className="text-[10px] text-[#66706D] font-medium">
                  Total Experts
                </span>
                <span className="text-3xl font-bold text-[#0A4F48]">{dashboardData?.totalExperts||0}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              {[
                { label: "Trainers", count: dashboardData?.totalTrainers||0, color: "bg-[#0A4F48]" },
                { label: "Dietitians", count: dashboardData?.totalDietitians||0, color: "bg-[#EBF3F2]" },
                { label: "Therapists", count: dashboardData?.totalTherapists||0, color: "bg-[#FAF3E0]" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-[2px] ${item.color}`}
                    ></div>
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
          <div className="bg-white p-6 rounded-2xl shadow-sm">
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
                value="50%"
              />
              <PerformanceRow
                color="bg-[#E6EFEE]"
                label="Experts"
                value="20%"
              />
              <PerformanceRow
                color="bg-[#FFD7A8]"
                label="Clients"
                value="30%"
              />
            </div>
          </div>
          {/* Recent Notifications */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden min-h-[500px]">
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
}

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

const LegendItem = ({ color, label, value }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-[13px] text-[#66706D] font-medium whitespace-nowrap">
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

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
import { Doughnut } from "react-chartjs-2";
import { getDashboardData } from "@/redux/features/head/head.thunk";
import { useDispatch } from "react-redux";
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
  const [dashboardData, setDashboardData] = useState({});
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [showFilter, setShowFilter] = useState(false);
  const [adminDuration, setAdminDuration] = useState("3");
  const [expertDuration, setExpertDuration] = useState("3");
  const [showAdminDuration, setShowAdminDuration] = useState(false);
  const [showExpertDuration, setShowExpertDuration] = useState(false);

  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const { notifications, loading: notificationsLoading } =
    useRecentNotifications(4);

  useEffect(() => {
    // Initial fetch
    dispatch(getDashboardData({ headId: user?._id, duration: "3" })).then(
      (res) => {
        setDashboardData(res.payload);
      },
    );
  }, []);

  
  useEffect(() => {
    

    dispatch(
      getDashboardData({ headId: user?._id, duration: adminDuration }),
    ).then((res) => {
      // Using adminDuration as primary for now
      setDashboardData(res.payload);
    });
  }, [adminDuration, dispatch, user?._id]);

 
  const timeframeOptions = [
    { label: "Last 3 Months", value: "3" },
    { label: "Last 6 Months", value: "6" },
    { label: "Last 12 Months", value: "12" },
  ];

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
          ? ["#0A4F48", "#45C4A2", "#FFD7A8"]
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

  const adminPerf = {
    programs: dashboardData?.adminPerformance?.programs || 0,
    experts: dashboardData?.adminPerformance?.experts || 0,
    clients: dashboardData?.adminPerformance?.clients || 0,
  };
  const expertPerf = {
    taskCompletion: dashboardData?.expertPerformance?.taskCompletion || 0,
    rating: dashboardData?.expertPerformance?.rating || 0,
    clientsAssigned: dashboardData?.expertPerformance?.clientsAssigned || 0,
    totalClientsAssigned: dashboardData?.expertPerformance?.totalClientsAssigned, // Optional
    totalCapacity: dashboardData?.expertPerformance?.totalCapacity, // Optional
  };

  const hasAdminData =
    adminPerf.programs > 0 || adminPerf.experts > 0 || adminPerf.clients > 0;
  const subAdminPerformanceData = {
    labels: hasAdminData ? ["Programs", "Experts", "Clients"] : ["No Data"],
    datasets: [
      {
        data: hasAdminData
          ? [adminPerf.programs, adminPerf.experts, adminPerf.clients]
          : [1],
        backgroundColor: hasAdminData
          ? ["#0A4F48", "#45C4A2", "#FFD7A8"]
          : ["#E5E7EB"],
        borderWidth: 0,
        cutout: "75%",
        hoverOffset: hasAdminData ? 15 : 0,
        spacing: hasAdminData ? 1 : 0,
        borderRadius: 8,
      },
    ],
  };

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

  const hasExpertPerfData =
    expertPerf.taskCompletion > 0 ||
    expertPerf.rating > 0 ||
    expertPerf.clientsAssigned > 0;
  const expertPerformanceChartData = {
    labels: hasExpertPerfData
      ? ["Task Completion", "Rating", "Clients Assigned"]
      : ["No Data"],
    datasets: [
      {
        data: hasExpertPerfData
          ? [
              expertPerf.taskCompletion,
              (expertPerf.rating / 5) * 100,
              expertPerf.clientsAssigned,
            ]
          : [1],
        backgroundColor: hasExpertPerfData
          ? ["#0A4F48", "#45C4A2", "#FFD7A8"]
          : ["#E5E7EB"],
        borderWidth: 0,
        cutout: "75%",
        hoverOffset: hasExpertPerfData ? 15 : 0,
        spacing: hasExpertPerfData ? 1 : 0,
        borderRadius: 8,
      },
    ],
  };

  const progressReportsRaw =
    dashboardData?.latestReports?.map((report) => ({
      ...report,
      time: calculateTimeAgo(report.time),
    })) || [];

  const progressReports =
    filterCategory === "All Categories"
      ? progressReportsRaw
      : progressReportsRaw.filter((report) => report.type === filterCategory);

  const topMetricCards = [
    {
      label: "Total Clients",
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
      label: "Admins",
      value: dashboardData?.totalAdmins || 0,
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
            Track your admins, experts, and key performance metrics.
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
            {/* Admin Performance Card */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#EEF2F6] flex flex-col group h-full hover:border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
                  Admin Performance
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowAdminDuration(!showAdminDuration)}
                    className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#0A4F48] border border-[#F1F5F9] rounded-lg text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase tracking-wider transition-all duration-300"
                  >
                    Last {adminDuration} Months <ChevronDown size={14} />
                  </button>
                  {showAdminDuration && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-[#F1F5F9] rounded-xl shadow-xl z-10 py-1 overflow-hidden">
                      {timeframeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setAdminDuration(opt.value);
                            setExpertDuration(opt.value); // Syncing for now as per "Global" API limitation hypothesis, or clearer UX.
                            setShowAdminDuration(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#F8FAFC] text-[#64748B]"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-48 relative flex items-center justify-center">
                <Doughnut
                  data={subAdminPerformanceData}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    cutout: "75%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <LegendItem
                  color="#0A4F48"
                  label="Programs"
                  value={adminPerf.programs}
                />
                <LegendItem
                  color="#45C4A2"
                  label="Experts"
                  value={adminPerf.experts}
                />
                <LegendItem
                  color="#FFD7A8"
                  label="Clients"
                  value={adminPerf.clients}
                />
              </div>
            </div>

            {/* Expert Performance Card */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#EEF2F6] flex flex-col group h-full hover:border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
                  Expert Performance
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setShowExpertDuration(!showExpertDuration)}
                    className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#0A4F48] border border-[#F1F5F9] rounded-lg text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase tracking-wider transition-all duration-300"
                  >
                    Last {expertDuration} Months <ChevronDown size={14} />
                  </button>
                  {showExpertDuration && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-[#F1F5F9] rounded-xl shadow-xl z-10 py-1 overflow-hidden">
                      {timeframeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setExpertDuration(opt.value);
                            setAdminDuration(opt.value); // Syncing
                            setShowExpertDuration(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#F8FAFC] text-[#64748B]"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-48 relative flex items-center justify-center">
                <Doughnut
                  data={expertPerformanceChartData}
                  options={{
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            if (context.label === "No Data") return " No Data Available";
                            let label = context.label || "";
                            if (label) {
                              label += ": ";
                            }
                            if (context.parsed !== null) {
                              if (context.label === "Rating") {
                                label += expertPerf.rating + "/5";
                              } else if (context.label === "Clients Assigned" && expertPerf.totalClientsAssigned !== undefined) {
                                label += `${expertPerf.totalClientsAssigned} / ${expertPerf.totalCapacity || 0} (${expertPerf.clientsAssigned}%)`;
                              } else {
                                label += Math.round(context.parsed) + "%";
                              }
                            }
                            return label;
                          },
                        },
                      },
                    },
                    maintainAspectRatio: false,
                    cutout: "75%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                <LegendItem
                  color="#0A4F48"
                  label="Task Completion"
                  value={`${expertPerf.taskCompletion}%`}
                />
                <LegendItem
                  color="#45C4A2"
                  label="Rating"
                  value={`${expertPerf.rating}/5`}
                />
                <LegendItem
                  color="#FFD7A8"
                  label="Clients Assigned"
                  value={
                    expertPerf.totalClientsAssigned !== undefined
                      ? `${expertPerf.totalClientsAssigned} / ${expertPerf.totalCapacity || 0} (${expertPerf.clientsAssigned}%)`
                      : `${expertPerf.clientsAssigned}%`
                  }
                />
              </div>
            </div>
          </div>

          {/* Row 4: Latest Progress Reports */}
          <div className="bg-white rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] border border-[#EEF2F6] flex flex-col min-h-[400px] overflow-hidden transition-shadow duration-300">
            <div className="p-4 md:p-6 lg:p-8 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
                Latest Progress Reports
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[10px] font-bold text-[#64748B] uppercase tracking-wider"
                >
                  {filterCategory} <ChevronDown size={14} />
                </button>
                {showFilter && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-[#F1F5F9] rounded-xl shadow-xl z-10 py-1 overflow-hidden">
                    {["All Categories", "Diet", "Workout", "Therapy"].map(
                      (cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setFilterCategory(cat);
                            setShowFilter(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#F8FAFC] text-[#64748B]"
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
                  {progressReports.length > 0 ? (
                    progressReports.map((report, i) => (
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

const DashboardCard = ({ title, subTitle, children }) => (
  <div className="bg-white p-5 md:p-6 rounded-3xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#EEF2F6] flex flex-col group h-full hover:border-[#E2E8F0]">
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-1 h-4 md:h-5 bg-[#DAA520] rounded-full group-hover:h-6 md:group-hover:h-8 group-hover:bg-[#0A4F48] transition-all duration-500 ease-out"></div>
        <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
          {title}
        </h3>
      </div>
      <button className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#0A4F48] border border-[#F1F5F9] rounded-lg text-[9px] md:text-[10px] font-bold text-[#64748B] uppercase tracking-wider transition-all duration-300">
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

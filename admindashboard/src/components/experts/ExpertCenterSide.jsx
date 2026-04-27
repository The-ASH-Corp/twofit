
import React, { useEffect, useMemo, useState } from "react";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Activity,
  MessageCircle,
  Layers,
  Users
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { getCoachRatingGraph } from "@/redux/features/coach/coach.thunk";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpertCenterSide = ({ expert }) => {
  const dispatch = useDispatch();
  const [ratingDuration, setRatingDuration] = useState("6");
  const [ratingGraphData, setRatingGraphData] = useState(null);
  const [showRatingMenu, setShowRatingMenu] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);


  // Mock programs logic if not available in expert object
  const expertPrograms = useMemo(() => {
    // If expert has programs array, use it. Otherwise, extract from assigned users or show mock.
    if (expert?.assignedPrograms && expert.assignedPrograms.length > 0) {
      return expert.assignedPrograms.map(s => ({
         title: s?.title,
         count: expert.assignedUsers?.filter(u => u.programType?._id === s?._id).length || 0
      }));
    }
    return expert.assignedTherapy?.map(s => ({
      title: s?.name,
      count: expert.assignedUsers?.filter(u => u.programType?._id === s?._id).length || 0
    }))

  }, [expert]);  
  const assignedClientsList = useMemo(() => {
     return expert?.assignedUsers || [];
  }, [expert]);

  // Pagination for Assigned Clients
  const [clientPage, setClientPage] = useState(1);
  const clientsPerPage = 5;
  const totalClientPages = Math.ceil((assignedClientsList?.length || 0) / clientsPerPage);
  
  const displayedClients = useMemo(() => {
      const list = assignedClientsList || [];
      const start = (clientPage - 1) * clientsPerPage;
      return list.slice(start, start + clientsPerPage);
  }, [assignedClientsList, clientPage]);

  const ratingData = useMemo(() => {
    if (!ratingGraphData?.ratingData?.length) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: "#F4DBC7",
            borderRadius: 6,
            barThickness: 50,
          },
        ],
      };
    }

    return {
      labels: ratingGraphData.ratingData.map((item) => item.month),
      datasets: [
        {
          data: ratingGraphData.ratingData.map((item) => item.rating),
          backgroundColor: (context) => {
            const index = context.dataIndex;
            if (index === hoveredBarIndex) return "#0A4F48";
            return "#E2E8F0"; // Default slate-200
          },
          hoverBackgroundColor: "#0A4F48",
          borderRadius: 8,
          barThickness: 40,
        },
      ],
    };
  }, [ratingGraphData, hoveredBarIndex]);

  const ratingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: (_, elements) => {
      if (elements?.length) {
        setHoveredBarIndex(elements[0].index);
      } else {
        setHoveredBarIndex(null);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#1E293B",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: () => null,
          label: (context) => `Rating: ${context.raw} / 5.0`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
            color: "#F1F5F9",
            drawBorder: false,
        },
        ticks: { stepSize: 1, color: "#94A3B8", font: { size: 10, weight: 'bold' }, padding: 10 },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 11, weight: '500' } },
        border: { display: false }
      },
    },
  };

  useEffect(() => {
    if (expert?._id) {
      dispatch(getCoachRatingGraph({ id: expert._id, duration: ratingDuration }))
        .unwrap()
        .then((data) => setRatingGraphData(data))
        .catch((err) => console.error(err));
    }
  }, [expert?._id, ratingDuration, dispatch]);


  return (
    <div className="flex flex-col gap-5 h-full min-h-0 pb-6">
      {/* 1. Rating Overview */}
      <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden shrink-0 min-h-80">
        <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0A4F48]">
              <Star size={20} className="stroke-2" />
            </div>
            <div>
              <h2 className="text-[#1E293B] font-bold text-lg tracking-tight leading-none">
                Rating Overview
              </h2>
              <p className="text-[11px] text-[#64748B] font-medium mt-1">
                Average client satisfaction over time
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRatingMenu(!showRatingMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] transition-all"
            >
              <span>Last {ratingDuration} Months</span>
              <ChevronDown size={14} />
            </button>

            {showRatingMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowRatingMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-[#E2E8F0] shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {["3", "6", "12"].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setRatingDuration(m);
                        setShowRatingMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#F8FAFC] transition-colors ${ratingDuration === m ? "text-[#0A4F48] bg-emerald-50" : "text-[#475569]"}`}
                    >
                      Last {m} Months
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-6 flex-1 w-full min-h-[220px]">
          <Bar data={ratingData} options={ratingOptions} />
        </div>
      </div>

      {/* 2. Programs */}
      <div className="bg-white rounded-3xl p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Layers size={18} />
            </div>
            <h3 className="font-bold text-[#1E293B] text-lg">Programs</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {expertPrograms.map((prog, i) => {
            const title =
              typeof prog === "string" ? prog : prog.title || "Program";
            const count =
              typeof prog === "object" && prog.count ? prog.count : null;

            return (
              <div
                key={i}
                className="flex-1 min-w-[140px] p-4 bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl flex flex-col items-center justify-center text-center hover:border-[#E2E8F0] hover:shadow-sm transition-all cursor-default group"
              >
                <span className="text-sm font-bold text-[#334155] mb-1 group-hover:text-[#0A4F48] transition-colors">
                  {title}
                </span>
                {count && (
                  <span className="text-[10px] font-medium text-[#94A3B8]">
                    {count} Active Clients
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Assigned Clients */}
      <div className="bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex-1 min-h-[400px] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <Users size={18} />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="font-bold text-[#1E293B] text-lg">
                Assigned Clients
              </h3>
              <span className="bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                {assignedClientsList.length} Total
              </span>
            </div>
          </div>
          {/* <button className="p-1.5 rounded-lg text-slate-400 hover:text-[#0A4F48] hover:bg-slate-50 transition-colors">
            <MoreHorizontal size={18} />
          </button> */}
        </div>

        <div className="flex-1 overflow-auto h-0 min-h-0">
          <table className="w-full min-w-[600px] border-collapse relative">
            <thead className="sticky top-0 z-10 bg-[#F8FAFC]">
              <tr className="border-b border-[#F1F5F9]">
                <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-6 pl-8">
                  Client Name
                </th>
                <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-4">
                  Program
                </th>
                <th className="text-center text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-4">
                  Compliance
                </th>
                <th className="text-right text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-6 pr-8">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {displayedClients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Users size={24} className="mb-2 opacity-50" />
                      <span className="text-xs font-medium">
                        No clients assigned yet
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedClients.map((client, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-4 px-6 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E2E8F0] border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-[#475569] shrink-0">
                          {client.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#334155] group-hover:text-[#0A4F48] transition-colors">
                            {client.name || "Unknown"}
                          </p>
                          <p className="text-[10px] text-[#94A3B8]">
                            {client.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600">
                        {client.programType?.title ||
                          client.program ||
                          "Standard Plan"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`text-sm font-bold ${
                            (client.compliance || 0) > 75
                              ? "text-emerald-600"
                              : (client.compliance || 0) > 40
                                ? "text-amber-500"
                                : "text-rose-500"
                          }`}
                        >
                          {client.compliance || 0}%
                        </span>
                        <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (client.compliance || 0) > 75
                                ? "bg-emerald-500"
                                : (client.compliance || 0) > 40
                                  ? "bg-amber-400"
                                  : "bg-rose-400"
                            }`}
                            style={{ width: `${client.compliance || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 pr-8 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          client.status?.toLowerCase() === "active" ||
                          client.isActive === true ||
                          !client.status
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            client.status?.toLowerCase() === "active" ||
                            client.isActive === true ||
                            !client.status
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {client.status?.toLowerCase() === "active" ||
                        client.isActive === true ||
                        !client.status
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalClientPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F5F9] bg-white shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#64748B]">
                Showing {(clientPage - 1) * clientsPerPage + 1}-
                {Math.min(
                  clientPage * clientsPerPage,
                  assignedClientsList.length,
                )}{" "}
                of {assignedClientsList.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setClientPage((c) => Math.max(1, c - 1))}
                disabled={clientPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalClientPages })
                .slice(0, 5)
                .map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setClientPage(idx + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      clientPage === idx + 1
                        ? "bg-[#0A4F48] text-white shadow-md shadow-emerald-900/10"
                        : "border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              <button
                onClick={() =>
                  setClientPage((c) => Math.min(totalClientPages, c + 1))
                }
                disabled={clientPage === totalClientPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertCenterSide;

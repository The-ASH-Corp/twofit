import React from "react";
import {
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpertCenterSide = ({ expert }) => {
  const ratingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        data: [3.8, 4.4, 3.2, 4.8, 4.2, 3.5, 4.3, 2.5],
        backgroundColor: (context) => {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value === 4.8 ? "#0A4F48" : "#F4DBC7";
        },
        borderRadius: 6,
        barThickness: 50,
      },
    ],
  };

  const ratingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#0A4F48",
        bodyColor: "#0A4F48",
        borderColor: "#eee",
        borderWidth: 1,
        displayColors: false,
        padding: 10,
        callbacks: {
          label: (context) => `★ ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1, color: "#66706D", font: { size: 10 } },
        grid: { color: "#F0F0F0", drawBorder: false },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: "#66706D", font: { size: 10 } },
      },
    },
  };

  const feedback = [
    {
      name: "Aarav Kumar",
      rating: 4,
      text: "Very supportive and clear guidance",
    },
    {
      name: "Lydia Thomas",
      rating: 4,
      text: "The meal plans are really easy to follow. The portions, timing, and substitutions are clearly explained, which makes it simple to stay consistent even on busy days",
    },
  ];

  const assignedClients = [
    {
      name: "Aarav Kumar",
      program: "Weight Loss",
      compliance: "78%",
      status: "Active",
    },
    {
      name: "Manoj S",
      program: "Thyroid",
      compliance: "82%",
      status: "Inactive",
    },
    {
      name: "Lydia Thomas",
      program: "PCOD",
      compliance: "63%",
      status: "Active",
    },
    {
      name: "George Philip",
      program: "Weight Gain",
      compliance: "71%",
      status: "Active",
    },
    {
      name: "Neha Sugathan",
      program: "Postpartum",
      compliance: "59%",
      status: "Inactive",
    },
    {
      name: "Aarav Kumar",
      program: "Weight Loss",
      compliance: "78%",
      status: "Active",
    },
    {
      name: "Aarav Kumar",
      program: "Weight Loss",
      compliance: "78%",
      status: "Active",
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6 px-1">
      {/* Rating Score Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-[#0A4F48]">Rating Score</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] border border-gray-100 rounded-lg text-xs font-medium text-[#66706D]">
            Last 8 Months <ChevronDown size={14} />
          </div>
        </div>
        <div className="h-48 relative">
          <Bar data={ratingData} options={ratingOptions} />
          {/* Threshold line */}
          <div className="absolute top-[18%] left-10 right-0 border-t border-dashed border-[#45C4A2] opacity-50 pointer-events-none"></div>
        </div>

        {/* Client Feedback Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#0A4F48]">
              Client Feedback
            </h3>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
          <div className="space-y-6">
            {feedback.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 pb-6 border-b border-gray-50 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[#66706D]">
                    {item.name}
                  </span>
                  <div className="flex text-[#FFD7A8]">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={10}
                        fill={idx < item.rating ? "currentColor" : "none"}
                        stroke={idx < item.rating ? "none" : "currentColor"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-[#011412] leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs & Chat Monitoring Row */}
      <div className=" gap-6 grid grid-cols-1 md:grid-cols-2">
        {/* Programs */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#0A4F48]">Programs</h3>
            <MoreHorizontal size={18} className="text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {expert?.assignedPrograms?.map((prog, i) => (
              <span
                key={i}
                className="px-5 py-2.5 bg-[#F8F9FA] rounded-xl text-xs font-medium text-[#011412]"
              >
                {prog.title}
              </span>
            )) ||
              ["PCOD", "Weight Loss", "Thyroid"].map((tag, i) => (
                <span
                  key={i}
                  className="px-5 py-2 bg-[#F8F9FA] rounded-lg text-xs font-medium text-[#011412]"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Chat Monitoring (Mini) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-[#0A4F48]">
              Chat Monitoring
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-[#0A4F48]">
                MK
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#66706D]">Therapist</span>
                <span className="text-[11px] font-semibold text-[#011412]">
                  Mira Kapoor
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[#0A4F48] p-2.5 rounded-lg text-white">
            <MessageSquare size={18} />
          </div>
        </div>
      </div>

      {/* Assigned Clients Table */}
      <div className="bg-white rounded-2xl shadow-sm flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-[#0A4F48]">
              Assigned Clients
            </h3>
            <span className="text-xs text-[#66706D] font-medium">
              14 <span className="mx-1 text-gray-300">|</span> Max 30
            </span>
          </div>
          <MoreHorizontal size={20} className="text-gray-400" />
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8F9FA] text-[10px] uppercase font-bold text-[#66706D] tracking-wider">
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Program</th>
              <th className="px-6 py-4">Compliance</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {assignedClients.map((client, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-xs font-medium text-[#011412]">
                  {client.name}
                </td>
                <td className="px-6 py-4 text-xs text-[#011412]">
                  {client.program}
                </td>
                <td className="px-6 py-4 text-xs font-bold text-[#011412]">
                  {client.compliance}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      client.status === "Active"
                        ? "bg-[#E7F9F4] text-[#00A389]"
                        : "bg-[#66706D] text-white"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#66706D]">Show</span>
            <div className="flex items-center gap-2 px-2 py-1 bg-[#F8F9FA] border border-gray-100 rounded text-xs font-medium text-[#66706D]">
              10 <ChevronDown size={12} />
            </div>
            <span className="text-xs text-[#66706D]">of 40 results</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-300 hover:text-[#0A4F48] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-md bg-[#0A4F48] text-white text-xs font-bold">
              1
            </button>
            <button className="w-8 h-8 rounded-md text-[#66706D] text-xs font-bold hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-md text-[#66706D] text-xs font-bold hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="w-8 h-8 rounded-md text-[#66706D] text-xs font-bold hover:bg-gray-50 transition-colors">
              5
            </button>
            <button className="p-1.5 text-[#0A4F48] hover:text-[#083a35] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCenterSide;

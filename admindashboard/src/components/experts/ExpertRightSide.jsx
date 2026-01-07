import React from "react";
import { MoreHorizontal, FileText } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpertRightSide = ({ expert }) => {
  const complianceData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: ["#0A4F48", "#EBF3F2", "#F4DBC7"],
        borderWidth: 0,
        cutout: "80%",
        borderRadius: 4,
        spacing: 2,
      },
    ],
  };

  const complianceOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const documents = [
    {
      name: "Employment_Contract_CliffVilliam_T1003.pdf",
      size: "2.4 MB",
    },
    {
      name: "Certification_EnglishTeaching_Cambridge_T1003.pdf",
      size: "1.8 MB",
    },
    {
      name: "ID_Passport_CliffVilliam_T1003.pdf",
      size: "2.2 MB",
    },
  ];

  return (
    <div className="w-[300px] flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6">
      {/* Response Time Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-[#0A4F48]">Response Time</h3>
          <button className="text-gray-400">
            <MoreHorizontal size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-[#F8F9FA] rounded-xl">
            <span className="text-xs text-[#66706D] font-medium">
              Average Response Time
            </span>
            <span className="text-sm font-bold text-[#011412] tracking-tight">
              {expert?.responseTime || "1h 12m"}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#F8F9FA] rounded-xl">
            <span className="text-xs text-[#66706D] font-medium">
              Fast Responses
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#66706D] pr-2 border-r border-gray-200">
                under 2h
              </span>
              <span className="text-xs font-bold text-[#0A4F48]">94%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Compliance Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-[#0A4F48]">
            Client Compliance
          </h3>
          <button className="text-gray-400">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="relative h-44 mb-8">
          <Doughnut data={complianceData} options={complianceOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-[#66706D] font-medium">
              Avg Compliance
            </span>
            <span className="text-2xl font-bold text-[#011412]">73%</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "High", count: 12, percent: "55%", color: "bg-[#0A4F48]" },
            {
              label: "Medium",
              count: 19,
              percent: "30%",
              color: "bg-[#EBF3F2]",
            },
            { label: "Low", count: 10, percent: "15%", color: "bg-[#F4DBC7]" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl relative overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.color}`}
              ></div>
              <span className="text-xs font-bold text-[#011412] ml-1">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#66706D] font-medium pr-2 border-r border-gray-200">
                  {item.count} clients
                </span>
                <span className="text-xs font-bold text-[#011412]">
                  {item.percent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-[#0A4F48]">Documents</h3>
          <button className="text-gray-400">
            <MoreHorizontal size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {(expert?.certifications
            ? [{ name: expert.certifications, size: "2.4 MB" }]
            : documents
          ).map((doc, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="p-2.5 bg-[#FAF3E0] rounded-lg text-[#DAA520]">
                <FileText size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#011412] truncate">
                  {doc.name}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-[#66706D]">
                  <span className="uppercase">PDF</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertRightSide;

import React from "react";
import DonutChart from "./AdminChart";

const HeadRightSide = ({ Head }) => {
  // Mock performance data matching the design
  const performanceData = {
    programs: 50,
    experts: 20,
    clients: 30,
    average: 73, // Center text value from design usually represents an average or total
  };

  const metrics = [
    { label: "Programs", value: "50%", color: "bg-[#0A4F48]" },
    { label: "Experts", value: "20%", color: "bg-[#EBF3F2]" },
    { label: "Clients", value: "30%", color: "bg-[#F4DBC7]" },
  ];

  return (
    <div className=" flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-6 flex flex-col shadow-sm ">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[#0A4F48] font-bold text-lg">Performance</h2>
        </div>

        {/* Chart Section */}
        <div className="flex flex-col items-center gap-0">
          <div className="">
            <DonutChart
              percentage={performanceData.average}
              high={performanceData.programs}
              medium={performanceData.experts}
              low={performanceData.clients}
              size={180}
            />
          </div>

          {/* Legend Table */}
          <div className="w-full flex flex-col">
            {metrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between py-5">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-sm ${metric.color}`}></div>
                  <span className="text-[#66706D] text-sm font-medium">
                    {metric.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadRightSide;

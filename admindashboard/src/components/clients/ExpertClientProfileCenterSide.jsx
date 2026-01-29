import { assets } from "@/assets/asset";
import React from "react";

const ExpertClientProfileCenterSide = ({ client, clientComplianceStats }) => {
  const healthDetails = [
    {
      heading: "Medical Conditions",
      data: client?.medicalConditions?.length
        ? client.medicalConditions.join(", ")
        : "None",
    },
    {
      heading: "Allergies",
      data: client?.allergies?.length ? client.allergies.join(", ") : "None",
    },
    {
      heading: "Food Preference",
      data: client?.foodPreferences || "Veg",
    },
    {
      heading: "Fitness Goal",
      data: client?.goals || client?.programType?.title || "Weight Loss",
    },
    {
      heading: "Current Weight",
      data: client?.currentWeight ? `${client.currentWeight} kg` : "N/A",
    },
    {
      heading: "Target Weight",
      data: client?.targetWeight ? `${client.targetWeight} kg` : "N/A",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 pb-4">
      {/* Health Details */}
      <div className="p-6 flex flex-col items-center gap-4 w-full bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#0A4F48]">
            Health Details
          </h2>
          <button>
            <img
              src={assets.threeDotVector}
              alt="dot menu"
              className="w-[18px]"
            />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          {healthDetails.map((item, i) => (
            <div
              key={i}
              className="p-4 bg-[#F8F8F8] rounded-lg w-full flex flex-col gap-2"
            >
              <span className="px-2 py-1 bg-[#F0F0F0] text-[11px] text-[#66706D] rounded-md w-max">
                {item.heading}
              </span>
              <span className="text-[13px] text-[#0A4F48] font-medium break-words">
                {item.data}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Program Summary */}
      <div className="p-6 flex flex-col items-center gap-4 w-full bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#0A4F48]">
            Program Summary
          </h2>
          <button>
            <img
              src={assets.threeDotVector}
              alt="dot menu"
              className="w-[18px]"
            />
          </button>
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="p-4 bg-[#F8F8F8] rounded-lg w-1/2 flex flex-col gap-1">
            <span className="text-[12px] text-[#66706D]">Program Type</span>
            <span className="text-[14px] font-bold text-[#1E1E1E]">
              {client?.programType?.title || "N/A"}
            </span>
          </div>
          <div className="p-4 bg-[#F8F8F8] rounded-lg w-1/2 flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <span className="text-[12px] text-[#66706D]">Plan Duration</span>
              <span className="text-[12px] text-[#66706D]">
                <span className="text-[#0A4F48] font-bold">0%</span> / 100%
              </span>
            </div>
            <div className="w-full">
              <span className="text-[14px] font-bold text-[#1E1E1E]">
                {client?.duration} Days
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#0A4F48] rounded-full"
                style={{ width: `0%` }} // Dynamic width based on progress if available
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="w-full flex flex-col items-center gap-4 p-6 bg-white rounded-lg min-h-[200px]">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#0A4F48]">Tasks</h2>
          <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-md cursor-pointer">
            <span className="text-[12px] text-[#1E1E1E] font-medium">
              All Status
            </span>
            <img src={assets.downVector} alt="arrow" className="w-2.5" />
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center flex-1 h-full py-8">
          <span className="text-[#66706D] text-[14px]">No Data Found</span>
        </div>
      </div>
    </div>
  );
};

export default ExpertClientProfileCenterSide;

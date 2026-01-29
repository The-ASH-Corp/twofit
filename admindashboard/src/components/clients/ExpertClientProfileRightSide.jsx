import { assets } from "@/assets/asset";
import React from "react";

const ExpertClientProfileRightSide = ({ client }) => {
  const measurements = [
    { label: "Chest", before: "98 cm", current: "0 cm", color: "#0A4F48" },
    { label: "Waist", before: "92 cm", current: "0 cm", color: "#F4DBC7" }, // Using color from image
    { label: "Hips", before: "101 cm", current: "0 cm", color: "#EBF3F2" },
  ];

  return (
    <div className="flex flex-col items-center gap-4 pb-4">
      {/* Weight Progress */}
      <div className="flex flex-col items-center w-full p-6 bg-white rounded-lg gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#0A4F48]">
            Weight Progress
          </h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[18px]" />
          </button>
        </div>
        <div className="w-full bg-[#F8F8F8] rounded-lg flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-[13px] text-[#1E1E1E]">Today</span>
            <span className="text-[14px] font-bold text-[#0A4F48]">0 kg</span>
          </div>
          <div className="flex flex-col w-full gap-3 border-t border-[#DBDEDD] pt-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-[13px] text-[#66706D]">Start</span>
              <span className="text-[13px] font-medium text-[#1E1E1E]">
                {client?.currentWeight ? `${client.currentWeight} kg` : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[13px] text-[#66706D]">Change</span>
              <span className="text-[13px] font-medium text-[#1E1E1E]">
                0 kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="flex flex-col items-center w-full p-6 bg-white rounded-lg gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#0A4F48]">Measurements</h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[18px]" />
          </button>
        </div>
        <div className="flex flex-col items-center w-full gap-3">
          {measurements.map((item, i) => (
            <div
              key={i}
              className="flex w-full items-stretch rounded-lg bg-[#F8F8F8] overflow-hidden"
            >
              <div
                className="w-1.5"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1 flex justify-between items-center p-3 pl-3">
                <span className="text-[13px] text-[#1E1E1E] font-medium">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#66706D]">
                    Before <span className="text-[#1E1E1E]">{item.before}</span>
                  </span>
                  <div className="h-3 w-[1px] bg-[#DBDEDD]"></div>
                  <span className="text-[13px] text-[#0A4F48] font-bold">
                    {item.current}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Activity Log */}
      <div className="flex flex-col items-center w-full gap-4 p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#0A4F48]">
            Daily Activity Log
          </h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertClientProfileRightSide;

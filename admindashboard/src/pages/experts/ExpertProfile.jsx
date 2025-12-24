import { assets } from "@/assets/asset";
import ExpertCenterSide from "@/components/experts/ExpertCenterSide";
import ExpertLeftSide from "@/components/experts/ExpertLeftSide";
import React from "react";

const clientCompliance = [
  {
    title: "High ",
    clients: "12 clients",
    percentage: "55%",
    color: "#0A4F48",
  },
  {
    title: "Medium ",
    clients: "19 clients",
    percentage: "30%",
    color: "#EBF3F2",
  },
  {
    title: "Low ",
    clients: "10 clients",
    percentage: "15%",
    color: "#F4DBC7",
  },
];


const ExpertProfile = () => {
  return (
    <div className="flex justify-between w-full gap-4 h-[calc(100vh-120px)]">
      {/* left */}
      <ExpertLeftSide />
      {/* center */}
      <ExpertCenterSide />
      {/* right */}
      <div className="w-[25%] flex flex-col items-center gap-4 overflow-auto  no-scrollbar">
        {/* Response Time */}
        <div className="w-full flex flex-col gap-3 items-center bg-white rounded-lg p-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-[#0A4F48] font-bold text-[16px]">
              Response Time
            </h2>
            <button>
              <img
                src={assets.threeDotVector}
                alt="dot menu"
                className="w-3.5"
              />
            </button>
          </div>
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-full bg-[#F8F8F8] p-3 flex justify-between items-center rounded-md">
              <span className="text-[11px] text-[#66706D]">
                Average Response Time
              </span>
              <span className="text-[12px] ">1h 12m</span>
            </div>
            <div className="w-full bg-[#F8F8F8] p-3 flex justify-between items-center rounded-md">
              <span className="text-[11px] text-[#66706D]">Fast Responses</span>
              <div>
                <span className="text-[12px] text-[#66706D] px-1.5 border-r border-r-[#DBDEDD]">
                  under 2h
                </span>
                <span className="px-1.5 text-[11px] font-bold text-[#0A4F48]">
                  94%
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Client Compliance */}
        <div className="w-full flex flex-col gap-8 items-center bg-white rounded-lg p-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-[#0A4F48] font-bold text-[16px]">
              Client Compliance
            </h2>
            <button>
              <img
                src={assets.threeDotVector}
                alt="dot menu"
                className="w-3.5"
              />
            </button>
          </div>
          <div className="w-full flex flex-col items-center gap-10">
            <div>x</div>
            <div className="flex flex-col items-center w-full gap-2.5">
              {clientCompliance.map((items, i) => (
                <div
                  key={i}
                  className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]"
                >
                  <div
                    className="absolute left-0 top-0 w-2 h-full  rounded-xs"
                    style={{ background: items.color }}
                  ></div>
                  <div className="w-full flex items-center justify-between">
                    <p className="text-[12px] ">{items.title}</p>
                    <div>
                      <span className="text-[12px] text-[#66706D] px-1.5 border-r border-r-[#DBDEDD]">
                        {items.clients}
                      </span>
                      <span className="px-1.5 text-[11px] font-bold text-[#0A4F48]">
                        {items.percentage}
                      </span>
                    </div>
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

export default ExpertProfile;

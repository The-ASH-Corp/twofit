import { assets } from '@/assets/asset';
import React from 'react'
import DonutChart from './Chart';

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

const ExpertRightSide = () => {
  return (
    <div className="w-[25%] flex flex-col items-center gap-4 overflow-auto  no-scrollbar">
      {/* Response Time */}
      <div className="w-full flex flex-col gap-3 items-center bg-white rounded-lg p-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#0A4F48] font-bold text-[16px]">
            Response Time
          </h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
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
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
        <div className="w-full flex flex-col items-center gap-10">
          <div>
            <DonutChart percentage={73} high={55} medium={30} low={15} />
          </div>
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
      {/* Documents */}
      <div className="w-full bg-white rounded-lg p-4 flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#0A4F48] font-bold text-[16px]">Documents</h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
        <div className="w-full flex flex-col items-center gap-5.5">
          {documents.map((items, i) => (
            <div
              key={i}
              className="w-full flex items-center gap-4 justify-start"
            >
              <div className="bg-[#F4DBC7] p-2 rounded-md">
                <img
                  src={assets.pdfVector}
                  alt="pdf vector"
                  className="w-4 h-4"
                />
              </div>
              <div>
                <p className="text-[12px]">{items.name}</p>
                <p className="text-[11px] text-[#66706D] flex items-center gap-1">
                  PDF{" "}
                  <span className="bg-[#DBDEDD] inline-block w-1 h-1 rounded-full"></span>
                  {items.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpertRightSide
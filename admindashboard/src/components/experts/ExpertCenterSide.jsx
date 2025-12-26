import { assets } from '@/assets/asset';
import React from 'react'

const Programs = [
  {
    title: "PCOD",
  },
  {
    title: "Weight Loss",
    template: "V2 Template",
  },
  {
    title: "Thyroid",
  },
];

const ExpertCenterSide = () => {
  return (
    <div className="w-[50%] flex flex-col items-center gap-4 overflow-auto  no-scrollbar ">
      {/* Programs */}
      <div className="w-full flex flex-col gap-3 items-center bg-white rounded-lg p-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#0A4F48] font-bold text-[16px]">
            Personal Info
          </h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
        <div className="w-full flex flex-col items-center gap-3">
          {Programs.map((items, i) => (
            <div
              key={i}
              className="w-full bg-[#F8F8F8] p-3 flex justify-between items-center rounded-md"
            >
              <span className="text-[12px]">{items.title}</span>
              <span className="text-[11px] text-[#66706D]">
                {items.template}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExpertCenterSide
import React from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import { assets } from "@/assets/asset";

const healthDetails = [
  {
    heading: "Medical Conditions",
    data: ["PCOD", "Thyroid"],
  },
  {
    heading: "Allergies",
    data: ["Peanut", "Dairy"],
  },
  {
    heading: "Food Preference",
    data: ["Veg"],
  },
  {
    heading: "Fitness Goal",
    data: ["Weight Loss"],
  },
  {
    heading: "Current Weight",
    data: ["80.2 kg"],
  },
  {
    heading: "Target Weight",
    data: ["72 kg"],
  },
];

const ClientProfile = () => {
  return (
    <div className="flex justify-between w-full gap-4 ">
      {/* left */}
      <ProfileLeftSide />
      {/* center */}
      <div className="w-[50%] flex flex-col items-center gap-4">
        {/* Health Details */}
        <div className="p-4 flex flex-col items-center gap-4 w-full bg-white rounded-lg">
          <div className="w-full flex justify-between items-center">
            <h2 className="font-bold text-[16px] text-[#0A4F48]">
              Health Details
            </h2>
            <button>
              <img
                src={assets.threeDotVector}
                alt="dot menu"
                className="w-3.5"
              />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {healthDetails.map((items) => (
              <div className="p-3.5 bg-[#F8F8F8] rounded-lg w-full">
                <div className="w-full flex flex-col items-start gap-2">
                  <span className="px-1.5 py-1 bg-[#F0F0F0] text-[11px] rounded-sm">
                    {items.heading}
                  </span>
                  <span className="text-[12px] text-[#0A4F48] ">
                    {items.data.join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Program Summary */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-full flex justify-between items-center">
            <h2 className="font-bold text-[16px] text-[#0A4F48]">
              Health Details
            </h2>
            <button>
              <img
                src={assets.threeDotVector}
                alt="dot menu"
                className="w-3.5"
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-[7.5px] w-full">
          <div className="p-4 bg-white rounded-lg w-full">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[11px] text-[#66706D]">Program Type</span>
              <span className="font-bold text-[12px]">Weight Loss</span>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg w-full">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[11px] text-[#66706D]">Plan Version</span>
              <span className="font-bold text-[12px]">V2</span>
            </div>
          </div>
          <div className="flex items-center gap-6 p-4 bg-white rounded-lg w-full">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[11px] text-[#66706D]">Program Type</span>
              <span className="font-bold text-[12px]">Weight Loss</span>
            </div>
            <div>
              dfghj
            </div>
          </div>
        </div>
        {/* Today’s Task */}
        <div></div>
      </div>
      {/* right */}
      <div className="w-[25%] bg-amber-200"></div>
    </div>
  );
};

export default ClientProfile;

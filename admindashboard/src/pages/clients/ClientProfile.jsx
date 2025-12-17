import React from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import { assets } from "@/assets/asset";

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
            <div className="p-3.5 bg-[#F8F8F8] rounded-lg w-full">
              <div className="w-full flex flex-col items-start gap-2">
                <span className="p-1.5 bg-[#F0F0F0] text-[11px] ">
                  Medical Conditions
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Program Summary */}
        <div></div>
        {/* Today’s Task */}
        <div></div>
      </div>
      {/* right */}
      <div className="w-[25%] bg-amber-200"></div>
    </div>
  );
};

export default ClientProfile;

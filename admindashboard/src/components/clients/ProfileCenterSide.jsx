import { assets } from '@/assets/asset';
import React from 'react'



const assignedExperts = [
  {
    img: assets.tickVector,
    heading: "Breakfast",
    contend: "Overnight Oats with Apple Cinnamon...",
    status: "Completed",
  },
  {
    img: assets.tickVector,
    heading: "Breakfast",
    contend: "Overnight Oats with Apple Cinnamon...",
    status: "Pending",
  },
  {
    img: assets.tickVector,
    heading: "Breakfast",
    contend: "Overnight Oats with Apple Cinnamon...",
    status: "Missed",
  },
  {
    img: assets.tickVector,
    heading: "Breakfast",
    contend: "Overnight Oats with Apple Cinnamon...",
    status: "Pending",
  },
  {
    img: assets.tickVector,
    heading: "Breakfast",
    contend: "Overnight Oats with Apple Cinnamon...",
    status: "Completed",
  },
  {
    img: assets.tickVector,
    heading: "Breakfast",
    contend: "Overnight Oats with Apple Cinnamon...",
    status: "Skipped",
  },
];

const statusStyles = {
  Completed: {
    bg: "#E6F4F1",
    textsColor: "#137528",
    border: "#B7DFBA",
  },
  Skipped: {
    bg: "#FFFAE0",
    textsColor: "#936900",
    border: "#F8D87B",
  },
  Missed: {
    bg: "#FFF0ED",
    textsColor: "#B13116",
    border: "#FAC6BD",
  },
  Pending: {
    bg: "#F2F3F5",
    textsColor: "#54595D",
    border: "#D7DCDF",
  },
};

const ProfileCenterSide = ({ client }) => {

  const healthDetails = [
    {
      heading: "Medical Conditions",
      data: client.medicalConditions,
    },
    {
      heading: "Allergies",
      data: client.allergies,
    },
    {
      heading: "Food Preference",
      data: ["Veg"],
    },
    {
      heading: "Fitness Goal",
      data: [client.goals],
    },
    {
      heading: "Current Weight",
      data: [`${client.currentWeight} kg`],
    },
    {
      heading: "Target Weight",
      data: [`${client.targetWeight} kg`],
    },
  ];

  return (
    <div className="w-[50%] flex flex-col items-center gap-4 overflow-auto  no-scrollbar">
      {/* Health Details */}
      <div className="p-4 flex flex-col items-center gap-4 w-full bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#0A4F48]">
            Health Details
          </h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
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
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center  gap-[7.5px] w-full">
        <div className="p-4 bg-white rounded-2xl w-[50%]">
          <div className="flex flex-col items-start gap-1 ">
            <span className="text-[11px] text-[#66706D]">Program Type</span>
            <span className="font-bold text-[12px]">{client.goals}</span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl w-[50%]">
          <div className="flex flex-col items-start gap-1 ">
            <span className="text-[11px] text-[#66706D]">Plan Version</span>
            <span className="font-bold text-[12px]">V2</span>
          </div>
        </div>
        <div className="flex items-center gap-6 p-4 bg-white rounded-2xl w-full">
          <div className="flex flex-col items-start gap-1 w-full">
            <span className="text-[11px] text-[#66706D]">Plan Duration</span>
            <span className="font-bold text-[12px]">
              {client.duration} Days
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 w-full">
            <p className="text-[12px] text-[#66706D]">
              <span className="text-[#0A4F48] font-bold">40%</span> / 100%
            </p>
            <div className="relative w-25 bg-gray-200 rounded-full h-2 overflow-visible">
              <div
                className="h-full bg-[#F4DBC7] transition-all duration-500 ease-out rounded-l-full"
                style={{ width: `40%` }}
              />
              <span className="absolute left-[40%] -top-0.5 w-0.5 h-3 bg-[#0A4F48]"></span>
            </div>
          </div>
        </div>
      </div>
      {/* Today’s Task */}
      <div className="w-full flex flex-col items-center gap-4 p-4 bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#0A4F48]">
            Health Details
          </h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
        <div className="w-full flex flex-col items-center">
          {assignedExperts.map((items) => {
            const styles = statusStyles[items.status] || statusStyles.Pending;
            return (
              <div className="flex items-center justify-between w-full py-4 border-b border-b-[#DBDEDD]">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-full "
                    style={{ backgroundColor: styles.bg }}
                  >
                    <img src={items.img} alt="" className="w-[17px] h-[17px]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] text-[#0A4F48] font-bold">
                      {items.heading}
                    </span>
                    <span className="text-[12px]">{items.contend}</span>
                  </div>
                </div>
                <div
                  className="border  px-2 py-0.5 rounded-full flex items-center"
                  style={{
                    background: styles.bg,
                    borderColor: styles.border,
                  }}
                >
                  <span
                    className=" text-[11px] "
                    style={{ color: styles.textsColor }}
                  >
                    {items.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileCenterSide
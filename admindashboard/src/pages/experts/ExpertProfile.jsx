import { assets } from '@/assets/asset';
import React from 'react'

const profile = [
  {
    title: "Joined Date",
    content: "14 Feb 2023",
  },
  {
    title: "Working Days",
    content: "Mon - Fri",
  },
  {
    title: "Working Hours",
    content: "9 - 6",
  },
  {
    title: "Base Salary",
    content: "₹34,200/m",
  },
];

const profileInfo = [
  {
    img: assets.GenderVector,
    title: "Gender",
    data: "Female",
  },
  {
    img: assets.AgeVector,
    title: "Age",
    data: "32 y/o",
  },
  {
    img: assets.EmailVector,
    title: "Email Address",
    data: "Aarav@gmail.com",
  },
  {
    img: assets.PhoneVector,
    title: "Phone Number",
    data: "+62 811 5567 2345",
  },
  {
    img: assets.HomeVector,
    title: "Address",
    data: "221B Baker Street, London, United Kingdom",
  },
];

const ExpertProfile = () => {
  return (
    <div className="flex justify-between w-full gap-4 h-[calc(100vh-120px)]">
      {/* left */}
      <div className="w-[25%] flex flex-col items-center gap-4 overflow-auto  no-scrollbar bg-amber-200">
        {/* profile */}
        <div className="relative bg-white rounded-lg p-4 pt-7.5 w-full flex flex-col items-center gap-5">
          <img
            src={assets.threeDotVector}
            alt=""
            className="absolute top-7.5 right-5"
          />
          <div className="flex flex-col items-center gap-3 pt-5">
            <h2 className="font-bold text-[16px] ">Aarav Kumar </h2>
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full">
                Dietitian
              </span>
              <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full flex items-center gap-0.5">
                <img src={assets.star} alt="star" />
                4.7
              </span>
              <span className="px-2 py-0.5 bg-[#45C4A2] rounded-full text-white">
                Active
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2.5 w-full">
            {profile.map((items) => (
              <div className="flex justify-between items-center w-full p-3 bg-[#F8F8F8] rounded-lg">
                <p className="text-[#66706D] text-[12px] ">{items.title}</p>
                <p className="text-[12px]">{items.content}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Personal Info */}
        <div className="p-4 w-full bg-white rounded-lg flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-[#0A4F48] font-bold text-[16px]">
              Personal Info
            </h2>
            <button>
              <img
                src={assets.threeDotVector}
                alt="dot menu"
                className="w-3.5"
              />
            </button>
          </div>
          <div className="flex flex-col items-start gap-4 w-full">
            {profileInfo.map((items) => (
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#EBF3F2] rounded-full">
                  <img src={items.img} alt="" className="w-3.5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-[#66706D]">
                    {items.title}
                  </span>
                  <span className="text-[12px]">{items.data}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Role & Specialization */}
        <div className="flex flex-col items-center bg-white w-full rounded-lg p-4">
          <div className="flex justify-start w-full">
            <h3 className="text-[#0A4F48] font-bold text-[16px]">
              Role & Specialization
            </h3>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full bg-[#F8F8F8] p-3.5 rounded-lg">
                ddfgh
            </div>
          </div>
        </div>
      </div>
      {/* center */}
      <div className="w-[50%] flex flex-col items-center overflow-auto  no-scrollbar bg-amber-500"></div>
      {/* right */}
      <div className="w-[25%] flex flex-col items-center overflow-auto  no-scrollbar bg-amber-300"></div>
    </div>
  );
}

export default ExpertProfile
import { assets } from '@/assets/asset';
import React from 'react'

const ExpertLeftSide = ({ expert }) => {
  console.log("expert left side:", expert);

const profile = [
  {
    title: "Joined Date",
    content: expert?.createdAt?.split("T")[0],
  },
  {
    title: "Working Days",
    content: expert?.workingDays?.map((day) => day.charAt(0).toUpperCase() + day.slice(1)).join(", "),
  },
  {
    title: "Working Hours",
    content: `${expert?.workingHours[0]?.startTime} - ${expert?.workingHours[0]?.endTime}`,
  },
  {
    title: "Base Salary",
    content: `₹${expert?.salary}/m`,
  },
];


const profileInfo = [
  {
    img: assets.GenderVector,
    title: "Gender",
    data: expert?.gender,
  },
  {
    img: assets.AgeVector,
    title: "Age",
    data: new Date().getFullYear() - new Date(expert?.dob).getFullYear(),
  },
  {
    img: assets.EmailVector,
    title: "Email Address",
    data: expert?.email,
  },
  {
    img: assets.PhoneVector,
    title: "Phone Number",
    data: expert?.phone,
  },
  {
    img: assets.HomeVector,
    title: "Address",
    data: expert?.address,
  },
];

  const roleAndSpecialization = [
    {
      title: "Role",
      content: expert?.role.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", "),
    },
    {
      title: "Specialization",
      content: expert?.specialization,
    },
    {
      title: "Experience",
      content: expert?.experience,
    },
    {
      title: "Certifications",
      content: expert?.qualification,
    },
    {
      title: "Languages",
      content: expert?.languages.map((lang) => lang.charAt(0).toUpperCase() + lang.slice(1)).join(", "),
    },
  ];
  return (
    <div className="w-[25%] flex flex-col items-center gap-4 overflow-auto  no-scrollbar">
      {/* profile */}
      <div className="relative bg-white rounded-lg p-4 pt-7.5 w-full flex flex-col items-center gap-5">
        <img
          src={assets.threeDotVector}
          alt=""
          className="absolute top-7.5 right-5"
        />
        <div className="flex flex-col items-center gap-3 pt-5">
          <h2 className="font-bold text-[16px] ">{expert?.name}</h2>
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full">
              {expert?.role[0].charAt(0).toUpperCase() + expert?.role[0].slice(1)}
            </span>
            <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full flex items-center gap-0.5">
              <img src={assets.star} alt="star" />
              {expert?.rating || "0"}
            </span>
            <span className="px-2 py-0.5 bg-[#45C4A2] rounded-full text-white">
              {expert?.status}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2.5 w-full">
          {profile.map((items, i) => (
            <div
              key={i}
              className="flex justify-between items-center w-full p-3 bg-[#F8F8F8] rounded-lg"
            >
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
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
        <div className="flex flex-col items-start gap-4 w-full">
          {profileInfo.map((items, i) => (
            <div key={i} className="flex items-start gap-4">
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
      <div className="flex flex-col items-center bg-white w-full rounded-lg p-4 gap-4">
        <div className="flex justify-start w-full">
          <h3 className="text-[#0A4F48] font-bold text-[16px]">
            Role & Specialization
          </h3>
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          {roleAndSpecialization.map((items, i) => (
            <div
              key={i}
              className="w-full bg-[#F8F8F8] p-3.5 rounded-lg flex flex-col items-start gap-2"
            >
              <span className="px-1.5 py-0.5 bg-[#F0F0F0] text-[11px] rounded-sm">
                {items.title}
              </span>
              <span className="text-[12px] text-[#0A4F48]">
                {items.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertLeftSide
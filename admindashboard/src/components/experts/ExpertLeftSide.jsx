import React from "react";
import {
  MoreHorizontal,
  Star,
  MessageSquare,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const ExpertLeftSide = ({ expert }) => {
  const profileDetails = [
    {
      label: "Joined Date",
      value: expert?.createdAt?.split("T")[0] || "14 Feb 2023",
    },
    {
      label: "Working Days",
      value:
        expert?.workingDays
          ?.map((day) => day.charAt(0).toUpperCase() + day.slice(1))
          .join(" - ") || "Mon - Fri",
    },
    {
      label: "Working Hours",
      value: `${expert?.workingHours?.[0]?.startTime || "9"} - ${
        expert?.workingHours?.[0]?.endTime || "6"
      }`,
    },
    { label: "Base Salary", value: `₹${expert?.salary || "34,200"}/m` },
  ];

  const personalInfo = [
    {
      icon: <User size={16} />,
      label: "Gender",
      value: expert?.gender || "Female",
    },
    {
      icon: <Calendar size={16} />,
      label: "Age",
      value: `${
        new Date().getFullYear() -
        new Date(expert?.dob || "1994-01-01").getFullYear()
      } y/o`,
    },
    {
      icon: <Mail size={16} />,
      label: "Email Address",
      value: expert?.email || "priya.m@gmail.com",
    },
    {
      icon: <Phone size={16} />,
      label: "Phone Number",
      value: expert?.phone || "+91 98472 11238",
    },
    {
      icon: <MapPin size={16} />,
      label: "Address",
      value: expert?.address || "221B Baker Street, London, United Kingdom",
    },
  ];

  const specialization = [
    { label: "Role", content: expert?.role?.[0] || "Dietitian" },
    {
      label: "Specialization",
      content:
        expert?.specialization ||
        "PCOD Diet Plans, Therapeutic Diets, Weight-loss Programs, Thyroid",
    },
    { label: "Experience", content: expert?.experience || "7 Years" },
    {
      label: "Certifications",
      content: expert?.qualification || "M.Sc. Clinical Nutrition",
    },
    {
      label: "Languages",
      content:
        expert?.languages
          ?.map((l) => l.charAt(0).toUpperCase() + l.slice(1))
          .join(", ") || "English, Hindi, Malayalam",
    },
  ];

  return (
    <div className="w-[280px] flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm relative flex flex-col items-center">
        <button className="absolute top-4 right-4 text-gray-400">
          <MoreHorizontal size={20} />
        </button>

        <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-[#0A4F48] font-bold text-2xl">
          {expert?.name?.[0]}
        </div>

        <h2 className="text-lg font-bold text-[#011412] mb-3">
          {expert?.name || "Priya Menon"}
        </h2>

        <div className="flex gap-2 mb-6">
          <span className="px-3 py-1 bg-[#F8F9FA] rounded-full text-[10px] font-bold text-[#66706D] uppercase tracking-wider">
            {expert?.role?.[0] || "Dietitian"}
          </span>
          <span className="px-3 py-1 bg-[#FAF3E0] rounded-full text-[10px] font-bold text-[#DAA520] flex items-center gap-1">
            <Star size={10} fill="currentColor" /> {expert?.rating || "0"}
          </span>
          <span className="px-3 py-1 bg-[#E7F9F4] rounded-full text-[10px] font-bold text-[#00A389]">
            {expert?.status || "Active"}
          </span>
        </div>

        <div className="w-full space-y-2">
          {profileDetails.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-xs text-[#66706D] font-medium">
                {item.label}
              </span>
              <span className="text-xs font-bold text-[#0A4F48]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Monitoring */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0A4F48] mb-1">
          Chat Monitoring
        </h3>
        <p className="text-[10px] text-[#66706D] mb-4">
          Monitor expert-client chats
        </p>
        <button className="w-full py-2.5 bg-[#0A4F48] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#083a35] transition-colors">
          <MessageSquare size={16} /> View Chat
        </button>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-[#0A4F48]">Personal Info</h3>
          <button className="text-gray-400">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {personalInfo.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EBF3F2] flex items-center justify-center text-[#0A4F48] shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#66706D] font-medium">
                  {item.label}
                </span>
                <span className="text-[11px] font-bold text-[#011412] leading-tight mt-0.5">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role & Specialization */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0A4F48] mb-6">
          Role & Specialization
        </h3>
        <div className="space-y-5">
          {specialization.map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="w-fit px-2 py-0.5 bg-[#F8F9FA] text-[10px] font-bold text-[#66706D] rounded">
                {item.label}
              </span>
              <p className="text-[11px] font-bold text-[#0A4F48] leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertLeftSide;

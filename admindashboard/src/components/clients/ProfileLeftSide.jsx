<<<<<<< .merge_file_eognqn
import { assets } from "@/assets/asset";
import React from "react";

const ProfileLeftSide = ({ client, complianceStats }) => {

  const [year, ,] = client?.dob?.split("-") || [];
  const today = new Date();

  let age = year ? today.getFullYear() - year : null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // const profileInfo = [
  //   {
  //     img: assets.GenderVector,
  //     title: "Gender",
  //     data: client?.gender,
  //   },
  //   {
  //     img: assets.AgeVector,
  //     title: "Age",
  //     data: age + " y/o",
  //   },
  //   {
  //     img: assets.EmailVector,
  //     title: "Email Address",
  //     data: client?.email,
  //   },
  //   {
  //     img: assets.PhoneVector,
  //     title: "Phone Number",
  //     data: client?.phone,
  //   },
  //   {
  //     img: assets.HomeVector,
  //     title: "Address",
  //     data: client?.address,
  //   },
  // ];

  // const compliance = [
  //   {
  //     title: "Diet",
  //     Missed: `Missed Diet: ${
  //       (complianceStats?.stats?.missedCount || 0) +
  //       (complianceStats?.stats?.skippedCount || 0)
  //     }`,
  //     percentage: `${(() => {
  //       const missed = complianceStats?.stats?.missedCount || 0;
  //       const skipped = complianceStats?.stats?.skippedCount || 0;
  //       const expected = complianceStats?.stats?.expectedMeals || 0;
  //       if (expected === 0) return 0;
  //       return (((missed + skipped) / expected) * 100).toFixed(0);
  //     })()}%`,
  //     color: "#0A4F48",
  //   },
  //   {
  //     title: "Workout",
  //     Missed: "Missed Workout: 0",
  //     percentage: "0%",
  //     color: "#EBF3F2",
  //   },
  //   {
  //     title: "Therapy",
  //     Missed: "Missed Therapy: 0",
  //     percentage: "0%",
  //     color: "#F4DBC7",
  //   },
  // ];

  const assignedExperts = [
    {
      img: assets.profileVector,
      coach: "Trainer",
      name: client?.trainer?.name || "N/A",
    },
    {
      img: assets.profileVector,
      coach: "Dietitian",
      name: client?.dietition?.name || "N/A",
    },
    {
      img: assets.profileVector,
      coach: "Therapist",
      name: client?.therapist?.name || "N/A",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Client Identity Card */}
      <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden group">
         {/* Banner/Header */}
         <div className="h-24 bg-linear-to-r from-[#0A4F48] to-[#116D63] relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
             <div className="absolute top-3 right-3">
                 <span className={`px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider backdrop-blur-md border shadow-sm ${
                    client?.status === "active" 
                    ? "bg-emerald-400/20 text-emerald-50 border-emerald-400/30" 
                    : "bg-gray-400/20 text-gray-50 border-gray-400/30"
                 }`}>
                   {client?.status || "Inactive"}
                 </span>
             </div>
         </div>

         <div className="px-6 flex flex-col relative pb-6">
            {/* Avatar */}
            <div className="-mt-10 mb-3 self-center">
                 <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300 ease-out">
                    <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                        {client?.image ? (
                            <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-2xl">
                                {client?.name?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>
                 </div>
            </div>

            {/* Name & Program */}
            <div className="text-center mb-6">
               <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">{client?.name}</h2>
               <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                     {age ? `${age} yrs` : "N/A"}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                     {client?.gender || "N/A"}
                  </span>
               </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
                <div className="flex flex-col items-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Start</span>
                    <span className="text-xs font-bold text-[#334155]">{formatDate(client?.programStartDate)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">End</span>
                    <span className="text-xs font-bold text-[#334155]">{formatDate(client?.programEndDate)}</span>
                </div>
            </div>
         </div>
      </div>

      {/* 2. Assigned Experts & Compliance */}
      <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
         <div className="px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFCFF] flex items-center justify-between">
            <h3 className="font-bold text-[#1E293B] text-sm">Overview</h3>
         </div>
         <div className="p-6 flex flex-col gap-6">
            
            {/* Compliance Bar */}
            <div>
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#334155]">Total Compliance</span>
                  <span className="text-sm font-black text-[#0A4F48]">{complianceStats?.overall || 0}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-[#0A4F48] rounded-full transition-all duration-500"
                    style={{ width: `${complianceStats?.overall || 0}%` }}
                  />
               </div>
            </div>

            {/* Experts List */}
            <div>
               <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Assigned Team</h4>
               <div className="space-y-3">
                  {assignedExperts.map((exp, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                         <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                            {exp.name?.[0] || "E"}
                         </div>
                         <div className="flex flex-col">
                             <span className="text-xs font-bold text-[#334155]">{exp.name}</span>
                             <span className="text-[10px] font-medium text-[#64748B] uppercase">{exp.coach}</span>
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

export default ProfileLeftSide;
=======
import { assets } from '@/assets/asset';
import React from 'react'

const profileInfo = [
  {
    img: assets.GenderVector,
    title: "Gender",
    data: "Male",
  },
  {
    img: assets.GenderVector,
    title: "Age",
    data: "29 y/o",
  },
  {
    img: assets.GenderVector,
    title: "Email Address",
    data: "Aarav@gmail.com",
  },
  {
    img: assets.GenderVector,
    title: "Phone Number",
    data: "+62 811 5567 2345",
  },
  {
    img: assets.GenderVector,
    title: "Address",
    data: "221B Baker Street, London, United Kingdom",
  },
];

const assignedExperts = [
  {
    img: assets.profileVector,
    coach: "Trainer",
    name: "Rahul Mehta",
  },
  {
    img: assets.profileVector,
    coach: "Dietitian",
    name: "Anjali Sharma",
  },
  {
    img: assets.profileVector,
    coach: "Therapist",
    name: "Mira Kapoor",
  },
];

const ProfileLeftSide = () => {
  return (
    <div className="w-[25%] flex flex-col items-center gap-4 ">
            {/* name */}
            <div className="w-full bg-white rounded-lg p-4 pt-7.5">
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-3 px-[29px] pt-6">
                  <h2 className="font-bold text-[16px] ">Aarav Kumar </h2>
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full">
                      Weight Loss
                    </span>
                    <span className="px-2 py-0.5 bg-[#F0F0F0] rounded-full">
                      60 Days
                    </span>
                    <span className="px-2 py-0.5 bg-[#45C4A2] rounded-full text-white">
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex items-center flex-col gap-2.5 p-3 w-full rounded-lg bg-[#F8F8F8]">
                  <div className="flex items-center justify-between w-full ">
                    <span className="text-[#66706D] text-[12px]">Start Date</span>
                    <span className="text-[12px]">02 Jan 2025</span>
                  </div>
                  <div className="flex items-center justify-between w-full ">
                    <span className="text-[#66706D] text-[12px]">Start Date</span>
                    <span className="text-[12px]">02 Jan 2025</span>
                  </div>
                </div>
              </div>
            </div>
            {/* personal info */}
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
            {/* third section */}
            <div className="flex flex-col gap-6 p-4 items-center bg-white rounded-lg w-full">
              {/* section 1 */}
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center justify-between w-full py-[7px]">
                  <h2 className="font-bold text-[16px] text-[#0A4F48]">
                    Compliance
                  </h2>
                  <span className="text-[16px] font-bold">78%</span>
                </div>
                <div className="flex flex-col items-center w-full gap-4">
                  <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
                    <div className="absolute left-0 top-0 w-2 h-full bg-[#0A4F48] rounded-xs"></div>
                    <div className="w-full flex items-center justify-between">
                      <p className="text-[12px] ">Diet</p>
                      <div className="flex items-center gap-1.5">
                        <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                          <p className="text-[10px]">
                            Missed Diet: <span>26</span>
                          </p>
                        </div>
                        <p className="text-[#0A4F48] text-[12px] font-bold">82%</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
                    <div className="absolute left-0 top-0 w-2 h-full bg-[#F4DBC7] rounded-xs"></div>
                    <div className="w-full flex items-center justify-between">
                      <p className="text-[12px] ">Workout</p>
                      <div className="flex items-center gap-1.5">
                        <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                          <p className="text-[10px]">
                            Missed Diet: <span>29</span>
                          </p>
                        </div>
                        <p className="text-[#0A4F48] text-[12px] font-bold">75%</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
                    <div className="absolute left-0 top-0 w-2 h-full bg-[#EBF3F2] rounded-xs"></div>
                    <div className="w-full flex items-center justify-between">
                      <p className="text-[12px] ">Therapy</p>
                      <div className="flex items-center gap-1.5">
                        <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                          <p className="text-[10px]">
                            Missed Diet: <span>16</span>
                          </p>
                        </div>
                        <p className="text-[#0A4F48] text-[12px] font-bold">68%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* section 2 */}
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center justify-start w-full py-[7px]">
                  <h2 className="font-bold text-[16px] text-[#0A4F48]">
                    Assigned Experts
                  </h2>
                </div>
                <div className="flex flex-col items-start gap-4 w-full">
                  {assignedExperts.map((items) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-[#EBF3F2] rounded-full">
                          <img src={items.img} alt="" className="w-3.5" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] text-[#66706D]">
                            {items.coach}
                          </span>
                          <span className="text-[12px]">{items.name}</span>
                        </div>
                      </div>
                      <img
                        src={assets.threeDotVector}
                        alt="dot menu"
                        className="w-3.5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
  )
}

export default ProfileLeftSide
>>>>>>> .merge_file_QVNrH3

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

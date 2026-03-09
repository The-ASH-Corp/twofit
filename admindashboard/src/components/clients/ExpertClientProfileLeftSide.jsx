import { assets } from "@/assets/asset";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import React from "react";

const ExpertClientProfileLeftSide = ({
  client,
  clientComplianceStats,
}) => {
  const user = useAppSelector(selectUser);

  const [year] = client?.dob?.split("-") || [];
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

  const roleLabels = {
    dietician: "Diet",
    trainer: "Workout",
    therapist: "Therapy",
  };

  const currentRole = user?.role?.toLowerCase() || "";
  const complianceType = roleLabels[currentRole] || "Total";
  const complianceValue = clientComplianceStats?.[complianceType.toLowerCase()] || 0;

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Client Identity Card */}
      <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden group">
         {/* Banner/Header */}
         <div className="h-24 bg-linear-to-r from-[#0A4F48] to-[#116D63] relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
             <div className="absolute top-3 right-3">
                 <span className={`px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider backdrop-blur-md border shadow-sm ${
                    client?.status === "Active" 
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
               <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">{client?.name || "Client Name"}</h2>
               <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                     {age ? `${age} yrs` : "N/A"}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                     {client?.gender || "N/A"}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#0A4F48] text-[11px] font-bold border border-emerald-100">
                     {client?.programType?.title || "Program"}
                  </span>
               </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]">
                <div className="flex flex-col items-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Start</span>
                    <span className="text-xs font-bold text-[#334155]">
                      {client?.programStartDate ? formatDate(client.programStartDate) : "N/A"}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">End</span>
                    <span className="text-xs font-bold text-[#334155]">
                      {client?.programEndDate ? formatDate(client.programEndDate) : "N/A"}
                    </span>
                </div>
            </div>
         </div>
      </div>

      {/* 2. Role Specific Compliance */}
      <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
         <div className="px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFCFF] flex items-center justify-between">
            <h3 className="font-bold text-[#1E293B] text-sm">Your Overview</h3>
         </div>
         <div className="p-6 flex flex-col gap-6">
            
            {/* Compliance Bar */}
            <div>
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#334155]">{complianceType} Compliance</span>
                  <span className="text-sm font-black text-[#0A4F48]">{complianceValue}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-[#0A4F48] rounded-full transition-all duration-500"
                    style={{ width: `${complianceValue}%` }}
                  />
               </div>
            </div>

            {/* Sub Stats if Dietician */}
            {currentRole === "dietician" && (
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl flex flex-col items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Missed Meals</span>
                    <span className="text-sm font-bold text-rose-500">
                      {(clientComplianceStats?.stats?.missedCount || 0) + (clientComplianceStats?.stats?.skippedCount || 0)}
                    </span>
                 </div>
                 <div className="p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl flex flex-col items-center">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Expected</span>
                    <span className="text-sm font-bold text-[#334155]">
                      {clientComplianceStats?.stats?.expectedMeals || 0}
                    </span>
                 </div>
              </div>
            )}
         </div>
      </div>

      {/* 3. Personal Details */}
      <div className="flex flex-col bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden">
         <div className="px-6 py-4 border-b border-[#F1F5F9] bg-[#FAFCFF]">
            <h3 className="font-bold text-[#1E293B] text-sm">Personal Details</h3>
         </div>
         <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#64748B] font-medium">Email</span>
              <span className="text-[#0F172A] font-bold text-right truncate max-w-[150px]">{client?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#64748B] font-medium">Phone</span>
              <span className="text-[#0F172A] font-bold">{client?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-[#64748B] font-medium">Address</span>
              <span className="text-[#0F172A] font-bold text-right max-w-[150px] leading-tight">{client?.address || "N/A"}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ExpertClientProfileLeftSide;

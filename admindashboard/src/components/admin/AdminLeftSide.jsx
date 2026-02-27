import React from "react";
import { Briefcase, Award, IndianRupee, Layers, Clock, UserCheck } from "lucide-react";

const AdminLeftSide = ({ admin }) => {

  const profileDetails = [
    {
      title: "Programs",
      content: admin?.program?.map((p) => p.title).join(" | ") || "N/A",
      icon: Layers,
    },
    {
      title: "Base Salary",
      content: `₹${admin?.salary?.toLocaleString() || "0"}/m`,
      icon: IndianRupee,
    },
    {
      title: "Specialization",
      content: admin?.specialization?.join(", ") || "N/A",
      icon: Award,
    },
    {
      title: "Experience",
      content: admin?.experience
        ? /\byears?\b/i.test(admin.experience)
          ? admin.experience
          : `${admin.experience} Years`
        : "0 Years",
      icon: Clock,
    },
    {
      title: "Certifications",
      content: admin?.qualification || "N/A",
      icon: UserCheck,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
        
       {/* Header Section */}
       <div className="relative h-28 sm:h-32 bg-linear-to-r from-[#0F172A] to-[#334155] p-5 sm:p-6 flex flex-col justify-end">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Briefcase size={80} className="text-white transform -rotate-12 hidden sm:block" />
             <Briefcase size={60} className="text-white transform -rotate-12 sm:hidden" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none mb-2">{admin?.name}</h2>
            <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/10 text-xs font-semibold text-white uppercase tracking-wide">
                {admin?.role?.charAt(0)?.toUpperCase() + admin?.role?.slice(1) || "Sub Admin"}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide border ${
                    admin?.status === "Active" 
                    ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30" 
                    : "bg-red-500/20 text-red-100 border-red-500/30"
                }`}>
                {admin?.status}
                </span>
            </div>
          </div>
       </div>

        {/* Details List */}
        <div className="p-4 sm:p-6 pt-4 flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Professional Details</h3>
            <div className="flex flex-col gap-2">
            {profileDetails.map((item, i) => (
                <div
                key={i}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all gap-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:text-[#0A4F48] group-hover:bg-[#0A4F48]/10 transition-colors">
                            <item.icon size={18} strokeWidth={2} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-700 transition-colors">
                            {item.title}
                        </span>
                    </div>
                    
                    <div className="flex-1 text-right max-w-full sm:max-w-[60%]">
                        <span className="text-sm font-bold text-slate-800 leading-snug wrap-break-word">
                            {item.content}
                        </span>
                    </div>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
};

export default AdminLeftSide;

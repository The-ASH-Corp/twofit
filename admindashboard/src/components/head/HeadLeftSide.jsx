import React from "react";
import { Briefcase, MapPin, Award, DollarSign, Layers, Clock, ShieldCheck, User } from "lucide-react";

const HeadLeftSide = ({ Head }) => {
  const profileDetails = [
    {
      title: "Category",
      content: Head?.programCategory?.name || "N/A",
      icon: Layers,
    },
    {
      title: "Base Salary",
      content: `₹${Head?.salary?.toLocaleString() || "0"}/m`,
      icon: DollarSign,
    },
    {
      title: "Specialization",
      content: Head?.specialization?.join(", ") || "N/A",
      icon: Award,
    },
    {
      title: "Experience",
      content: `${Head?.experience || "0"} Years`,
      icon: Clock,
    },
    {
      title: "Certifications",
      content: Head?.qualification || "N/A",
      icon: ShieldCheck,
    },
  ];


  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] group">
        
       {/* New Header Design */}
       <div className="relative h-28 bg-linear-to-r from-[#0A4F48] to-[#116D63] overflow-hidden">
          {/* Abstract Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="absolute -bottom-6 -right-6 text-white/5 rotate-12">
             <User size={120} strokeWidth={1} />
          </div>
          
          <div className="absolute top-4 right-4 flex gap-2">
             <span className={`px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/10 shadow-sm`}>
              {Head?.role || "Head"}
            </span>
             <span className={`px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider backdrop-blur-md border shadow-sm ${
                Head?.status === "Active" 
                ? "bg-emerald-400/20 text-emerald-50 border-emerald-400/30" 
                : "bg-red-400/20 text-red-50 border-red-400/30"
            }`}>
              {Head?.status || "Inactive"}
            </span>
          </div>
       </div>

       {/* Profile Image & Name Section */}
       <div className="px-6 flex flex-col relative">
          <div className="-mt-12 mb-3 self-start">
             <div className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300 ease-out rotate-3 group-hover:rotate-0">
                <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                    {Head?.image ? (
                        <img src={Head.image} alt={Head.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="text-gray-300 w-8 h-8" />
                    )}
                </div>
             </div>
          </div>
          
          <div className="flex flex-col mb-6">
             <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">{Head?.name}</h2>
             <p className="text-xs text-[#64748B] font-medium flex items-center gap-1.5 mt-1">
                <Briefcase size={12} className="text-[#0A4F48]" />
                {Head?.programCategory?.name || "General Head"}
            </p>
          </div>
       </div>

       {/* Enhanced Details List */}
       <div className="px-6 pb-6 flex-1 overflow-y-auto no-scrollbar">
          <div className="space-y-3">
             {profileDetails.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-transparent hover:border-[#EBF3F2] hover:bg-white hover:shadow-sm transition-all duration-200">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#F1F5F9] flex items-center justify-center text-[#94A3B8] shadow-sm">
                         <item.icon size={14} strokeWidth={2} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">{item.title}</span>
                      </div>
                   </div>
                   <span className="text-[13px] font-bold text-[#334155] text-right truncate pl-2">
                      {item.content}
                   </span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default HeadLeftSide;

import React from "react";
import { User, Calendar, Mail, Phone, MapPin, Contact, Copy } from "lucide-react";
import { toast } from "react-toastify";

const HeadCenterSide = ({ Head }) => {
  const personalInfo = [
    {
      title: "Gender",
      content: Head?.gender || "N/A",
      icon: User,
    },
    {
      title: "Age",
      content: Head?.dob
        ? `${new Date().getFullYear() - new Date(Head.dob).getFullYear()} Years`
        : "N/A",
      icon: Calendar,
    },
    {
      title: "Email Address",
      content: Head?.email || "N/A",
      icon: Mail,
      isCopy: true,
    },
    {
      title: "Phone Number",
      content: Head?.phone || "N/A",
      icon: Phone,
      isCopy: true,
    },
    {
      title: "Address",
      content: Head?.address || "N/A",
      icon: MapPin,
    },
  ];

  const handleCopy = (text) => {
    if (text && text !== "N/A") {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)]">
      {/* Simple Header */}
      <div className="px-6 py-5 border-b border-[#F1F5F9] bg-[#FAFCFF] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#0A4F48]">
                <Contact size={20} strokeWidth={2} />
            </div>
            <div>
                <h2 className="text-[#1E293B] font-bold text-lg tracking-tight leading-none">Personal Info</h2>
                <p className="text-[11px] text-[#64748B] font-medium mt-1">Contact and identification details</p>
            </div>
        </div>
      </div>

      {/* Enhanced Details List */}
       <div className="px-6 py-6 flex-1 overflow-y-auto lg:overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {personalInfo.map((item, i) => (
                <div
                key={i}
                className="group flex flex-col p-4 rounded-xl bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <item.icon size={14} className="text-[#94A3B8]" />
                        <span className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-wider">
                            {item.title}
                        </span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                        <span className={`text-[15px] font-bold text-[#334155] break-all ${item.content === "N/A" ? "text-gray-400 italic font-normal" : ""}`}>
                            {item.content}
                        </span>
                        
                        {item.isCopy && item.content !== "N/A" && (
                            <button 
                                onClick={() => handleCopy(item.content)}
                                className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all shrink-0"
                                title="Copy"
                            >
                                <Copy size={14} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default HeadCenterSide;

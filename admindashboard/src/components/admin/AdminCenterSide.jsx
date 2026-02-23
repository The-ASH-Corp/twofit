import React from "react";
import { User, Calendar, Mail, Phone, MapPin, Contact, Copy } from "lucide-react";
import { toast } from "react-toastify";

const AdminCenterSide = ({ admin }) => {
  const personalInfo = [
    {
      title: "Gender",
      content: admin?.gender || "N/A",
      icon: User
    },
    {
      title: "Age",
      content: admin?.dob
        ? `${new Date().getFullYear() - new Date(admin.dob).getFullYear()} Years`
        : "N/A",
      icon: Calendar
    },
    {
      title: "Email Address",
      content: admin?.email || "N/A",
      icon: Mail,
      isCopy: true
    },
    {
      title: "Phone Number",
      content: admin?.phone || "N/A",
      icon: Phone,
      isCopy: true
    },
    {
      title: "Address",
      content: admin?.address || "N/A",
      icon: MapPin
    },
  ];

  const handleCopy = (text) => {
    if (text && text !== "N/A") {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 sm:p-5 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-[#0A4F48]">
                <Contact size={20} strokeWidth={2} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-800 leading-none">Personal Info</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Contact & identification details</p>
             </div>
         </div>
      </div>

      {/* Details List */}
      <div className="p-4 sm:p-6 pt-2 overflow-y-auto no-scrollbar flex-1 max-h-[400px] lg:max-h-full">
          <div className="flex flex-col gap-1">
            {personalInfo.map((item, i) => (
                <div
                key={i}
                className="group flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-3 -mx-3 rounded-lg transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:text-[#0A4F48] group-hover:bg-[#0A4F48]/10 transition-colors">
                           <item.icon size={16} strokeWidth={2} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                            {item.title}
                        </span>
                    </div>
                
                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                        <span className={`text-sm font-semibold text-slate-700 text-right break-words ${item.content === "N/A" ? "text-slate-400 italic font-normal" : ""}`}>
                            {item.content}
                        </span>
                        
                        {item.isCopy && item.content !== "N/A" && (
                            <button 
                                onClick={() => handleCopy(item.content)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm rounded-lg text-slate-400 hover:text-slate-600 transition-all transform scale-90 hover:scale-100 shrink-0"
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

export default AdminCenterSide;

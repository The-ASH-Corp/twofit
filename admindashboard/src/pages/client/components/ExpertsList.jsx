import React from "react";
import { MessageCircle } from "lucide-react";
import { assets } from "@/assets/asset";
import { useNavigate } from "react-router-dom";

export default function ExpertsList({ expert }) {
  const navigate = useNavigate();

  // Use dummy data matching reference image
  const experts = expert?.length ? expert : [
    {
      name: "Elena Rodriguez",
      role: "Live Trainer",
      image: assets.trainerCartoon,
    },
    {
      name: "Dr. Sarah Chen",
      role: "Live Dietition",
      image: assets.dietitianCartoon,
    },
    {
      name: "Mark Williams",
      role: "Live Therapist",
      image: assets.therapistCartoon,
    }
  ];

  // Helper to get matching cartoon image based on role
  const getExpertImage = (exp) => {
    if (exp.user?.profileimage) return exp.user.profileimage;
    
    const role = (exp.role || "").toLowerCase();
    if (role.includes("trainer")) return assets.trainerCartoon;
    if (role.includes("diet") || role.includes("nutrition")) return assets.dietitianCartoon;
    if (role.includes("therapist") || role.includes("therapy")) return assets.therapistCartoon;
    
    return assets.profile;
  };

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-6 group transition-all duration-300 hover:shadow-lg">
      <h3 className="text-gray-400 font-black text-[15px] uppercase tracking-widest">
        Your Experts
      </h3>

      <div className="flex flex-col gap-6">
        {experts.map((exp, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between group/row"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover/row:border-[#0A4F48]/10 transition-all shadow-sm">
                <img
                  src={getExpertImage(exp)}
                  alt={exp.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[15px] font-black text-gray-800 leading-none mb-1">
                  {exp.user?.name || exp.name}
                </p>
                <p className="text-[10px] font-black text-[#0A4F48] uppercase tracking-widest leading-none opacity-80">
                  {exp.role}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate("/client/chats")}
              className="w-10 h-10 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-gray-400 hover:bg-[#0A4F48] hover:text-white transition-all shadow-sm"
            >
              <MessageCircle size={18} fill="currentColor" className="opacity-20 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



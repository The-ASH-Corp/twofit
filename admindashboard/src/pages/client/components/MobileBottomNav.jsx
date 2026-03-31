import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MessageSquare, BarChart2, User } from "lucide-react";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: "/client/" },
    { name: "Plan", icon: Calendar, path: "/client/daily-plan" },
    { name: "Chat", icon: MessageSquare, path: "/client/chats" },
    { name: "Progress", icon: BarChart2, path: "/client/progress" },
    { name: "Profile", icon: User, path: "/client/profile" },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1.5 transition-all active:scale-90"
            >
              <div className={`p-2.5 rounded-[20px] transition-all duration-300 ${isActive ? 'bg-[#0A4F48] text-white shadow-lg shadow-[#0A4F48]/20' : 'text-gray-400 hover:text-gray-600'}`}>
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? "text-[#0A4F48]" : "text-gray-400"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


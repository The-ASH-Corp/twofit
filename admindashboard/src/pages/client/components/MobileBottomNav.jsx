import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MessageCircle, TrendingUp, FileText } from "lucide-react";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/client",
    },
    {
      name: "Daily Plan",
      icon: Calendar,
      path: "/client/daily-plan",
    },
    {
      name: "Message",
      icon: MessageCircle,
      path: "/client/chats",
    },
    {
      name: "Progress",
      icon: TrendingUp,
      path: "/client/progress",
    },
    {
      name: "Feedback",
      icon: FileText,
      path: "/client/feedback",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[24px] flex items-center justify-around px-2 py-3 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1.5 min-w-[56px] transition-all active:scale-90"
            >
              {active && (
                <div className="absolute -top-3 w-8 h-1 bg-[#0A4F48] rounded-full animate-in fade-in zoom-in duration-300" />
              )}
              <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-[#0A4F48] text-white shadow-lg shadow-[#0A4F48]/20' : 'text-gray-400'}`}>
                <Icon
                  className="w-5 h-5"
                  strokeWidth={active ? 3 : 2}
                />
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  active ? "text-[#0A4F48]" : "text-gray-400"
                }`}
              >
                {item.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { Bell, Menu, Search, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { assets } from "@/assets/asset";

export default function Topbar({ onToggleSidebar }) {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-30 flex items-center gap-4 rounded-[20px] border border-[#e6ebe5] bg-white px-4 py-4 shadow-[0_8px_20px_-18px_rgba(31,52,45,0.18)] md:px-5">
      <button
        onClick={onToggleSidebar}
        className="rounded-xl p-2 text-[#73857d] lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="hidden min-w-0 flex-1 items-center rounded-full bg-[#f4f5f1] px-4 py-3 md:flex">
        <Search size={16} className="text-[#b2bbb6]" />
        <input
          type="text"
          placeholder="Search across wellness reports..."
          className="w-full bg-transparent px-3 text-sm text-[#51645d] outline-none placeholder:text-[#b2bbb6]"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={() => navigate("/founder/notifications")}
          className="rounded-full p-2 text-[#6f8179] transition-colors hover:bg-[#f3f5f1]"
        >
          <Bell size={18} />
        </button>

        <button
          type="button"
          onClick={() => navigate("/founder/profile")}
          className="rounded-full p-2 text-[#6f8179] transition-colors hover:bg-[#f3f5f1]"
        >
          <Settings size={18} />
        </button>

        <button
          type="button"
          onClick={() => navigate("/founder/profile")}
          className="flex items-center gap-3 rounded-full pl-1 text-left"
        >
          <img
            src={assets.profileVector}
            alt="Profile"
            className="h-9 w-9 rounded-full border border-[#dce4dc] object-cover"
          />
<<<<<<< Updated upstream
        </div> */}

        {/* Action icons */}
        <div className="flex items-center  md:gap-4 shrink-0">
          <button
            className="sm:p-2.5 p-1 text-gray-400 hover:text-[#0A4F48] hover:bg-[#EBF3F2] rounded-full transition-all duration-300 relative group overflow-hidden"
            onClick={() => navigate("/founder/notifications")}
          >
            <Bell size={20} className="group-hover:animate-swing" />
            <span className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-105 transition-transform animate-pulse"></span>
          </button>

          <div
            className="flex items-center gap-3 pl-1 sm:pl-4 border-l border-gray-100 cursor-pointer hover:opacity-90 transition-opacity group"
            onClick={() => navigate("/founder/profile")}
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-[#0A4F48] leading-none group-hover:text-[#0D6159] transition-colors">
                {user?.name}
              </p>
              <p className="text-[10px] text-[#66706D] mt-1 uppercase tracking-wider font-semibold">
                {user?.role}
              </p>
            </div>
            <div className="relative">
              {user?.profilePhot ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${user?.profilePhoto}`}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md object-cover group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-[#EBF3F2]"
                  alt="Profile"
                />
              ) : (
                <img
                  src={assets.profileVector}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md object-cover group-hover:scale-105 transition-transform duration-300 ring-2 ring-transparent group-hover:ring-[#EBF3F2]"
                  alt="Profile"
                />
              )}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
=======
          <div className="hidden md:block">
            <div className="text-sm font-bold text-[#214f48]">
              {user?.name || "Founder"}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#98a49e]">
              {user?.role || "Founder"}
>>>>>>> Stashed changes
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

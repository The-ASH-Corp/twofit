import { Bell, Search, Menu } from "lucide-react";
import { assets } from "../../../assets/asset";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onToggleSidebar }) {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - Only on mobile */}
        <button
          onClick={onToggleSidebar}
          className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-[#0A4F48] truncate">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end max-w-full">
        {/* Search Bar - Hidden on small screens, shown as icon or collapsed */}
        <div className="hidden sm:flex items-center bg-white px-3 rounded-xl border border-gray-100 shadow-sm flex-1 max-w-[400px]">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full px-3 py-2.5 text-sm bg-white focus:outline-none placeholder:text-gray-400"
          />
          <img
            src={assets.filter}
            className="w-4 h-4 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            alt="Filter"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-50"></span>
          </button>

          <div 
            className="flex items-center gap-2 pl-2 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/client/profile')}
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-gray-800 leading-none">
                {user?.name}
              </p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                {user?.role}
              </p>
            </div>
            <img
              src={assets.profile}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm object-cover"
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Bell, ChevronRight, Menu, Search } from "lucide-react";
import { assets } from "../../../assets/asset";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useNavigate, useLocation } from "react-router-dom";

export default function Topbar({ onToggleSidebar }) {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const isIdSegment = (segment) => {
    if (/^[a-f\d]{24}$/i.test(segment)) return true;
    if (segment.length > 10 && /[0-9]/.test(segment)) return true;
    return false;
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const filteredSegments = pathSegments.filter(
      (segment) =>
        !["founder", "admin", "client", "expert", "head"].includes(
          segment.toLowerCase(),
        ) && !isIdSegment(segment),
    );
    const baseRole = pathSegments[0] || "client";
    const breadcrumbs = [{ name: "Dashboard", path: `/${baseRole}` }];
    let currentPath = `/${baseRole}`;

    filteredSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const formattedName = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({
        name: formattedName,
        path: currentPath,
      });
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1]?.name || "Dashboard";

  return (
    <div className="flex justify-between items-center gap-4 bg-transparent px-6 py-6 pb-2 sticky top-0 z-30 transition-all duration-500">
      <div className="flex items-center gap-4 min-w-0 flex-1 lg:flex-none">
        {/* Hamburger Menu - Only on mobile */}
        <button
          onClick={onToggleSidebar}
          className="p-3 lg:hidden text-gray-500 hover:bg-[#0A4F48]/5 hover:text-[#0A4F48] rounded-2xl transition-all shrink-0 active:scale-90"
        >
          <Menu size={22} />
        </button>
        
        <div className="min-w-0 flex-1">
          <h2 className="text-[26px] font-bold text-[#0A4F48] tracking-tight uppercase">
            {currentPage}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-6 flex-1 justify-end">
        <button
          className="p-2 text-text-muted hover:text-[#0A4F48] transition-all relative group"
          onClick={() => navigate("/client/notifications")}
        >
          <Bell size={24} strokeWidth={2} />
          <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white"></span>
        </button>

        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/client/profile")}
        >
          <div className="hidden md:block text-right">
            <p className="text-[14px] font-bold text-[#0A4F48] leading-none uppercase">
              {user?.name || "ARJUN"}
            </p>
            <p className="text-[11px] text-text-muted font-bold mt-1 uppercase">
              {user?.role || 'USER'}
            </p>
          </div>
          <div className="relative">
            <img
              src={assets.profileVector}
              className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover relative z-10"
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0A4F48] border-4 border-white rounded-full z-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

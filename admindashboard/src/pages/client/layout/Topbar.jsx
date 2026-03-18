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
    <div className="flex justify-between items-center gap-4 bg-white/60 backdrop-blur-2xl px-6 py-4 rounded-[28px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] sticky top-0 z-30 transition-all duration-500">
      <div className="flex items-center gap-4 min-w-0 flex-1 lg:flex-none">
        {/* Hamburger Menu - Only on mobile */}
        <button
          onClick={onToggleSidebar}
          className="p-3 lg:hidden text-gray-500 hover:bg-[#0A4F48]/5 hover:text-[#0A4F48] rounded-2xl transition-all shrink-0 active:scale-90"
        >
          <Menu size={22} />
        </button>
        
        <div className="min-w-0 flex-1">
          {/* Desktop Title & Breadcrumbs */}
          <div className="hidden lg:block">
            <h2 className="text-2xl font-black text-[#0A4F48] truncate tracking-tight uppercase">
              {currentPage}
            </h2>
            {breadcrumbs.length > 1 && (
              <div className="flex items-center gap-2 mt-1 overflow-x-auto no-scrollbar flex-nowrap pb-1">
                {breadcrumbs.map((breadcrumb, index) => (
                  <div
                    key={breadcrumb.path}
                    className="flex items-center gap-2 shrink-0"
                  >
                    {index > 0 && (
                      <ChevronRight
                        size={10}
                        className="text-gray-300 shrink-0"
                      />
                    )}
                    <span
                      className={`text-[10px] font-black cursor-pointer transition-all uppercase tracking-[0.15em] whitespace-nowrap px-2 py-0.5 rounded-lg
                        ${index === breadcrumbs.length - 1 ? "bg-[#0A4F48]/5 text-[#0A4F48]" : "text-gray-400 hover:text-[#0A4F48] hover:bg-gray-50"}
                      `}
                      onClick={() => navigate(breadcrumb.path)}
                    >
                      {breadcrumb.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Back View */}
          <div className="lg:hidden min-w-0">
            {breadcrumbs.length > 1 ? (
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() =>
                  navigate(breadcrumbs[breadcrumbs.length - 2]?.path)
                }
              >
                <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#0A4F48] group-hover:bg-[#0A4F48]/5 transition-all">
                  <ChevronRight size={18} className="rotate-180" />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Back to
                  </p>
                  <h2 className="text-lg font-black text-[#0A4F48] leading-none tracking-tight">
                    {breadcrumbs[breadcrumbs.length - 2]?.name}
                  </h2>
                </div>
              </div>
            ) : (
              <h2 className="text-xl font-black text-[#0A4F48] truncate tracking-tight uppercase">
                {currentPage}
              </h2>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8 flex-1 justify-end max-w-full">
        {/* Search Bar (Desktop only) */}
     

        {/* Action icons */}
        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <button
            className="p-3 text-gray-400 hover:text-[#0A4F48] hover:bg-[#0A4F48]/5 rounded-2xl transition-all relative group"
            onClick={() => navigate("/client/notifications")}
          >
            <Bell size={22} strokeWidth={2.5} className="group-hover:animate-swing" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          <div
            className="flex items-center gap-4 pl-6 border-l border-gray-100 cursor-pointer group"
            onClick={() => navigate("/client/profile")}
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-black text-[#0A4F48] leading-none group-hover:text-[#0D6159] transition-colors uppercase tracking-tighter">
                {user?.name}
              </p>
              <p className="text-[9px] text-gray-400 mt-1.5 uppercase tracking-widest font-black">
                {user?.role || 'Premium User'}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-tr from-[#0A4F48] to-[#F4DBC7] rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
              <img
                src={assets.profileVector}
                className="w-10 h-10 md:w-11 md:h-11 rounded-2xl border-2 border-white shadow-lg object-cover relative z-10 transition-all duration-500 group-hover:rounded-xl group-hover:scale-105"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full z-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

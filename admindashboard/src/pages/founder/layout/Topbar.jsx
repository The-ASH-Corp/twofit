import { Bell, Settings, ChevronRight, Menu, Search } from "lucide-react";
import { assets } from "../../../assets/asset";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useNavigate, useLocation } from "react-router-dom";

export default function Topbar({ onToggleSidebar }) {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const isIdSegment = (segment) => {
    // MongoDB ObjectId (24 hex chars)
    if (/^[a-f\d]{24}$/i.test(segment)) return true;

    // Long random IDs / UUID-like strings
    if (segment.length > 10 && /[0-9]/.test(segment)) return true;

    return false;
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    const filteredSegments = pathSegments.filter(
      (segment) =>
        !["founder", "admin", "client", "expert", "head"].includes(
          segment.toLowerCase(),
        ) && !isIdSegment(segment), // ⬅️ skip ID
    );

    const baseRole = pathSegments[0] || "founder";

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
    <div className="flex justify-between items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/60 shadow-sm sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-3 min-w-0 flex-1 lg:flex-none">
        {/* Hamburger Menu - Only on mobile */}
        <button
          onClick={onToggleSidebar}
          className="p-2 lg:hidden text-[#66706D] hover:bg-[#EBF3F2] hover:text-[#0A4F48] rounded-xl transition-colors shrink-0"
        >
          <Menu size={24} />
        </button>
        <div className="min-w-0 flex-1">
          {/* Desktop Title & Breadcrumbs */}
          <div className="hidden lg:block">
            <h2 className="text-xl md:text-2xl font-bold text-[#0A4F48] truncate tracking-tight">
              {currentPage}
            </h2>
            {breadcrumbs.length > 1 && (
              <div className="flex items-center gap-2 mt-0.5 overflow-x-auto no-scrollbar flex-nowrap pb-1">
                {breadcrumbs.map((breadcrumb, index) => (
                  <div
                    key={breadcrumb.path}
                    className="flex items-center gap-2 shrink-0"
                  >
                    {index > 0 && (
                      <ChevronRight
                        size={12}
                        className="text-gray-300 shrink-0"
                      />
                    )}
                    <span
                      className={`text-[11px] font-medium cursor-pointer transition-colors uppercase tracking-wide whitespace-nowrap
                        ${index === breadcrumbs.length - 1 ? "text-[#0A4F48]" : "text-[#94A3B8] hover:text-[#0A4F48]"}
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

          {/* Mobile "Minimum Back Page" View */}
          <div className="lg:hidden min-w-0">
            {breadcrumbs.length > 1 ? (
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() =>
                  navigate(breadcrumbs[breadcrumbs.length - 2]?.path)
                }
              >
                <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400 group-hover:text-[#0A4F48] group-hover:bg-[#EBF3F2] transition-colors">
                  <ChevronRight size={16} className="rotate-180" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Back to
                  </p>
                  <h2 className="text-lg font-bold text-[#0A4F48] leading-none">
                    {breadcrumbs[breadcrumbs.length - 2]?.name}
                  </h2>
                </div>
              </div>
            ) : (
              <h2 className="text-xl font-bold text-[#0A4F48] truncate tracking-tight">
                {currentPage}
              </h2>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 flex-1 justify-end max-w-full">
        {/* Search Bar - Hidden on small screens, shown as icon or collapsed */}
        {/* <div className="hidden sm:flex items-center bg-white px-3 rounded-xl border border-gray-100 shadow-sm flex-1 max-w-[400px]">
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
        </div> */}

        {/* Action icons */}
        <div className="flex items-center  md:gap-4 shrink-0">
          <button
            className="sm:p-2.5 p-1 text-gray-400 hover:text-[#0A4F48] hover:bg-[#EBF3F2] rounded-full transition-all duration-300 relative group overflow-hidden"
            onClick={() => navigate("/founder/notifications")}
          >
            <Bell size={20} className="group-hover:animate-swing" />
            <span className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-105 transition-transform"></span>
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
              {!user.profilePhot ? (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

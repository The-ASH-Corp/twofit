import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../../../assets/asset";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/auth.thunk";
import { useState, useEffect } from "react";
import { X, ChevronDown, LogOut } from "lucide-react";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";

const menuItems = [
  { label: "Dashboard", icon: assets.dashboard, path: "/admin" },
  { label: "Programs", icon: assets.programs, path: "/admin/programs" },
  { label: "Therapy", icon: assets.therapy, path: "/admin/therapy" },
  { label: "Experts", icon: assets.experts, path: "/admin/experts" },
  { label: "Clients", icon: assets.clients, path: "/admin/clients" },
  { label: "Chats", icon: assets.chats, path: "/admin/chats" },
  { label: "Finance", icon: assets.finance, path: "/admin/finance" },
  { label: "Growth Support", icon: assets.therapy, path: "/admin/growth-support" },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(null);
  const user = useAppSelector(selectUser);

  const filteredMenuItems = menuItems.filter((item) => {
    if (
      item.label === "Programs" &&
      (!user?.program || user.program.length === 0)
    ) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const activeParent = menuItems.find(item => 
      item.children?.some(child => location.pathname.startsWith(child.path))
    );
    if (activeParent) {
      setOpenMenu(activeParent.label);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  const handleToggleMenu = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-white flex flex-col h-screen
          transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        `}
      >
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 relative">
          <div
            className="relative group cursor-pointer"
            onClick={() => navigate("/admin")}
          >
            <div className="absolute -inset-2 bg-linear-to-r from-emerald-100 to-teal-100 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition duration-500"></div>
            <img
              src={assets.logo}
              alt="logo"
              className="h-10 relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <button
            onClick={onClose}
            className="absolute right-0 top-0 bg-emerald-50/80 p-2 lg:hidden text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-bl-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 no-scrollbar">
          <div className="px-4 py-2 mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Main Menu
            </h3>
          </div>

          <nav className="space-y-1.5">
            {filteredMenuItems.map((item) => {
              const isMenuOpen = openMenu === item.label;
             
              const hasChildren = !!item.children;
              const isChildActive =
                hasChildren &&
                item.children.some((child) => location.pathname === child.path);
                

              if (hasChildren) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => handleToggleMenu(item.label)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative
                        ${
                          isMenuOpen || isChildActive
                            ? "bg-gray-100 text-emerald-900"
                            : "text-gray-500 hover:bg-gray-50 hover:text-emerald-700"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3.5 relative z-10">
                        <div
                          className={`
                          w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300
                          ${isMenuOpen || isChildActive ? "bg-white shadow-sm" : "bg-gray-50 group-hover:bg-white group-hover:shadow-sm"}
                        `}
                        >
                          <img
                            src={item.icon}
                            className={`w-4 h-4 object-contain transition-all duration-300 
                              ${
                                isMenuOpen || isChildActive
                                  ? "grayscale opacity-100   scale-110"
                                  : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                              }
                            `}
                          />
                        </div>
                        <span className="font-semibold tracking-wide">
                          {item.label}
                        </span>
                      </div>

                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300  ${isMenuOpen ? "rotate-180 text-[#0A4F48]" : "text-gray-400"}`}
                      />
                    </button>

                    <div
                      className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${isMenuOpen ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
                      `}
                    >
                      <div className="pl-12 pr-2 py-1 space-y-1">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.label}
                            to={child.path}
                            onClick={() =>
                              window.innerWidth < 1024 && onClose()
                            }
                            className={({ isActive }) => `
                              block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative
                              ${
                                isActive
                                  ? "bg-linear-to-r from-[#0A4F48] to-[#116D63] text-white shadow-sm shadow-emerald-900/20 before:absolute before:right-2 before:animate-pulse before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:rounded-full before:bg-white/40"
                                  : "text-gray-500 hover:text-emerald-800 hover:bg-gray-50"
                              }
                            `}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group relative overflow-hidden
                    ${
                      isActive
                        ? "bg-linear-to-r from-[#0A4F48] to-[#116D63] text-white shadow-lg shadow-emerald-900/20 translate-x-1"
                        : "text-gray-500 hover:bg-gray-50 hover:text-emerald-800"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`
                        w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300
                        ${isActive ? "bg-white/20" : "bg-gray-50 group-hover:bg-white group-hover:shadow-sm"}
                      `}
                      >
                        <img
                          src={item.icon}
                          className={`w-4 h-4 object-contain transition-all duration-300  
                            ${
                              isActive
                                ? "brightness-0 invert scale-115 opacity-100"
                                : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                            }
                          `}
                        />
                      </div>
                      <span className="relative z-10 tracking-wide">
                        {item.label}
                      </span>

                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-100 bg-gray-50/30">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-100"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

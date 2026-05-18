import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  ChevronDown,
  Grid2x2,
  LogOut,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/redux/features/auth/auth.thunk";

const menuItems = [
  { label: "Dashboard", path: "/founder", icon: Grid2x2 },
  { label: "Admins", path: "/founder/admins", icon: UserRound },
  { label: "Experts", path: "/founder/experts", icon: UserRound },
  { label: "Clients", path: "/founder/clients", icon: Users },
  { label: "Growth Support", path: "/founder/growth", icon: Users },
  {
    label: "Programs",
    icon: Users,
    children: [
      { label: "Categories", path: "/founder/categories" },
      { label: "Programs", path: "/founder/programs" },
    ],
  },
<<<<<<< Updated upstream
  { label: "Therapy", icon: assets.therapy, path: "/founder/therapy" },
  {label:"Recipe Library" ,icon:assets.therapy,path:"/founder/recipe"},
  {label:"Growth Support",icon:assets.therapy,path:"/founder/growth"},
  { label: "Finance", icon: assets.finance, path: "/founder/finance" },
  {
    label: "Broadcast",
    icon: assets.broadCast,
    children: [
      { label: "Templates", path: "/founder/broadcasts" },
      { label: "Add New", path: "/founder/broadcast/add-Template" },
      { label: "Auto Reminders", path: "/founder/auto-remainder" },
      { label: "Status", path: "/founder/broadcast/status" },
    ],
  },
=======
  { label: "Settings", path: "/founder/profile", icon: Settings },
>>>>>>> Stashed changes
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[252px] flex-col border-r border-[#e8ece5] bg-[#f8f9f5] transition-transform duration-300 lg:static ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-8 pb-7 pt-7">
          <button
            type="button"
            onClick={() => navigate("/founder")}
            className="text-left"
          >
            <div className="text-[20px] font-black tracking-[-0.04em] text-[#14736a]">
              TwoFit
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a0aaa3]">
              Editorial Wellness
            </div>
          </button>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-2 text-[#88948e] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const hasChildren = Array.isArray(item.children);
              const isChildActive =
                hasChildren &&
                item.children.some((child) =>
                  location.pathname.startsWith(child.path),
                );

              if (hasChildren) {
                const Icon = item.icon;
                const isOpenMenu = openMenu === item.label;

                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(isOpenMenu ? null : item.label)
                      }
                      className={`flex w-full items-center justify-between rounded-[14px] px-4 py-3 text-sm font-medium ${
                        isChildActive || isOpenMenu
                          ? "bg-white text-[#136d64]"
                          : "text-[#6d7e76] hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#f1f3ee]">
                          <Icon size={16} />
                        </span>
                        {item.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={isOpenMenu ? "rotate-180" : ""}
                      />
                    </button>

                    {isOpenMenu && (
                      <div className="mt-1 space-y-1 pl-12">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.label}
                            to={child.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) =>
                              `block rounded-xl px-3 py-2 text-sm ${
                                isActive
                                  ? "bg-white font-semibold text-[#136d64]"
                                  : "text-[#7b8c84] hover:bg-white"
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === "/founder"}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-white text-[#136d64]"
                        : "text-[#6d7e76] hover:bg-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${
                          isActive ? "bg-[#ecf5f1]" : "bg-[#f1f3ee]"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="px-5 pb-6 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#dfe6de] bg-white px-4 py-3 text-sm font-semibold text-[#66766f]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

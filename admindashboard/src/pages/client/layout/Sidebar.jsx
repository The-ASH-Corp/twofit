import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../../../assets/asset";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/auth.thunk";
import { useState, useEffect } from "react";
import { X, ChevronDown, LogOut, LayoutDashboard, Calendar, RefreshCcw, Dumbbell, Activity, Utensils, BookOpen, TrendingUp, MessageSquare, FileText } from "lucide-react";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";



export default function Sidebar({ isOpen, onClose }) {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/client",
  },
  { label: "Daily Plan", icon: Calendar, path: "/client/daily-plan" },
  {
    label: "Habit Tracker",
    icon: RefreshCcw,
    path: "/client/habit-tracker",
  },
  { label: "Workout", icon: Dumbbell, path: "/client/workout" },
   ...(user?.therapyType ? [{
    label: "Therapy",
    icon: Activity,
    path: "/client/therapy",
  }] : []),
  { label: "Diet", icon: Utensils, path: "/client/diet" },
  { label: "Recipe Library", icon: BookOpen, path: "/client/recipe" },
  { label: "Progress", icon: TrendingUp, path: "/client/progress" },
  { label: "Messages", icon: MessageSquare, path: "/client/chats" },
  { label: "Feedback", icon: FileText, path: "/client/feedback" },
];
  useEffect(() => {
    const activeParent = menuItems.find((item) =>
      item.children?.some((child) => location.pathname.startsWith(child.path)),
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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] bg-white flex flex-col h-screen
          transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          border-r border-gray-100 shadow-[20px_0_40px_rgba(0,0,0,0.03)]
        `}
      >
        {/* Logo Section */}
        <div className="pt-10 pb-8 px-8 flex items-center justify-between relative">
          <div
            className="relative group cursor-pointer"
            onClick={() => navigate("/client")}
          >
            <div className="absolute -inset-3 bg-linear-to-r from-emerald-50 to-teal-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <img
              src={assets.logo}
              alt="logo"
              className="h-10 relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 no-scrollbar">
          <div>
            <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Main Menu
            </h3>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/client' && location.pathname.startsWith(item.path));

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    end={item.path === "/client"}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={`
                      flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group relative
                      ${
                        isActive
                          ? "bg-linear-to-r from-[#0A4F48] to-[#116D63] text-white shadow-xl shadow-[#0A4F48]/20 translate-x-1"
                          : "text-gray-500 hover:bg-gray-50 hover:text-[#0A4F48]"
                      }
                    `}
                  >
                    <div
                      className={`
                      p-2 rounded-xl transition-all duration-300
                      ${isActive ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-[#0A4F48] group-hover:shadow-sm"}
                    `}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="tracking-tight">{item.label}</span>

                    {isActive && (
                      <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Section (Sign Out) */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-3 px-4 py-4 text-sm font-black text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group border border-gray-100 hover:border-red-100 uppercase tracking-widest"
          >
            <LogOut
              size={18}
              strokeWidth={3}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

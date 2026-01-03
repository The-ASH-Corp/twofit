import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../../assets/asset";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/auth.thunk";
import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    icon: assets.dashboard,
    path: "/founder",
  },
  { label: "Heads", icon: assets.experts, path: "/founder/heads" },
  { label: "Admins", icon: assets.experts, path: "/founder/admins" },
  { label: "Experts", icon: assets.experts, path: "/founder/experts" },
  { label: "Clients", icon: assets.clients, path: "/founder/clients" },
  {
    label: "Programs",
    icon: assets.programs,
    children: [
      {
        label: "Categories",
        path: "/founder/category",
      },
      {
        label: "Programs",
        path: "/founder/programs",
      },
    ],
  },
  { label: "Finance", icon: assets.website, path: "/founder/finance" },
  { label: "Therapy", icon: assets.website, path: "/founder/therapy" },
  { label: "Workout", icon: assets.website, path: "/founder/workout" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(null);

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-[225px] bg-white py-6 px-5 flex flex-col h-screen">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img src={assets.logo} alt="logo" />
      </div>

      {/* Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isOpen = openMenu === item.label;

          return (
            <div key={item.label}>
              {/* Parent Menu */}
              {item.children ? (
                <button
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition hover:bg-gray-100 text-[#66706D]
                    `}
                >
                  <div className="flex items-center gap-3">
                    <img src={item.icon} className="w-5 h-5" />
                    {item.label}
                  </div>

                  <img
                    src={assets.downVector}
                    className={`w-3 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === "/founder"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition
                    ${
                      isActive
                        ? "bg-[#0A4F48] text-white"
                        : "text-[#66706D] hover:bg-gray-100"
                    }`
                  }
                >
                  <img src={item.icon} className="w-5 h-5" />
                  {item.label}
                </NavLink>
              )}

              {/* Children Menu */}
              {item.children && isOpen && (
                <div className="ml-6 mt-2 pl-2 flex flex-col gap-2 border-l border-l-[#DBDEDD]">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.label}
                      to={child.path}
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-xl text-[14px] font-semibold transition
                        ${
                          isActive
                            ? "bg-[#0A4F48] text-white"
                            : "text-[#66706D] hover:bg-gray-100"
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
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 mt-auto px-4 py-3 text-[#66706D] font-medium hover:text-red-500"
      >
        <img src={assets.signout} />
        Logout
      </button>
    </aside>
  );
}

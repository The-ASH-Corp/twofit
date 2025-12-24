import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/asset";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/auth.thunk";

const menuItems = [
  {
    label: "Dashboard",
    icon: assets.dashboard,
    path: "/",
  },
  { label: "Clients", icon: assets.clients, path: "/clients" },
  { label: "Experts", icon: assets.experts, path: "/experts" },
  {
    label: "Programs",
    icon: assets.programs,
    path: "/programs",
    Children: [
      {
        label: "Program List",
        icon: assets.programs,
        path: "/programs/list",
      },
      {
        label:"Templates",
        icon:assets.programs,
        path:"/programs/template"
      }
    ],
  },
  { label: "Finance", icon: assets.finance, path: "/finance" },
  { label: "Chats", icon: assets.chats, path: "/chats" },
  { label: "Analytics", icon: assets.analytics, path: "/analytics" },
  { label: "Website", icon: assets.website, path: "/website" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.removeItem("token"); 
    navigate("/login");
  };

  return (
    <aside className="w-[225px] bg-white   py-6 px-5 flex flex-col h-screen">
      <h1 className="text-2xl  m-auto my-4 mb-8">
        <img src={assets.logo} className="text-[#66706D]" />
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.label}
            className={({ isActive }) =>
              `flex items-center text-[#66706D] gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition
    ${isActive ? "bg-[#0A4F48] text-white" : "text-gray-600 hover:bg-gray-100"}
  `
            }
          >
            <img
              src={item.icon}
              className="w-5 h-5 text-black object-contain"
              alt={item.label}
            />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 mt-auto font-medium text-[#66706D]  px-4 py-3"
      >
        <img src={assets.signout} />
        <h1 className="">Logout</h1>
      </button>
    </aside>
  );
}

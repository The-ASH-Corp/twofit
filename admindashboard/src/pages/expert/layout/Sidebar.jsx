import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../../assets/asset";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/auth.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";


export default function Sidebar() {
  const user =useAppSelector(selectUser)

  
const menuItems = [
  {
    label: "Dashboard",
    icon: assets.dashboard,
    path: "/expert",
  },
  { label: "Clients", icon: assets.clients, path: "/expert/clients" },
  ...(user?.role?.toLowerCase() !== "therapist"
    ? [
        {
          label: "Programs",
          icon: assets.programs,
          path: "/expert/programs",
        },
      ]
    : [
        {
          label: "Therapy",
          icon: assets.programs,
          path: "/expert/therapy",
        },
      ]),
  { label: "Finance", icon: assets.finance, path: "/expert/finance" },
  { label: "Chats", icon: assets.chats, path: "/expert/chats" },
];


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-[225px] bg-white py-6 px-5 flex flex-col h-screen fixed left-0 top-0 z-40">
      <h1 className="text-2xl  m-auto my-4 mb-8">
        <img src={assets.logo} className="text-[#66706D]" />
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.label}
            end={item.path == "/expert"}
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

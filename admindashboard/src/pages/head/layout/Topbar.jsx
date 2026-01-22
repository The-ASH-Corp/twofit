import { Bell, Settings } from "lucide-react";
import { assets } from "../../../assets/asset";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useNavigate } from "react-router-dom";

export default function Topbar() {

  const user =useSelector(selectUser);
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center  ">
      <div>
        <h2 className="text-2xl font-semibold text-[#0A4F48] ">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white px-3 rounded-lg">
          <img src={assets.search} className="  w-5 h-5  " />
          <input
            type="text"
            placeholder="Search anything"
            className=" w-72 px-[10px] py-[12px] border border-none rounded-xl bg-white w-[250px] focus:outline-none "
          />
          <img src={assets.filter} className="  w-4 h-4" />
        </div>

        <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
        <img src={assets.menu} />
        
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/head/profile')}
        >
          <img src={assets.profile} className="rounded rounded-full" />
          <div>
            <p className="text-[18px] font-bold">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

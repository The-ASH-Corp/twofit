import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { useEffect } from "react";


export default function AppLayout() {
    useEffect(() => {
    document.title = "Founder Dashboard | Twofit";
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-6 pt-8.5 ">
        <TopBar />

        <div className="mt-8.5 flex-1 overflow-auto no-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

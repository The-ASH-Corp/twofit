import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { useEffect } from "react";

export default function AppLayout() {
  useEffect(() => {
    document.title = "Admin Dashboard | Twofit";
  }, []);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <TopBar />

        <div className="mt-6 flex-1 overflow-auto no-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

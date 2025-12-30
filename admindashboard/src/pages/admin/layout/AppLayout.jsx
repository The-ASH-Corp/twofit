import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { useEffect } from "react";


export default function AppLayout() {
    useEffect(() => {
    document.title = "Admin Dashboard | Twofit";
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6  ">
        <TopBar />

         <div className="mt-6">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}

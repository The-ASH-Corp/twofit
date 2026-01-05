import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { useEffect } from "react";


export default function ClientLayout() {
    useEffect(() => {
    document.title = "Client Dashboard | Twofit";
  }, []);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 p-6  ">
        <TopBar />

         <div className="mt-6 flex-1 overflow-y-auto no-scrollbar">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}

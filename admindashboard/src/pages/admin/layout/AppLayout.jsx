import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { useEffect, useState } from "react";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard | Twofit";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4F8] relative font-sans selection:bg-[#0A4F48] selection:text-white">
      {/* Sidebar - Handles its own mobile/desktop logic with isOpen */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col px-4 pt-4 md:px-8 md:pt-6 overflow-hidden min-w-0 transition-all duration-300 ease-in-out">
        <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="md:mt-8 flex-1 overflow-auto no-scrollbar ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

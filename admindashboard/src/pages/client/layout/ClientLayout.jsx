import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { useEffect, useState } from "react";

export default function ClientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Client Dashboard | Twofit";
  }, []);

  return (
    <div
      className="relative flex h-screen overflow-hidden bg-[#f6f8f4] font-sans selection:bg-[#0A4F48] selection:text-white"
    >
      {/* Sidebar - Handles its own mobile/desktop logic with isOpen */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-2 pt-2 transition-all duration-300 ease-in-out md:px-3 md:pt-2">
        <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="no-scrollbar mt-2 flex-1 overflow-auto pb-4 md:mt-1 md:pb-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

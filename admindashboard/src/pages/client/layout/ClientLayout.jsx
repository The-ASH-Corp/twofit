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
      className="flex h-screen overflow-hidden relative font-sans selection:bg-[#0A4F48] selection:text-white"
      style={{
        background:
          "linear-gradient(180deg, rgba(196, 255, 224, 1) 0%, rgba(237, 237, 237, 0.5) 96%)",
      }}
    >
      {/* Sidebar - Handles its own mobile/desktop logic with isOpen */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col px-4 pt-4 md:px-8 md:pt-6 overflow-hidden min-w-0 transition-all duration-300 ease-in-out">
        <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="mt-14 md:mt-8 flex-1 overflow-auto no-scrollbar pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

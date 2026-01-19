import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";
import { useEffect, useState } from "react";
import MobileMenu from "../components/MobileMenu";
import BottomNav from "../components/BottomNav";

export default function ClientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Client Dashboard | Twofit";
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 relative">
      {/* Sidebar - Desktop */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
      )}

      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden min-w-0 pb-20 lg:pb-6">
        <TopBar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <div className="mt-6 flex-1 overflow-auto no-scrollbar">
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
}

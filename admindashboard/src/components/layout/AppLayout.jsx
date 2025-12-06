import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";


export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        <Topbar />

         <div className="mt-6">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}

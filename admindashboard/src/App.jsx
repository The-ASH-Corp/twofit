import AppLayout from "./pages/admin/layout/AppLayout";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Common
import RoleGuard from "./routes/RoleGuard";
import Login from "./pages/Login";
import PublicRoutes from "./routes/PublicRoutes";
import Unauthorized from "./pages/Unauthorized";
//Founter Pages Imports
import FounderLayout from "./pages/founder/layout/FounderLayout";
import FounterDashboard from "./pages/founder/Dashboard";
import FounderChats from "./pages/admin/chats/Chats";
import FounderClientsTable from "./pages/admin/clients/ClientsTable";

//Admin Pages Imports
import AdminChats from "./pages/admin/chats/Chats";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminWebsite from "./pages/admin/Website";
import AdminClientsTable from "./pages/admin/clients/ClientsTable";
import AdminExpertTable from "./pages/admin/experts/ExpertTable";
import AdminProgramTable from "./pages/admin/programsList/ProgramTable";
//Head Pages Imports
//Expert Pages Imports

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />

        {/* FOUNDER */}
        <Route
          path="/founder"
          element={
            <RoleGuard allowedRoles={["founder"]}>
              <FounderLayout />
            </RoleGuard>
          }
        >
          <Route index element={<FounterDashboard />} />
          <Route path="clients" element={<FounderClientsTable />} />
          <Route path="chats" element={<FounderChats />} />
    
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRoles={["admin"]}>
              <AppLayout />
            </RoleGuard>
          }
        >
          <Route path="clients" element={<AdminClientsTable />} />
          <Route path="experts" element={<AdminExpertTable />} />
          <Route path="programs" element={<AdminProgramTable />} />
          <Route path="chats" element={<AdminChats />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="website" element={<AdminWebsite />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;

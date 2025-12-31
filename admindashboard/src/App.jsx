import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Common Page Imports
import RoleGuard from "./routes/RoleGuard";
import Login from "./pages/Login";
import PublicRoutes from "./routes/PublicRoutes";
import Unauthorized from "./pages/Unauthorized";
//Founter Pages Imports
import FounderLayout from "./pages/founder/layout/FounderLayout";
import FounterDashboard from "./pages/founder/Dashboard";
import FounderClientsTable from "./pages/admin/clients/ClientsTable";
import FounderHeadsList from "./pages/founder/heads/HeadsList";
import FounderCategoryList from "./pages/founder/category/CategoryForm"
import FounderExperList from "./pages/founder/experts/ExpertTable"
import FounderAdminList from "./pages/founder/admin/AdminsList"
import FounderProgramsList from "./pages/founder/programsList/ProgramTable"
import FounderTherapyList from "./pages/founder/therapy/TherapyForm"
import FounderWorkoutList from "./pages/founder/workout/WorkoutList"
//Head Pages Imports
import HeadLayout from "./pages/head/layout/HeadLayout";
import HeadDashboard from "./pages/head/Dashboard";
import HeadClientsTable from "./pages/head/clients/ClientsTable";
import HeadExperList from "./pages/head/experts/ExpertTable"
import HeadAdminsList from "./pages/head/admin/AdminsList"
import HeadFinanceTable from "./pages/head/finance/FinanceTable"
import HeadExpertTable from "./pages/head/experts/ExpertTable"
import HeadAddAdmin from "./pages/head/admin/AdminForm"
import HeadExpertProfile from "./pages/head/experts/ExpertProfile"
import HeadAdminProfile from "./pages/head/admin/AdminProfile"
import HeadClientProfile from "./pages/head/clients/ClientProfile"
//Admin Pages Imports
import AppLayout from "./pages/admin/layout/AppLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminChats from "./pages/admin/chats/Chats";
import AdminClientsTable from "./pages/admin/clients/ClientsTable";
import AdminExpertTable from "./pages/admin/experts/ExpertTable";
//Expert Pages Imports
import ExpertLayout from "./pages/expert/layout/ExpertLayout";
import ExpertDashboard from "./pages/expert/Dashboard";
import ExpertClientsTable from "./pages/expert/clients/ClientsTable";
import ExpertChats from "./pages/expert/chats/Chats";
// Client Pages Import

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={ <PublicRoutes> <Login />  </PublicRoutes>  }/>

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
          <Route path="heads" element={<FounderHeadsList />} />
          <Route path ="admins" element={<FounderAdminList/>}/>
          <Route path="experts" element={<FounderExperList/>}/>
          <Route path="clients" element={<FounderClientsTable />} />
          <Route path ="programs" element={<FounderProgramsList/>}/>
          <Route path="category" element={<FounderCategoryList />} />
          <Route path ="therapy" element={<FounderTherapyList/>}/>
          <Route path ="workout" element={<FounderWorkoutList/>}/>
        </Route>

        {/* HEAD */}
        <Route
          path="/head"
          element={
            <RoleGuard allowedRoles={["head"]}>
              <HeadLayout />
            </RoleGuard>
          }
        >
          <Route index element={<HeadDashboard />} />
          <Route path="admins" element={<HeadAdminsList/>}/>
          <Route path="expert" element={<HeadExperList/>}/>
          <Route path="clients" element={<HeadClientsTable />} />
          <Route path="experts" element = {<HeadExpertTable/>}/>
          <Route path="finance" element = {<HeadFinanceTable/>}/>
          <Route path ="add-admin" element={<HeadAddAdmin/>}/>
          <Route path ="experts/profile/:id" element={<HeadExpertProfile/>}/>
          <Route path ="admins/profile/:id" element={<HeadAdminProfile/>}/>
          <Route path ="clients/profile/:clientId" element={<HeadClientProfile/>}/>
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
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClientsTable />} />
          <Route path="experts" element={<AdminExpertTable />} />
          <Route path="chats" element={<AdminChats />} />
        </Route>

        {/* EXPERT */}
        <Route
          path="/expert"
          element={
            <RoleGuard allowedRoles={["expert"]}>
              <ExpertLayout />
            </RoleGuard>
          }
        >
          <Route index element={<ExpertDashboard />} />
          <Route path="clients" element={<ExpertClientsTable />} />
          <Route path="chats" element={<ExpertChats />} />
        </Route>

        <Route path="/*" element={<Unauthorized />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;

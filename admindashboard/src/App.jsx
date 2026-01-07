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
//Founder Pages Imports
import FounderLayout from "./pages/founder/layout/FounderLayout";
import FounderDashboard from "./pages/founder/Dashboard";
import FounderClientsTable from "./pages/founder/clients/ClientsTable";
import FounderClientProfile from "./pages/founder/clients/ClientProfile";
import FounderHeadsList from "./pages/founder/heads/HeadTable";
import FounderHeadsProfile from "./pages/founder/heads/HeadProfile";
import FounderHeadForm from "./pages/founder/heads/HeadForm"
import FounderCategoryList from "./pages/founder/category/CategoryTable";
import FounderExpertList from "./pages/founder/experts/ExpertTable";
import FounderExpertProfile from "./pages/founder/experts/ExpertProfile";
import FounderAdminList from "./pages/founder/admin/AdminsList";
import FounderAdminProfile from "./pages/founder/admin/AdminProfile"
import FounderProgramsList from "./pages/founder/programsList/ProgramTable";
import FounderTherapyList from "./pages/founder/therapy/TherapyTable";
import FounderTherapyForm from "./pages/founder/therapy/TherapyForm";
import FounderWorkoutList from "./pages/founder/workout/WorkoutList";
import FounderWorkoutForm from "./pages/founder/workout/WorkoutForm"
import FounderFinanceList from "./pages/founder/finance/FinanceTable";
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
import HeadProgramTable from "./pages/head/programsList/ProgramTable"

//Admin Pages Imports
import AppLayout from "./pages/admin/layout/AppLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminChats from "./pages/admin/chats/Chats";
import AdminClientsTable from "./pages/admin/clients/ClientsTable";
import AdminExpertTable from "./pages/admin/experts/ExpertTable";
import AdminFinance from "./pages/admin/finance/FinanceTable"
import AdminAddExpert from "./pages/admin/experts/ExpertForm"
import AdminExpertProfile from "./pages/admin/experts/ExpertProfile";
import AdminClientProfile from "./pages/admin/clients/ClientProfile";
import AdminAddClient from "./pages/admin/clients/ClientForm";
//Expert Pages Imports
import ExpertLayout from "./pages/expert/layout/ExpertLayout";
import ExpertDashboard from "./pages/expert/Dashboard";
import ExpertClientsTable from "./pages/expert/clients/ClientsTable";
import ExpertChats from "./pages/expert/chats/Chats";
// Client Pages Import
import ClientLayout from './pages/client/layout/ClientLayout'
import ClientDashboard from './pages/client/Dashboard'
import ClientFeedback from "./pages/client/feedback/Feedback";
import ClientProgress from "./pages/client/progress/Progress";
import DailyPlan from "./pages/client/dailyPlan/DailyPlan";
import ClientChat from "./pages/client/chats/Chats"

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            // <PublicRoutes>
              //  {" "}
              <Login />
              // {" "}
          //  </PublicRoutes>
           
               
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
          <Route index element={<FounderDashboard />} />
          <Route path="heads" element={<FounderHeadsList />} />
          <Route path="heads/profile/:id" element={<FounderHeadsProfile />} />
          <Route path="heads/create" element={<FounderHeadForm />} />
          <Route path="admins" element={<FounderAdminList />} />
          <Route path="admins/profile/:id" element={<FounderAdminProfile />} />
          <Route path="experts" element={<FounderExpertList />} />
          <Route
            path="experts/profile/:id"
            element={<FounderExpertProfile />}
          />
          <Route path="clients" element={<FounderClientsTable />} />
          <Route
            path="clients/profile/:id"
            element={<FounderClientProfile />}
          />
          <Route path="programs" element={<FounderProgramsList />} />
          <Route path="category" element={<FounderCategoryList />} />
          <Route path="finance" element={<FounderFinanceList />} />
          <Route path="therapy" element={<FounderTherapyList />} />
          <Route path="add-therapy" element={<FounderTherapyForm />} />
          <Route path="workout" element={<FounderWorkoutList />} />
          <Route path="workout/create" element={<FounderWorkoutForm />} />
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
          <Route path="admins" element={<HeadAdminsList />} />
          <Route path="expert" element={<HeadExperList />} />
          <Route path="clients" element={<HeadClientsTable />} />
          <Route path="experts" element={<HeadExpertTable />} />
          <Route path="finance" element={<HeadFinanceTable />} />
          <Route path="admins/add-admin" element={<HeadAddAdmin />} />
          <Route path="experts/profile/:id" element={<HeadExpertProfile />} />
          <Route path="admins/profile/:id" element={<HeadAdminProfile />} />
          <Route
            path="clients/profile/:clientId"
            element={<HeadClientProfile />}
          />
          <Route path="programs" element={<HeadProgramTable />} />
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
          <Route path ="finance" element={<AdminFinance/>}/>
          <Route path="experts/addexpert" element={<AdminAddExpert />} />
          <Route path="experts/profile/:expertId" element={<AdminExpertProfile />} />
          <Route path="clients/profile/:id" element={<AdminClientProfile />} />
          <Route path="clients/addclient" element={<AdminAddClient />} />
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

        {/* CLIENT */}
       


        <Route
          path="/client"
          element={
            <RoleGuard allowedRoles={["user"]}>
              <ClientLayout />
            </RoleGuard>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="feedback" element={<ClientFeedback />} />
          <Route path="progress" element={<ClientProgress />} />
          <Route path="daily-plan" element={<DailyPlan/>} />
          <Route path="chats" element={<ClientChat/>}/>
        </Route>

        <Route path="/*" element={<Unauthorized />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;

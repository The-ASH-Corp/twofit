import AppLayout from "./components/layout/AppLayout";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import Clients from "./pages/Clients";
import Experts from "./pages/Experts";
import Programs from "./pages/Programs";
import Finance from "./pages/Finance";
import Chats from "./pages/Chats";
import Analytics from "./pages/Analytics";
import Website from "./pages/Website";
import ClientsTable from "./pages/clients/ClientsTable";
// import Dashboard from "./pages/Dashboard";
import ExpertTable from "./pages/experts/ExpertTable";
import ProgramTable from "./pages/programsList/ProgramTable";
import Login from "./pages/Login";
import ClientForm from "./pages/clients/ClientForm";
import ExpertForm from "./pages/experts/ExpertForm";
import FinanceTable from "./pages/finance/FinanceTable";
import ClientProfile from "./pages/clients/ClientProfile";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import ExpertProfile from "./pages/experts/ExpertProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/login" element={<PublicRoutes><Login/></PublicRoutes>}/>
        
        <Route path="/" element={  <ProtectedRoutes><AppLayout/></ProtectedRoutes> }  >
        {/* <Route path="/" element={ <ProtectedRoutes><Dashboard/></ProtectedRoutes>}/> */}
        <Route path="/clients" element={<ClientsTable />} />
        <Route path="/clients/clientProfile/:clientId" element={<ClientProfile/>} />
        <Route path="/addclient" element={<ClientForm/>}/>
        <Route path="/experts" element={<ExpertTable />} />
        <Route path="/addexpert" element={<ExpertForm/>}/>
        <Route path="/programs" element={<ProgramTable/>} />
        
        <Route path="/finance" element={<FinanceTable/>} />
        <Route path="/chats" element={<Chats />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="/website" element={<Website />} />
</Route>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientsTable />} />
          <Route
            path="/clients/profile/:clientId"
            element={<ClientProfile />}
          />
          <Route path="/addclient" element={<ClientForm />} />
          <Route path="/experts" element={<ExpertTable />} />
          <Route path="/experts" element={<ExpertTable />} />
          <Route path="/experts/profile/:expertId" element={<ExpertProfile />} />
          <Route path="/programs" element={<ProgramTable />} />

          <Route path="/finance" element={<FinanceTable />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="/website" element={<Website />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientComplianceStats,
  getClient,
} from "@/redux/features/client/client.thunk";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectSelectedClient,
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { SyncLoader } from "react-spinners";
import ExpertClientProfileLeftSide from "@/components/clients/ExpertClientProfileLeftSide";
import ExpertClientProfileCenterSide from "@/components/clients/ExpertClientProfileCenterSide";
import ExpertClientProfileRightSide from "@/components/clients/ExpertClientProfileRightSide";
import { selectCoachDashboardStats } from "@/redux/features/coach/coach.selector";
import { getAllUserSubmissions } from "@/redux/features/tasks/task.thunk";
import AssignDietPlanDrawer from "./AssignDietPlanDrawer";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { ENV } from "@/utils/env";
import { ArrowLeft } from "lucide-react";

const ClientProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clientComplianceStats, setClientComplianceStats] = useState(null);
  const [isDietDrawerOpen, setIsDietDrawerOpen] = useState(false);
  const { id } = useParams();

  const user = useSelector(selectUser);
  const client = useSelector(selectSelectedClient);
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);
  const dashboardStats = useSelector(selectCoachDashboardStats);
  const { selectedUserTasks } = useSelector((state) => state.tasks);

  const handleViewDietPlan = () => {
    if (!client?.dietPlanPdf) return;
    const baseUrl = ENV.API_BASE_URL?.replace("/api/v1", "");
    const pdfUrl = client.dietPlanPdf.startsWith("http")
      ? client.dietPlanPdf
      : `${baseUrl}${client.dietPlanPdf}`;
    window.open(pdfUrl, "_blank");
  };

  useEffect(() => {
    if (id) {
      dispatch(getClient({ id }));
      dispatch(getAllUserSubmissions(id));
      dispatch(fetchClientComplianceStats(id))
        .unwrap()
        .then((res) => {
          setClientComplianceStats(res);
        });
    }
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#f8fafc]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );
  if (error) return <p className="text-red-500 p-8 text-center">{error}</p>;

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-156px)] font-sans bg-[#F8FAFC] p-4 sm:p-6 rounded-3xl">
      {/* Header with Breadcrumb-like feel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0A4F48] hover:border-[#0A4F48] transition-all shadow-sm hover:shadow-md shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight leading-none">Client Profile</h1>
            <p className="text-sm text-[#64748B] font-medium mt-1">Manage progress & expert assignments</p>
          </div>
        </div>

        {/* Conditional Diet plan buttons */}
        <div className="flex items-center gap-3">
          {user?.role === "Dietician" && !client?.dietPlanPdf && (
            <button
              onClick={() => setIsDietDrawerOpen(true)}
              className="bg-[#0A4F48] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10 hover:bg-[#083d37] transition-all"
            >
              Add Diet Plan
            </button>
          )}
          {client?.dietPlanPdf && user?.role === "Dietician" && (
            <button
              onClick={handleViewDietPlan}
              className="bg-white text-[#0A4F48] border border-[#0A4F48]/20 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-sm"
            >
              View Diet Plan
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-visible lg:overflow-hidden pb-2">
        {/* Left Column - 25% */}
        <div className="lg:col-span-1 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ExpertClientProfileLeftSide
            client={client}
            clientComplianceStats={clientComplianceStats}
            dashboardStats={dashboardStats}
          />
        </div>
        
        {/* Center Column - 50% */}
        <div className="lg:col-span-2 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ExpertClientProfileCenterSide
            client={client}
            pendingTasks={selectedUserTasks}
          />
        </div>
        
        {/* Right Column - 25% */}
        <div className="lg:col-span-1 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ExpertClientProfileRightSide
            client={client}
          />
        </div>
      </div>

      <AssignDietPlanDrawer
        isOpen={isDietDrawerOpen}
        onClose={() => setIsDietDrawerOpen(false)}
        clientId={id}
      />
    </div>
  );
};

export default ClientProfile;

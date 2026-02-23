import React, { useEffect, useState } from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import ProfileCenterSide from "@/components/clients/ProfileCenterSide";
import ProfileRightSide from "@/components/clients/ProfileRightSide";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientComplianceStats, getClient } from "@/redux/features/client/client.thunk";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectSelectedClient,
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { SyncLoader } from "react-spinners";
import { ArrowLeft } from "lucide-react";

const ClientProfile = () => {
  const [complianceStats, setComplianceStats] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const client = useSelector(selectSelectedClient);
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);

  const fetchData = async () => {
    dispatch(getClient({ id: id }));
    const compliance = await dispatch(fetchClientComplianceStats(id)).unwrap();
    setComplianceStats(compliance);
  }
  
  useEffect(() => {
     fetchData();   
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#f8fafc]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );
  if (error) return <p className="text-red-500 p-8 text-center">{error}</p>;

  return (
    <div className="flex flex-col gap-6 w-full min-h-[calc(100dvh-32px)] lg:h-[calc(100vh-32px)] overflow-y-auto lg:overflow-hidden font-sans bg-[#F8FAFC] p-4 sm:p-6 rounded-3xl">
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
            <p className="text-sm text-[#64748B] font-medium mt-1">Detailed view of client progress & data</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-visible lg:overflow-hidden pb-2">
        {/* Left Column (Profile Card) - 25% */}
        <div className="lg:col-span-1 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ProfileLeftSide client={client} complianceStats={complianceStats} />
        </div>
        
        {/* Center Column (Details) - 50% */}
        <div className="lg:col-span-2 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ProfileCenterSide client={client} />
        </div>
        
        {/* Right Column (Stats) - 25% */}
        <div className="lg:col-span-1 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ProfileRightSide client={client} />
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;

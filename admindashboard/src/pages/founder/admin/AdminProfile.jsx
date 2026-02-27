import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { ArrowLeft, UserCog } from "lucide-react";

import AdminCenterSide from "@/components/admin/AdminCenterSide";
import AdminLeftSide from "@/components/admin/AdminLeftSide";
import AdminRightSide from "@/components/admin/AdminRightSide";
import {
  getAdminProfile,
  getDashboardData,
} from "@/redux/features/admins/admin.thunk";
import {
  getAdminError,
  getAdminStatus,
  getSelectedAdmin,
  selectAdminDashboardData,
} from "@/redux/features/admins/admins.selecters";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const expert = useSelector(getSelectedAdmin);
  const dashboardData = useSelector(selectAdminDashboardData);
  const status = useSelector(getAdminStatus);
  const error = useSelector(getAdminError);

  useEffect(() => {
    if (id) {
      dispatch(getAdminProfile(id));
      dispatch(getDashboardData({ adminId: id, duration: "12m" }));
    }
  }, [id, dispatch]);

  if (status === "loading" && !expert)
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#f8fafc]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );
  if (error) return <p className="text-red-500 p-8 text-center">{error}</p>;

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-32px)] overflow-hidden font-sans bg-[#F8FAFC] p-4 sm:p-6 rounded-3xl">
      {/* Header with Breadcrumb-like feel */}
      <div className="flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3 sm:gap-4">
            <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0A4F48] hover:border-[#0A4F48] transition-all shadow-sm hover:shadow-md active:scale-95"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-none">Admin Profile</h1>
                <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-1">Manage and view detailed information</p>
            </div>
        </div>
        
        {/* Edit Action */}
        {/* <button
          className="group px-4 py-2 sm:px-5 sm:py-2.5 bg-[#0A4F48] text-white rounded-xl text-xs sm:text-sm font-bold shadow-[0_4px_14px_-4px_rgba(10,79,72,0.5)] hover:bg-[#093E39] hover:shadow-[0_6px_20px_-4px_rgba(10,79,72,0.6)] active:scale-95 transition-all duration-200 flex items-center gap-2"
        >
          <UserCog size={16} className="group-hover:rotate-12 transition-transform sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">Edit</span>
        </button> */}
      </div>

      {/* Main Content Grid - Responsive Layout */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2 min-h-min lg:h-full">
            {/* Left Column (Profile Card) - 35% */}
            <div className="lg:col-span-4 h-max lg:h-full">
                <AdminLeftSide admin={expert} />
            </div>
            
            {/* Center Column (Details) - 35% */}
            <div className="lg:col-span-5 h-max lg:h-full">
                <AdminCenterSide admin={expert} />
            </div>
            
            {/* Right Column (Stats) - 30% */}
            <div className="lg:col-span-3 h-max lg:h-full">
                <AdminRightSide admin={expert} dashboardData={dashboardData} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

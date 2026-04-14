import AdminCenterSide from "@/components/admin/AdminCenterSide";
import AdminLeftSide from "@/components/admin/AdminLeftSide";
import AdminRightSide from "@/components/admin/AdminRightSide";
import { getAdminProfile, getDashboardData } from "@/redux/features/admins/admin.thunk";
import {
  getAdminError,
  getAdminStatus,
  getSelectedAdmin,
} from "@/redux/features/admins/admins.selecters";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const admin = useSelector(getSelectedAdmin);
  const status = useSelector(getAdminStatus);
  const error = useSelector(getAdminError);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getAdminProfile(id));
      dispatch(getDashboardData({ adminId: id, duration: "12m" })).then(
        (res) => {
          setDashboardData(res.payload);
        },
      );
    }
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-120px)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[#0A4F48]">Profile Details</h1>
        <button 
          className="w-full sm:w-auto px-6 py-2.5 bg-[#0A4F48] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0A4F48]/20 hover:bg-[#073a35] hover:shadow-xl hover:shadow-[#0A4F48]/30 transition-all active:scale-95" 
          onClick={() => navigate(`/head/admins/edit/${id}`)}
        >
          Edit Profile
        </button>
      </div>

    <div className="flex flex-col lg:flex-row flex-1 justify-between w-full gap-4 h-[calc(100vh-110px)] overflow-auto no-scrollbar pb-6">
      {/* left */}
      <div className="w-full lg:w-[38%]">
        <AdminLeftSide admin={admin} />
      </div>
      {/* center */}
      <div className="w-full lg:w-[38%]">
        <AdminCenterSide admin={admin} />
      </div>
      {/* right */}
      <div className="w-full lg:w-[24%]">
        <AdminRightSide admin={admin} dashboardData={dashboardData} />
      </div>
    </div>
    </div>
  );
};

export default AdminProfile;

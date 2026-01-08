import AdminCenterSide from "@/components/admin/AdminCenterSide";
import AdminLeftSide from "@/components/admin/AdminLeftSide";
import AdminRightSide from "@/components/admin/AdminRightSide";
import { getAdminProfile } from "@/redux/features/admins/admin.thunk";
import {
  getAdminError,
  getAdminStatus,
  getSelectedAdmin,
} from "@/redux/features/admins/admins.selecters";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);

  const expert = useSelector(getSelectedAdmin);
  const status = useSelector(getAdminStatus);
  const error = useSelector(getAdminError);

  useEffect(() => {
    if (id) {
      dispatch(getAdminProfile(id));
      //  console.log(expert);
    }
  }, [id, dispatch]);
  //  console.log(expert);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-1 justify-between w-full gap-4 overflow-auto no-scrollbar pb-6">
      {/* left */}
      <AdminLeftSide admin={expert} />
      {/* center */}
      <AdminCenterSide admin={expert} />
      {/* right */}
      <AdminRightSide admin={expert} />
    </div>
  );
};

export default AdminProfile;

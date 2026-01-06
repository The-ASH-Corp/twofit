import AdminCenterSide from "@/components/admin/AdminCenterSide";
import AdminLeftSide from "@/components/admin/AdminLeftSide";
import AdminRightSide from "@/components/admin/AdminRightSide";
import { getAdminProfile } from "@/redux/features/admins/admin.thunk";
import { getAdminError, getAdminStatus, getSelectedAdmin } from "@/redux/features/admins/admins.selecters";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";




const AdminProfile = () => {
  const dispatch = useDispatch();
   const  {id}  = useParams();

     const admin = useSelector(getSelectedAdmin);
    const status = useSelector(getAdminStatus);
    const error = useSelector(getAdminError);

   useEffect(() => {
     if (id) {
       dispatch(getAdminProfile(id));
     }
   }, [id, dispatch]);

   if (status === "loading") return <p>Loading...</p>;
   if (error) return <p className="text-red-500">{error}</p>;
   
  return (
    <div className="flex justify-between w-full gap-4 h-[calc(100vh-120px)]">
      {/* left */}
      <AdminLeftSide admin = {admin}/>
      {/* center */}
      <AdminCenterSide  admin = {admin}/>
      {/* right */}
      <AdminRightSide  admin = {admin}/>
    </div>
  );
};

export default AdminProfile;

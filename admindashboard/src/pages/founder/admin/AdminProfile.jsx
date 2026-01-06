import ExpertCenterSide from "@/components/experts/ExpertCenterSide";
import ExpertLeftSide from "@/components/experts/ExpertLeftSide";
import ExpertRightSide from "@/components/experts/ExpertRightSide";
import { getAdminProfile } from "@/redux/features/admins/admin.thunk";
import { getAdminError, getAdminStatus, getSelectedAdmin } from "@/redux/features/admins/admins.selecters";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";




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

   if (status === "loading") return <p>Loading...</p>;
   if (error) return <p className="text-red-500">{error}</p>;
   
  return (
    <div className="flex justify-between w-full gap-4 h-[calc(100vh-120px)]">
      {/* left */}
      {/* <ExpertLeftSide expert = {expert}/> */}
      {/* center */}
      <ExpertCenterSide />
      {/* right */}
      <ExpertRightSide />
    </div>
  );
};

export default AdminProfile;

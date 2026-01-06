import ExpertCenterSide from "@/components/experts/ExpertCenterSide";
import ExpertLeftSide from "@/components/experts/ExpertLeftSide";
import ExpertRightSide from "@/components/experts/ExpertRightSide";
import { selectHead, selectHeadError, selectHeadStatus } from "@/redux/features/head/head.selectors";
import { getHead } from "@/redux/features/head/head.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";




const ExpertProfile = () => {
  const dispatch = useDispatch();
   const { id } = useParams();
   console.log(id);

     const expert = useSelector(selectHead);
     const status = useSelector(selectHeadStatus);
     const error = useSelector(selectHeadError);

   useEffect(() => {
     if (id) {
       dispatch(getHead(id));
       //  console.log(expert);
     }
   }, [id, dispatch]);
  //  console.log(expert);

   if (status === "loading") return <p>Loading...</p>;
   if (error) return <p className="text-red-500">{error}</p>;
   
  return (
    <div className="flex flex-col items-center w-full gap-4 h-[calc(100vh-120px)] overflow-auto  no-scrollbar">
      {/* heading */}
      <div className="flex justify-between items-center w-full">
        <h2 className="text-[#0A4F48] text-[16px] font-bold">
          Profile Details
        </h2>
        <button className="bg-[#0A4F48] px-3.5 py-2.5 text-white text-[12px] font-semibold rounded-lg">
          Edit Profile
        </button>
      </div>
      {/* content */}
      <div className="flex justify-between items-start gap-4 w-full">
        <div className="w-[37%] bg-amber-100">d</div>
        <div className="w-[37%] bg-amber-100">d</div>
        <div className="w-[26%] bg-amber-100">d</div>
      </div>
    </div>
  );
};

export default ExpertProfile;

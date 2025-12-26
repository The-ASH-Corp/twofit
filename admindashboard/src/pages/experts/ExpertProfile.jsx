import ExpertCenterSide from "@/components/experts/ExpertCenterSide";
import ExpertLeftSide from "@/components/experts/ExpertLeftSide";
import ExpertRightSide from "@/components/experts/ExpertRightSide";
import { selectCoachById, selectCoachError, selectCoachStatus } from "@/redux/features/coach/coach.selector";
import { getSingleCoach } from "@/redux/features/coach/coach.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";




const ExpertProfile = () => {
  const dispatch = useDispatch();
   const { expertId } = useParams();
   console.log(expertId)

     const expert = useSelector(selectCoachById);
     const status = useSelector(selectCoachStatus);
     const error = useSelector(selectCoachError);

   useEffect(() => {
     if (expertId) {
       dispatch(getSingleCoach(expertId ));
      //  console.log(expert);
     }
   }, [expertId, dispatch]);
  //  console.log(expert);

   if (status === "loading") return <p>Loading...</p>;
   if (error) return <p className="text-red-500">{error}</p>;
   
  return (
    <div className="flex justify-between w-full gap-4 h-[calc(100vh-120px)]">
      {/* left */}
      <ExpertLeftSide expert = {expert}/>
      {/* center */}
      <ExpertCenterSide />
      {/* right */}
      <ExpertRightSide />
    </div>
  );
};

export default ExpertProfile;

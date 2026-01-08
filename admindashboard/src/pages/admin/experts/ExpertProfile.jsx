import ExpertCenterSide from "@/components/experts/ExpertCenterSide";
import ExpertLeftSide from "@/components/experts/ExpertLeftSide";
import ExpertRightSide from "@/components/experts/ExpertRightSide";
import {
  selectCoachById,
  selectCoachError,
  selectCoachStatus,
} from "@/redux/features/coach/coach.selector";
import { getSingleCoach } from "@/redux/features/coach/coach.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const ExpertProfile = () => {
  const dispatch = useDispatch();
  const { expertId } = useParams();

  const expert = useSelector(selectCoachById);
  const status = useSelector(selectCoachStatus);
  const error = useSelector(selectCoachError);

  useEffect(() => {
    if (expertId) {
      dispatch(getSingleCoach(expertId));
    }
  }, [expertId, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex gap-6 w-full min-h-[calc(100vh-110px)] bg-[#F8F9FA] p-2 overflow-hidden">
      {/* left sidebar */}
      <ExpertLeftSide expert={expert} />

      {/* center content */}
      <ExpertCenterSide expert={expert} />

      {/* right sidebar */}
      <ExpertRightSide expert={expert} />
    </div>
  );
};

export default ExpertProfile;

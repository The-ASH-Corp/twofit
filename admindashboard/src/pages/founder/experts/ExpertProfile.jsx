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
  const { id } = useParams();
  console.log(id);

  const expert = useSelector(selectCoachById);
  const status = useSelector(selectCoachStatus);
  const error = useSelector(selectCoachError);

  useEffect(() => {
    if (id) {
      dispatch(getSingleCoach(id));
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

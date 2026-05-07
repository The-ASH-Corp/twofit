import ExpertCenterSide from "@/components/experts/ExpertCenterSide";
import ExpertLeftSide from "@/components/experts/ExpertLeftSide";
import ExpertRightSide from "@/components/experts/ExpertRightSide";
import {
  selectCoachById,
  selectCoachError,
  selectCoachStatus,
} from "@/redux/features/coach/coach.selector";
import { getSingleCoach } from "@/redux/features/coach/coach.thunk";
import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const ExpertProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const expert = useSelector(selectCoachById);
  const status = useSelector(selectCoachStatus);
  const error = useSelector(selectCoachError);

  useEffect(() => {
    if (id) {
      dispatch(getSingleCoach(id));
    }
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#f8fafc]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );
  if (error) return <p className="text-red-500 p-8 text-center">{error}</p>;

  return (
    <div className="flex w-full min-h-0 flex-col gap-4 rounded-2xl bg-[#F8FAFC] p-3 font-sans sm:gap-6 sm:rounded-3xl sm:p-5 lg:h-[calc(100dvh-156px)] lg:p-6">
      {/* Header with Breadcrumb-like feel */}
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0A4F48] hover:border-[#0A4F48] transition-all shadow-sm hover:shadow-md shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black leading-none tracking-tight text-[#0F172A] sm:text-2xl">
              Expert Profile
            </h1>
            <p className="mt-1 text-xs font-medium text-[#64748B] sm:text-sm">
              Manage and view detailed information
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid flex-1 min-h-0 grid-cols-1 gap-4 pb-1 sm:gap-6 xl:grid-cols-12 xl:overflow-hidden">
        {/* Left Column */}
        <div className="h-auto min-h-0 xl:col-span-3 xl:h-full xl:overflow-y-auto xl:pr-1 xl:[&::-webkit-scrollbar]:hidden xl:[-ms-overflow-style:none] xl:[scrollbar-width:none]">
          <ExpertLeftSide expert={expert} />
        </div>

        {/* Center Column */}
        <div className="h-auto min-h-0 xl:col-span-5 xl:h-full xl:overflow-y-auto xl:pr-1 xl:[&::-webkit-scrollbar]:hidden xl:[-ms-overflow-style:none] xl:[scrollbar-width:none]">
          <ExpertCenterSide expert={expert} />
        </div>

        {/* Right Column */}
        <div className="h-auto min-h-0 xl:col-span-4 xl:h-full xl:overflow-y-auto xl:pr-1 xl:[&::-webkit-scrollbar]:hidden xl:[-ms-overflow-style:none] xl:[scrollbar-width:none]">
          <ExpertRightSide expert={expert} />
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;

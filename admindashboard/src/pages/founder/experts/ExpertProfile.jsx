import ExpertCenterSide from "@/components/experts/ExpertCenterSide";
import ExpertLeftSide from "@/components/experts/ExpertLeftSide";
import ExpertRightSide from "@/components/experts/ExpertRightSide";
import {
  selectCoachById,
  selectCoachError,
  selectCoachStatus,
} from "@/redux/features/coach/coach.selector";
import { getSingleCoach } from "@/redux/features/coach/coach.thunk";
import { ArrowLeft, UserCog } from "lucide-react";
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
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-156px)] font-sans bg-[#F8FAFC] p-4 sm:p-6 rounded-3xl">
      {/* Header with Breadcrumb-like feel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0A4F48] hover:border-[#0A4F48] transition-all shadow-sm hover:shadow-md shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight leading-none">
              Expert Profile
            </h1>
            <p className="text-sm text-[#64748B] font-medium mt-1">
              Manage and view detailed information
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-visible lg:overflow-hidden pb-2">
        {/* Left Column (Profile Card) - 30% */}
        <div className="lg:col-span-3 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ExpertLeftSide expert={expert} />
        </div>

        {/* Center Column (Details) - 40% */}
        <div className="lg:col-span-6 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ExpertCenterSide expert={expert} />
        </div>

        {/* Right Column (Stats) - 30% */}
        <div className="lg:col-span-3 h-auto lg:h-full lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:pr-2">
          <ExpertRightSide expert={expert} />
        </div>
      </div>
    </div>
  );
};


export default ExpertProfile;

import {
  selectHeadError,
  selectHeadStatus,
  selectHead,
  selectHeadPerformance,
} from "@/redux/features/head/head.selectors";
import {  getHead, getHeadPerformance } from "@/redux/features/head/head.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import HeadCenterSide from "@/components/head/HeadCenterSide";
import HeadLeftSide from "@/components/head/HeadLeftSide";
import HeadRightSide from "@/components/head/HeadRightSide";
import { ArrowLeft, UserCog } from "lucide-react";

const HeadProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const head = useSelector(selectHead);
  const performance = useSelector(selectHeadPerformance);
  const status = useSelector(selectHeadStatus);
  const error = useSelector(selectHeadError);
  console.log(id)

  useEffect(() => {
    if (id) {
      dispatch(getHead(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getHeadPerformance({ headId: id }));
    }
  }, [id, dispatch]);

  if (status === "loading" && !head)
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#f8fafc]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );
  if (error) return <p className="text-red-500 p-8 text-center">{error}</p>;

  return (
    <div className="flex flex-col gap-6 w-full min-h-[calc(100dvh-32px)] lg:h-[calc(100vh-32px)] overflow-y-auto lg:overflow-hidden font-sans bg-[#F8FAFC] p-4 sm:p-6 rounded-3xl">
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
              Head Profile
            </h1>
            <p className="text-sm text-[#64748B] font-medium mt-1">
              Manage and view detailed information
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/founder/heads/edit/${id}`)}
          className="group w-full sm:w-auto px-5 py-2.5 bg-[#0A4F48] text-white rounded-xl text-sm font-bold shadow-[0_4px_14px_-4px_rgba(10,79,72,0.5)] hover:bg-[#093E39] hover:shadow-[0_6px_20px_-4px_rgba(10,79,72,0.6)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5"
        >
          <UserCog
            size={18}
            className="group-hover:rotate-12 transition-transform"
          />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 lg:overflow-hidden pb-2">
        {/* Left Column (Profile Card) - 35% */}
        <div className="lg:col-span-4 h-auto lg:h-full lg:overflow-hidden">
          <HeadLeftSide Head={head} />
        </div>

        {/* Center Column (Details) - 35% */}
        <div className="lg:col-span-5 h-auto lg:h-full lg:overflow-hidden">
          <HeadCenterSide Head={head} />
        </div>

        {/* Right Column (Stats) - 30% */}
        <div className="lg:col-span-3 h-auto lg:h-full lg:overflow-hidden">
          <HeadRightSide dashboardData={performance} />
        </div>
      </div>
    </div>
  );
};

export default HeadProfile;

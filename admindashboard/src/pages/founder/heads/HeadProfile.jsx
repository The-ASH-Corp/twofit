import HeadCenterSide from "@/components/head/HeadCenterSide";
import HeadLeftSide from "@/components/head/HeadLeftSide";
import HeadRightSide from "@/components/head/HeadRightSide";
import {
  selectHead,
  selectHeadError,
  selectHeadStatus,
} from "@/redux/features/head/head.selectors";
import { getHead } from "@/redux/features/head/head.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const HeadProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { id } = useParams();

  const head = useSelector(selectHead);
  const status = useSelector(selectHeadStatus);
  const error = useSelector(selectHeadError);

  useEffect(() => {
    if (id) {
      dispatch(getHead(id));
    }
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-120px)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0A4F48]">Profile Details</h1>
        <button
          onClick={() => navigate(`/founder/heads/edit/${id}`)}
          className="px-5 py-2 bg-[#0A4F48] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#073a35] transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 justify-between w-full gap-4 h-[calc(100vh-110px)] overflow-auto no-scrollbar pb-6">
        {/* left */}
        <div className="w-full lg:w-[38%]">
          <HeadLeftSide Head={head} />
        </div>
        {/* center */}
        <div className="w-full lg:w-[38%]">
          <HeadCenterSide Head={head} />
        </div>
        {/* right */}
        <div className="w-full lg:w-[24%]">
          <HeadRightSide Head={head} />
        </div>
      </div>
    </div>
  );
};

export default HeadProfile;

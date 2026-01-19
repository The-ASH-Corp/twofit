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
import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const HeadProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);

  const head = useSelector(selectHead);
  const status = useSelector(selectHeadStatus);
  const error = useSelector(selectHeadError);

  useEffect(() => {
    if (id) {
      dispatch(getHead(id));
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
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-120px)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0A4F48]">Profile Details</h1>
        <button className="px-5 py-2 bg-[#0A4F48] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#073a35] transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="flex flex-1 justify-between w-full gap-4 overflow-auto no-scrollbar pb-6">
        {/* left */}
        <HeadLeftSide Head={head} />
        {/* center */}
        <HeadCenterSide Head={head} />
        {/* right */}
        <HeadRightSide Head={head} />
      </div>
    </div>
  );
};

export default HeadProfile;

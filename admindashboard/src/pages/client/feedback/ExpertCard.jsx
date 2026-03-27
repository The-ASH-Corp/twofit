import { assets } from "@/assets/asset";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";
import { AiFillStar } from "react-icons/ai";

export default function ExpertCard({ fetchFeedbackData, ratedExpertIds = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const user = useAppSelector(selectUser);
  const [experts, setExperts] = useState([]);

  const dispatch = useDispatch();
  const fetchExperts = async () => {
    try {
      const coaches = await dispatch(
        getAllCoachesByAdmin([user?.trainer, user?.therapist, user?.dietition]),
      ).unwrap();

      setExperts(
        coaches.filter((coach) => coach !== null && coach !== undefined),
      );
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };
  useEffect(() => {
    fetchExperts();
  }, []);

  const renderStars = (rating = 5) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <AiFillStar
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-[#F5BA02]" : "text-gray-200"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
        {experts.map((expert, index) => {
          const isRated = ratedExpertIds.includes(expert?._id);
          // Mock data for rating and reviews if not present
          const rating = expert?.rating || (4.5 + Math.random() * 0.5).toFixed(1);
          const reviewsCount = expert?.reviewsCount || Math.floor(Math.random() * 200) + 50;

          return (
            <div
              key={index}
              className="bg-white rounded-[40px] p-8 border border-gray-50 flex flex-col items-center text-center relative shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Active Badge */}
              <div className="absolute top-8 right-8 bg-[#E6F8F3] text-[#45C4A2] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
                ACTIVE
              </div>

              {/* Avatar */}
              <div className="mb-4">
                <img
                  src={expert?.profile || assets.profile}
                  alt={expert.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
                />
              </div>

              {/* Info */}
              <div className="space-y-1 mb-4">
                <h3 className="text-xl font-bold text-[#0F172A]">{expert?.name || "Live Expert"}</h3>
                <p className="text-[11px] font-bold text-[#45C4A2] tracking-[0.2em] uppercase">
                  {expert?.qualification || "MBBS"} | {expert?.experience || "5 YEARS EXP"}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-8">
                {renderStars(rating)}
                <span className="text-sm font-bold text-gray-700">{rating}</span>
                <span className="text-sm text-gray-400 font-medium">({reviewsCount} reviews)</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (!isRated) {
                    setSelectedExpert(expert);
                    setIsOpen(true);
                  }
                }}
                disabled={isRated}
                className={`w-full py-3.5 rounded-full font-bold text-sm transition-all border-2 ${
                  isRated
                    ? "bg-gray-100 border-transparent text-gray-400 cursor-not-allowed"
                    : "border-[#0A4F48] text-[#0A4F48] hover:bg-[#0A4F48] hover:text-white"
                }`}
              >
                {isRated ? "Already Rated" : "View Full Profile"}
              </button>
            </div>
          );
        })}
      </div>

      {isOpen && (
        <Modal
          expert={selectedExpert}
          onClose={() => setIsOpen(false)}
          fetchFeedbackData={fetchFeedbackData}
        />
      )}
    </>
  );
}

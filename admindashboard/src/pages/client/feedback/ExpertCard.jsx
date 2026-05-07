import { assets } from "@/assets/asset";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useDispatch } from "react-redux";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";
import { AiFillStar } from "react-icons/ai";
import { ENV } from "@/utils/env";
import { dualEdgeDepthShadow, protocolIconDepthShadow, reflectionFieldDepthShadow } from "../habit/HabitTracker";
import { getProgramById } from "@/redux/features/program/program.thunk";

export default function ExpertCard({ fetchFeedbackData, ratedExpertIds = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const user = useAppSelector(selectUser);
  const [experts, setExperts] = useState([]);
  const [duration,setDuration] = useState(null)

  const dispatch = useDispatch();
  const fetchExperts = async () => {
    try {
      const coaches = await dispatch(
        getAllCoachesByAdmin([user?.trainer, user?.therapist, user?.dietition]),
      ).unwrap();

      setExperts(
        coaches.filter((coach) => coach !== null && coach !== undefined),
      );

      await dispatch(getProgramById(user?.programType)).unwrap().then((data) => {
        setDuration(data?.data?.plan?.duration.split(" ")[0])
      })
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };
  useEffect(() => {
    fetchExperts();
  }, []);
  
  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const baseUrl = (ENV.API_BASE_URL || "").replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  const getExpertImage = (expert) => {
    if (expert?.image) return getFileUrl(expert.image);
    if (expert?.profile) return expert.profile;
    const role = (expert?.role || "").toLowerCase();
    if (role.includes("trainer")) return assets.trainerCartoon;
    if (role.includes("diet") || role.includes("nutrition")) return assets.dietitianCartoon;
    if (role.includes("therapist") || role.includes("therapy")) return assets.therapistCartoon;
    return assets.profile;
  };

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
  const getRatingInfo = () => {
    if (!user?.programEndDate) return { canRate: false, status: 'none' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(user.programEndDate);
    endDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 7) {
      return { 
        canRate: false, 
        daysUntilWindow: daysLeft - 7, 
        status: 'upcoming' 
      };
    } else {
      // Once we are within 7 days of the end, or past it, rating is enabled permanently
      return { 
        canRate: true, 
        status: 'active' 
      };
    }
  };

  const ratingInfo = getRatingInfo();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8" >
        {experts.map((expert, index) => {
          const isRated = ratedExpertIds.includes(expert?._id);
          // Use actual backend data for rating and reviews
          const rating = expert?.avgRating ? parseFloat(expert.avgRating).toFixed(1) : 0;
          return (
            <div
              key={index}
              className="bg-white rounded-[40px] p-8 border border-gray-50 flex flex-col items-center text-center relative shadow-sm hover:shadow-md transition-shadow" style={dualEdgeDepthShadow}
            >
              {/* Active Badge */}
              <div className="absolute top-8 right-8 bg-[#E6F8F3] text-[#45C4A2] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider" style={reflectionFieldDepthShadow}>
                ACTIVE
              </div>

              {/* Avatar */}
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden">
                  <img
                    src={getExpertImage(expert)}
                    alt={expert?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1 mb-4">
                <h3 className="text-lg font-bold text-[#0F172A]">{expert?.name || "Expert"}</h3>
                <p className="text-[10px] font-bold text-[#45C4A2] tracking-[0.2em] uppercase">
                  {expert?.qualification || "Certification"} | {expert?.experience ? `${expert.experience} ${expert.experience === 1 ? "Year" : "Years"} Exp` : "Experience"}
                </p>
              </div>

              {/* Rating */}
              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="flex items-center gap-2">
                  {renderStars(rating)}
                  <span className="text-sm font-bold text-gray-700">{rating}</span>
                </div>
              </div>

              {/* Action Button Area */}
              <div className="w-full flex flex-col items-center gap-2">
                {/* Upcoming Window Info */}
                {ratingInfo.status === 'upcoming' && (
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Rating available in {ratingInfo.daysUntilWindow} {ratingInfo.daysUntilWindow === 1 ? 'day' : 'days'}
                  </p>
                )}

                {/* The Button */}
                {ratingInfo.canRate && (
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
                    }`} style={isRated ? protocolIconDepthShadow : dualEdgeDepthShadow}
                  >
                    {isRated ? "Already Rated" : "Rate Now"}
                  </button>
                )}
              </div>
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

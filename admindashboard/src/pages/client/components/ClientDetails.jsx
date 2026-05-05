import {
  CalendarDays,
  Goal,
  RulerDimensionLine,
  Signature,
  Camera,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ClientDetails = ({ user }) => {
  function calculateAge(dob) {
    if (!dob) return "--";
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    return age;
  }

  const weightHistory = user?.weightHistory || [];
  const firstEntry = weightHistory[0];
  const latestEntry = weightHistory[weightHistory.length - 1];
  const hasPhotos = weightHistory.some((h) => h.frontPhoto || h.sidePhoto);

  return (
    <div className="client-card hero-project-card relative w-full overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-1 flex-col gap-5 w-full lg:min-w-[350px]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="client-title text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.1] tracking-[-0.02em]">
              Your details
            </h2>
            {!hasPhotos && (
              <Link
                to="/client/progress"
                state={{ openWeightUpdate: true }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0A4F48] text-white rounded-xl text-sm font-bold hover:bg-[#083d38] transition-colors shadow-lg"
              >
                <Camera size={18} />
                Add Progress Photos
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 w-full flex-wrap wrap-normal">
            <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
              <div className="rounded-xl bg-gray-50 p-1">
                <Signature size={29} color="#0A4F48" />
              </div>
              <div className="flex flex-col items-start justify-start">
                <p className="font-bold text-[15px]">Name</p>
                <p className="text-[13px] text-gray-600">{user?.name}</p>
              </div>
            </div>
            <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
              <div className="rounded-xl bg-gray-50 p-1">
                <CalendarDays size={29} color="#0A4F48" />
              </div>
              <div className="flex flex-col items-start justify-start">
                <p className="font-bold text-[15px]">Age</p>
                <p className="text-[13px] text-gray-600">
                  {calculateAge(user?.dob)} Y/O
                </p>
              </div>
            </div>
            <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
              <div className="rounded-xl bg-gray-50 p-1">
                <Goal size={29} color="#0A4F48" />
              </div>
              <div className="flex flex-col items-start justify-start">
                <p className="font-bold text-[15px]">Goal</p>
                <p className="text-[13px] text-gray-600">{user?.goals}</p>
              </div>
            </div>

            <div className="px-4 py-1 rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_40%)] flex items-center justify-start gap-2">
              <div className="rounded-xl bg-gray-50 p-1">
                <RulerDimensionLine size={29} color="#0A4F48" />
              </div>
              <div className="flex flex-col items-start justify-start">
                <p className="font-bold text-[15px]">Height</p>
                <p className="text-[13px] text-gray-600">{user?.height} CM</p>
              </div>
            </div>
          </div>
        </div>

        {hasPhotos && (
          <div className="flex gap-4 sm:gap-6 lg:border-l border-gray-100 lg:pl-8 w-full overflow-x-auto pb-4 min-w-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* First Photos Group */}
            <div className="flex flex-col gap-3 shrink-0">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                First Photos
              </p>
              <div className="flex gap-2">
                {firstEntry?.frontPhoto && (
                  <div className="group relative">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm transition-transform hover:scale-110">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${firstEntry.frontPhoto}`}
                        alt="First Front"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      FRONT
                    </span>
                  </div>
                )}
                {firstEntry?.sidePhoto && (
                  <div className="group relative">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm transition-transform hover:scale-110">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${firstEntry.sidePhoto}`}
                        alt="First Side"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      SIDE
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Photos Group */}
            <div className="flex flex-col gap-3 shrink-0">
              <p className="text-[11px] font-black uppercase tracking-widest text-[#0A4F48]">
                Latest Photos
              </p>
              <div className="flex gap-2">
                {latestEntry?.frontPhoto && (
                  <div className="group relative">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 border-[#0A4F48]/20 bg-gray-50 shadow-md transition-transform hover:scale-110">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${latestEntry.frontPhoto}`}
                        alt="Latest Front"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-[#0A4F48]/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      FRONT
                    </span>
                  </div>
                )}
                {latestEntry?.sidePhoto && (
                  <div className="group relative">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 border-[#0A4F48]/20 bg-gray-50 shadow-md transition-transform hover:scale-110">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${latestEntry.sidePhoto}`}
                        alt="Latest Side"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-[#0A4F48]/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      SIDE
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;

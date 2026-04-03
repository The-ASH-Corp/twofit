import React from "react";
import { assets } from "@/assets/asset";
import { useNavigate } from "react-router-dom";

export default function ExpertsList({ expert }) {
  const navigate = useNavigate();

  const experts = expert?.length ? expert : [];
  const fallbackExperts = [
    { name: "Trainer Rootien", image: assets.trainerCartoon },
    { name: "Trainer Dean", image: assets.therapistCartoon },
  ];
  const expertsToRender = experts.length ? experts.slice(0, 2) : fallbackExperts;

  const getExpertImage = (exp) => {
    if (exp?.image) return exp.image;
    if (exp?.user?.profileImage) return exp.user.profileImage;
    if (exp?.user?.avatar) return exp.user.avatar;
    if (exp?.user?.photo) return exp.user.photo;
    if (exp?.profileImage) return exp.profileImage;

    const role = (exp?.role || "").toLowerCase();
    if (role?.includes("trainer")) return assets?.trainerCartoon;
    if (role?.includes("diet") || role?.includes("nutrition")) return assets?.dietitianCartoon;
    if (role?.includes("therapist") || role?.includes("therapy")) return assets?.therapistCartoon;
    return assets?.profile;
  };

  return (
    <section className="mt-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="client-title text-[14px]">Expert Team</h3>
      </div>

      <div className="flex flex-col gap-3">
        {expertsToRender.map((exp, index) => (
          <div key={index} className="flex items-center justify-between gap-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#e4ece3] bg-white shadow-[0_3px_8px_rgba(35,54,42,0.12)]">
                <img
                  src={getExpertImage(exp)}
                  alt={exp?.user?.name || exp?.name || "Expert"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="client-title truncate text-[13px] leading-tight">
                  {exp?.user?.name || exp?.name || "Specialist"}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/client/chats")}
              className="client-action-pill shrink-0 rounded-full px-3.5 py-1 text-[10.5px] font-semibold text-white transition-all hover:opacity-90"
            >
              Chat Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

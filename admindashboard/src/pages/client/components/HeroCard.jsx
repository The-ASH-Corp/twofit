import React from "react";
import { assets } from "@/assets/asset";
import { Calendar, Clock3, Hourglass, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroCard({ program, currentGlobalDay }) {
  const titleBase = (program?.title || "Weight Loss").replace(/\s+/g, " ").trim();
  const navigate = useNavigate();


  return (
    <div className="client-card hero-project-card relative w-full min-h-[220px] overflow-hidden px-5 py-5 sm:px-6">
      <div className="absolute bottom-0 right-4 h-[148px] w-[204px] rounded-t-[120px] rounded-b-[18px] bg-[rgba(10,79,72,0.1)]" />

      <div className="relative z-10 flex h-full">
        <div className="flex min-h-[170px] flex-1 flex-col pr-0 sm:pr-[190px]">
          <h2 className="client-title text-[40px] leading-[1.04] tracking-[-0.28px]">
            {titleBase}
          </h2>
          <p className="client-subtitle mt-1 text-[12px]">
            Day {currentGlobalDay} of {program?.plan?.duration || 30}
          </p>

          

          <button
            className="client-action-pill mt-4 w-fit rounded-full px-5 py-1.5 text-[12px] font-semibold shadow-[0_9px_14px_rgba(10,79,72,0.2)]"
            onClick={() => navigate("/client/workout")}
          >
            Continue Workout
          </button>
        </div>
      </div>

      <img
        src={assets.runnerTransparent}
        alt="Runner"
        className="pointer-events-none absolute bottom-0 right-2 z-10 hidden h-[214px] w-auto object-contain drop-shadow-[0_16px_18px_rgba(20,38,30,0.2)] sm:block"
      />
    </div>
  );
}

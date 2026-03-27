import React from "react";
import { assets } from "@/assets/asset";

export default function HeroCard({ program }) {
  const title = program?.title || "Weight Loss Progress";
  const phaseInfo = program?.phaseInfo || "Weight Loss • Phase 2 of 4";

  return (
    <div className="relative w-full h-[320px] rounded-[48px] overflow-hidden bg-linear-to-br from-[#021B19] via-[#0A4F48] to-[#0D6D63] shadow-2xl group transition-all duration-500">
      {/* Background Hero Text / Mask */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 pointer-events-none select-none">
        <h1 className="text-[160px] font-black text-white/5 leading-none tracking-tighter">
          HERO
        </h1>
      </div>

      {/* Mascot Illustration - On the right as per image */}
      <div className="absolute -right-4 bottom-0 w-[380px] h-full flex items-end justify-center pointer-events-none">
        <img
          src={assets.heroMascot}
          alt="Mascot"
          className="w-full h-[115%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content Area - On the left as per image */}
      <div className="absolute inset-0 flex flex-col justify-center items-start p-10 md:p-14 z-10">
        <div className="space-y-4 max-w-lg">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-[#2DD4BF] uppercase tracking-[0.4em]">
              Active Program
            </span>
            <h2 className="text-white text-[32px] md:text-[48px] font-black leading-none tracking-tight drop-shadow-lg">
              {title}
            </h2>
            <p className="text-white/80 text-[14px] md:text-[16px] font-medium tracking-wide">
              {phaseInfo}
            </p>
          </div>
          
          <button className="bg-[#005F54] hover:bg-[#004d44] text-white px-8 py-3.5 rounded-full text-[14px] font-black tracking-widest transition-all active:scale-95 shadow-xl shadow-black/20 uppercase">
            Continue Workout
          </button>
        </div>
      </div>

      {/* Subtle overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}



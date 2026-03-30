import React from "react";
import { assets } from "@/assets/asset";
import { useNavigate } from "react-router-dom";

export default function HeroCard({ program, currentGlobalDay }) {
  const navigate = useNavigate();
  const title = program?.title || "Weight Loss Progress";
  
  // Calculate phase info based on currentGlobalDay
  const totalDays = program?.duration || 30;
  const currentPhase = Math.ceil(currentGlobalDay / 7) || 1;
  const totalPhases = Math.ceil(totalDays / 7) || 4;
  
  const phaseInfo = `${program?.title || "Weight Loss"} • Phase ${currentPhase} of ${totalPhases}`;

  return (
    <div className="relative w-full min-h-[280px] sm:min-h-[300px] md:h-80 rounded-3xl md:rounded-[48px] overflow-hidden bg-[#0A4F48] shadow-2xl group transition-all duration-500">
      {/* Background Pattern / Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(45,212,191,0.1),transparent_70%)]" />

      {/* Mascot Illustration Container - solid white to avoid transparent PNG bleed */}
      <div className="hidden sm:flex absolute right-0 top-0 w-[45%] md:w-[50%] h-full bg-white rounded-l-[56px] md:rounded-l-[80px] items-end justify-center overflow-hidden">
        {/* Subtle teal gradient wash */}
        <div className="absolute inset-0 bg-linear-to-b from-[#e8faf7] to-white pointer-events-none" />
        {/* Soft glow behind mascot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#2DD4BF]/15 rounded-full blur-3xl pointer-events-none" />
        <img
          src={assets.heroMascot}
          alt="Mascot"
          className="relative z-10 w-full h-[115%] object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Mobile Mascot Accent */}
      <img
        src={assets.heroMascot}
        alt="Mascot"
        className="absolute sm:hidden right-2 bottom-0 w-28 h-36 object-contain opacity-25 pointer-events-none"
      />

      {/* Content Area */}
      <div className="absolute inset-0 flex flex-col justify-center items-start p-6 sm:p-8 md:p-14 z-10">
        <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-[92%] sm:max-w-[54%] md:max-w-lg">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 bg-[#2DD4BF]/20 rounded-full border border-[#2DD4BF]/30">
              <span className="text-[9px] sm:text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                Active Program
              </span>
            </div>
            <h2 className="text-white text-[38px] sm:text-[42px] md:text-[48px] font-black leading-[1.05] md:leading-[1.1] tracking-tight drop-shadow-lg">
              {title}
            </h2>
            <p className="text-white/75 text-[13px] sm:text-[14px] md:text-[16px] font-medium tracking-wide">
              {phaseInfo}
            </p>
          </div>
          
          <button 
            onClick={() => navigate("/client/workout")}
            className="bg-[#2DD4BF] hover:bg-[#1fbda9] text-[#0A4F48] px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 rounded-full text-[12px] sm:text-[13px] md:text-[14px] font-black tracking-[0.18em] sm:tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#2DD4BF]/20 uppercase"
          >
            Continue Workout
          </button>
        </div>
      </div>

      {/* Subtle overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}



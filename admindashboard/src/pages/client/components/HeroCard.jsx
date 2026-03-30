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
    <div className="relative w-full h-[320px] rounded-[48px] overflow-hidden bg-[#0A4F48] shadow-2xl group transition-all duration-500">
      {/* Background Pattern / Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(45,212,191,0.1),transparent_70%)]" />
      
      {/* Hero Text Background */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 pointer-events-none select-none">
        <h1 className="text-[160px] font-black text-white/5 leading-none tracking-tighter">
          HERO
        </h1>
      </div>

      {/* Mascot Illustration Container - Fixed background */}
      <div className="absolute right-0 top-0 w-[50%] h-full bg-white/10 backdrop-blur-sm rounded-l-[100px] flex items-end justify-center overflow-hidden">
        {/* Solid background for the mascot to avoid checkered pattern if it exists in the image itself */}
        <div className="absolute inset-0 bg-[#F1F5F9]" /> 
        
        <img
          src={assets.heroMascot}
          alt="Mascot"
          className="relative z-10 w-full h-[115%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Decorative elements behind mascot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2DD4BF]/20 rounded-full blur-3xl" />
      </div>

      {/* Content Area */}
      <div className="absolute inset-0 flex flex-col justify-center items-start p-10 md:p-14 z-10">
        <div className="space-y-6 max-w-lg">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 bg-[#2DD4BF]/20 rounded-full border border-[#2DD4BF]/30">
              <span className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.3em]">
                Active Program
              </span>
            </div>
            <h2 className="text-white text-[32px] md:text-[48px] font-black leading-[1.1] tracking-tight drop-shadow-lg">
              {title}
            </h2>
            <p className="text-white/70 text-[14px] md:text-[16px] font-medium tracking-wide">
              {phaseInfo}
            </p>
          </div>
          
          <button 
            onClick={() => navigate("/client/workout")}
            className="bg-[#2DD4BF] hover:bg-[#1fbda9] text-[#0A4F48] px-10 py-4 rounded-full text-[14px] font-black tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#2DD4BF]/20 uppercase"
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



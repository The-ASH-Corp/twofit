import React from 'react';
import { Dumbbell, Activity, HeartPulse, Trophy, Timer, Zap } from 'lucide-react';

const FloatingIcon = ({ Icon, className, style }) => (
  <div 
    className={`absolute text-[#0A4F48] animate-float ${className}`}
    style={style}
  >
    <Icon strokeWidth={1.5} className="w-full h-full" />
  </div>
);

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Abstract Fitness Background Image with Animation */}
      <div className="absolute inset-0 opacity-[0.1]">
         {/* You can replace this src with any fitness gif/image url */}
         <img 
             src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
             alt="fitness background" 
             className="w-full h-full object-cover grayscale"
         />
      </div>
      
      {/* Floating Fitness Icons Overlay */}
      <div className="absolute inset-0 opacity-[0.1]">
        <FloatingIcon Icon={Dumbbell} className="w-32 h-32 top-[10%] left-[5%] animate-float-slow" style={{ animationDuration: '8s' }} />
        <FloatingIcon Icon={Activity} className="w-48 h-48 bottom-[10%] right-[5%] rotate-12" style={{ animationDuration: '12s' }} />
        
        <FloatingIcon Icon={HeartPulse} className="w-24 h-24 top-[40%] right-[20%] -rotate-12" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <FloatingIcon Icon={Trophy} className="w-36 h-36 bottom-[20%] left-[15%] rotate-6" style={{ animationDuration: '15s', animationDelay: '2s' }} />
        
        <FloatingIcon Icon={Timer} className="w-20 h-20 top-[15%] right-[35%]" style={{ left: '40%', animationDuration: '7s' }} />
        <FloatingIcon Icon={Zap} className="w-16 h-16 bottom-[40%] left-[40%]" style={{ animationDuration: '9s' }} />
      </div>
      
      {/* CSS Animation Keyframes injected */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float, .animate-float-slow {
          animation: float 10s ease-in-out infinite;
        }
        .animate-pulse-slow {
            animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default BackgroundAnimation;

import React from "react";
import { Headphones, MessageSquare, Mail, Phone, ExternalLink } from "lucide-react";
import MobileBottomNav from "../components/MobileBottomNav";

export default function Support() {
  const contactOptions = [
    {
      title: "Live Chat",
      description: "Speak with our support team in real-time.",
      icon: MessageSquare,
      action: "Start Chat",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message.",
      icon: Mail,
      action: "Send Email",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Phone Support",
      description: "Call us for urgent matters.",
      icon: Phone,
      action: "Call Now",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="client-page-container p-5 sm:p-6 lg:p-7">
      <div className="client-page-shell">

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {contactOptions.map((option) => (
            <section
              key={option.title}
              className="client-card flex flex-col items-center p-8 text-center transition-all hover:-translate-y-1 sm:items-start sm:text-left"
            >
              <div className={`mb-6 rounded-2xl p-4 ${option.color}`}>
                <option.icon size={28} />
              </div>
              <h3 className="text-[22px] font-black text-[#1F2D27]">
                {option.title}
              </h3>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-[#6C7B74]">
                {option.description}
              </p>
              <button className="mt-6 flex items-center gap-2 text-[14px] font-black text-[#0A7B4E] uppercase tracking-wider hover:underline">
                {option.action}
                <ExternalLink size={14} />
              </button>
            </section>
          ))}
        </div>

        <section className="client-card mt-10 overflow-hidden rounded-[32px] bg-[#0A4F48] p-1">
          <div className="relative rounded-[31px] bg-[#0A4F48] px-8 py-10 text-center sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_100%)]" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
                <Headphones size={32} />
              </div>
              <h2 className="text-[28px] font-black leading-tight text-white sm:text-[32px] lg:text-[36px]">
                Dedicated Wellness Support
              </h2>
              <p className="mt-4 text-[18px] font-medium text-[#A7F3D0]">
                Have a question about your diet or workout plan? Our experts are
                always available to provide professional guidance.
              </p>
              <button className="mt-10 rounded-full bg-white px-8 py-4 text-[15px] font-black text-[#0A4F48] shadow-xl transition-all hover:scale-105 active:scale-95">
                Contact Your Expert
              </button>
            </div>
          </div>
        </section>
      </div>
      <MobileBottomNav />
    </div>
  );
}

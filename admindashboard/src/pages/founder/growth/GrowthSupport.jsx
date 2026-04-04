import React, { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CloudUpload,
  Dumbbell,
  Info,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserCog,
} from "lucide-react";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";

const recipientOptions = [
  {
    id: "admin",
    label: "Admin",
    icon: UserCog,
    accent: "from-[#0A4F48] to-[#118477]",
    hint: "Operational support and escalations",
  },
  {
    id: "head",
    label: "Head",
    icon: Star,
    accent: "from-[#C2A96B] to-[#E4CEA3]",
    hint: "Leadership-level decisions and approvals",
  },
  {
    id: "trainer",
    label: "Trainer",
    icon: Dumbbell,
    accent: "from-[#216B63] to-[#72B5AA]",
    hint: "Mobility, strength, and workout planning",
  },
  {
    id: "dietitian",
    label: "Dietitian",
    icon: Stethoscope,
    accent: "from-[#7A8E5F] to-[#C2D59F]",
    hint: "Nutrition insights and meal guidance",
  },
  {
    id:"therapist",
    label:"Therapist",
    icon:Star,
    accent: "from-[#7A8EF0] to-[#C2D589]",
    hint: "Nutrition insights and meal guidance",
  }
];

 
export default function GrowthSupport() {
  const [selectedRecipient, setSelectedRecipient] = useState("admin");
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const selectedRecipientMeta = useMemo(
    () =>
      recipientOptions.find((option) => option.id === selectedRecipient) ??
      recipientOptions[0],
    [selectedRecipient],
  );

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(files);
  };

  return (
    <>
      <BackgroundAnimation />
      <div className="relative z-10 mx-auto flex min-h-full max-w-[1450px] flex-col gap-6 px-3 py-4 md:gap-8 md:px-5 md:py-6 lg:px-8">
        <section className="border border-[#4E615E] overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,rgba(10,79,72,0.08),rgba(238,223,183,0.28),rgba(255,255,255,0.96))] p-6 shadow-[0_12px_40px_-20px_rgba(10,79,72,0.28)] md:p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl ">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#0A4F48] shadow-[0_8px_24px_-18px_rgba(10,79,72,0.6)] backdrop-blur-xl">
                <Sparkles size={14} />
                Growth Support
              </div>
              <h1 className="max-w-2xl text-3xl font-black tracking-[-0.03em] text-[#0A4F48] md:text-4xl">
                Send a polished support request to your wellness team.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4E615E] md:text-[15px]">
                This workspace follows the editorial design from your reference
                while staying native to the founder dashboard. Choose a
                recipient, add context, attach files, and share a complete brief
                in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-[30px] bg-white/90 p-5 shadow-[0_12px_34px_-26px_rgba(10,79,72,0.5)] backdrop-blur-xl md:p-6">
            <div className="mb-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#6E8A84]">
                Choose Recipient
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#163A36]">
                Route this request with clarity.
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#667875]">
                Select who should receive the message first. You can keep the
                content concise here and use attachments for detailed records.
              </p>
            </div>

            <div className="space-y-3">
              {recipientOptions.map((option) => {
                const Icon = option.icon;
                const isActive = selectedRecipient === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedRecipient(option.id)}
                    className={`w-full rounded-[22px] p-4 text-left transition-all duration-300 ${
                      isActive
                        ? "bg-[#F3F7F6] shadow-[0_14px_24px_-22px_rgba(10,79,72,0.8)]"
                        : "bg-[#F8FAF9] hover:bg-[#F1F5F4]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br ${option.accent} text-white shadow-[0_12px_24px_-18px_rgba(10,79,72,0.8)]`}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-extrabold text-[#173B37]">
                            {option.label}
                          </p>
                          <p className="mt-1 text-xs text-[#728481]">
                            {option.hint}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                          isActive
                            ? "bg-[#0A4F48] text-white"
                            : "bg-white text-transparent"
                        }`}
                      >
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* <div className="mt-6 rounded-[24px] bg-[linear-gradient(180deg,rgba(238,223,183,0.45),rgba(255,255,255,0.9))] p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#7A6740]">
                Support Note
              </p>
              <p className="mt-3 text-sm leading-6 text-[#6D6242]">
                Response time is typically within 4-6 business hours. For urgent
                operational issues, use the escalation channel after sending your
                summary here.
              </p>
            </div> */}
          </aside>

          <div className="space-y-6">
            <section className="rounded-[30px] bg-white/90 p-5 shadow-[0_12px_34px_-26px_rgba(10,79,72,0.5)] backdrop-blur-xl md:p-6 lg:p-8">
              <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#6E8A84]">
                    Message Content
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#163A36]">
                    Compose your request.
                  </h2>
                </div>

                <div className="rounded-[22px] bg-[#F5F8F7] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7B8D89]">
                    Sending To
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-[#0A4F48]">
                    {selectedRecipientMeta.label}
                  </p>
                </div>
              </div>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={10}
                placeholder="Type your message here. Include the context, expected outcome, and any timing details your team should know."
                className="min-h-[280px] w-full rounded-[26px] bg-[#F4F7F6] px-5 py-4 text-[15px] leading-7 text-[#1B3431] outline-none ring-0 placeholder:text-[#9AA8A5] focus:ring-2 focus:ring-[#0A4F48]/15"
              />

              <div className="mt-6 rounded-[28px] bg-[linear-gradient(180deg,rgba(248,250,249,0.95),rgba(241,245,244,0.85))] p-4 md:p-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-[#DDE5E2] bg-white/70 px-4 py-10 text-center transition-all duration-300 hover:bg-white"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4F2] text-[#0A4F48] shadow-[0_12px_20px_-18px_rgba(10,79,72,0.8)]">
                    <CloudUpload size={28} />
                  </div>
                  <p className="text-lg font-extrabold tracking-[-0.02em] text-[#163A36]">
                    Drag &amp; drop files
                  </p>
                  <p className="mt-2 text-sm text-[#7C8D8A]">
                    PNG, JPG, PDF up to 10MB
                  </p>
                  <span className="mt-4 rounded-full bg-[#EAF4F2] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0A4F48] transition-colors group-hover:bg-[#DDF1ED]">
                    Or browse files
                  </span>
                </button>

                {attachedFiles.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {attachedFiles.map((file) => (
                      <span
                        key={`${file.name}-${file.size}`}
                        className="rounded-full bg-[#F1F5F4] px-3 py-2 text-xs font-semibold text-[#4E615E]"
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-[#F0F4F2] pt-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 text-sm text-[#768784]">
                  
                 </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#0A4F48] to-[#117E72] px-8 py-3.5 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_-18px_rgba(10,79,72,0.9)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                  Send Message
                  <Send size={16} />
                </button>
              </div>
            </section>

            {/* <section className="grid grid-cols-1 overflow-hidden rounded-[30px] bg-[#F2F5F4] shadow-[0_12px_34px_-26px_rgba(10,79,72,0.5)] lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="p-6 md:p-8">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#4D6C18]">
                  Wellness Insights
                </p>
                <h3 className="mt-4 max-w-xl text-[28px] font-black leading-tight tracking-[-0.03em] text-[#0A4F48]">
                  Enhance your consultation with historical data.
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#596B68]">
                  Attaching biometric reports, meal logs, and progress snapshots
                  gives your team a clearer picture and helps them respond with
                  more tailored guidance.
                </p> */}

                {/* <div className="mt-6 space-y-3">
                  {insightPoints.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-[22px] bg-white/80 px-4 py-4"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6F2EF] text-[#0A4F48]">
                        <ShieldCheck size={16} />
                      </div>
                      <p className="text-sm leading-6 text-[#4F615E]">{point}</p>
                    </div>
                  ))}
                </div> */}

                {/* <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#0A4F48] transition-transform duration-300 hover:translate-x-1"
                >
                  Explore Library
                  <ArrowRight size={16} />
                </button>
              </div> */}

              {/* <div className="relative min-h-[300px] overflow-hidden bg-[linear-gradient(180deg,#63C4B5,#43A997)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),transparent_42%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.12),transparent_38%)]" />
                <div className="absolute left-1/2 top-7 h-24 w-24 -translate-x-1/2 rounded-full bg-[#8BE0D3]/70 blur-xl" />
                <div className="absolute bottom-0 left-1/2 h-[235px] w-[200px] -translate-x-1/2 rounded-t-[120px] bg-[#F6A96C]" />
                <div className="absolute bottom-[168px] left-1/2 h-[86px] w-[86px] -translate-x-1/2 rounded-full bg-[#F6A96C]" />
                <div className="absolute bottom-[208px] left-1/2 h-[58px] w-[68px] -translate-x-1/2 rounded-[48px] bg-[#42251C]" />
                <div className="absolute bottom-[165px] left-[calc(50%-50px)] h-3.5 w-3.5 rounded-full bg-[#3A251C]" />
                <div className="absolute bottom-[165px] left-[calc(50%+36px)] h-3.5 w-3.5 rounded-full bg-[#3A251C]" />
                <div className="absolute bottom-[145px] left-1/2 h-5 w-10 -translate-x-1/2 rounded-b-[18px] border-b-4 border-[#D56C52]" />
                <div className="absolute bottom-[88px] left-[calc(50%-82px)] h-[84px] w-[78px] rounded-[30px] bg-[#F6A96C] rotate-[12deg]" />
                <div className="absolute bottom-[88px] left-[calc(50%+4px)] h-[84px] w-[78px] rounded-[30px] bg-[#F6A96C] -rotate-[12deg]" />
                <div className="absolute bottom-[120px] left-1/2 h-[70px] w-[44px] -translate-x-1/2 rounded-b-[28px] rounded-t-[20px] bg-[#FDE7D2]" />
                <div className="absolute bottom-[84px] left-1/2 h-[110px] w-[118px] -translate-x-1/2 rounded-t-[68px] bg-[#F6A96C]" />
                <div className="absolute bottom-[96px] left-1/2 h-[72px] w-[18px] -translate-x-1/2 rounded-full bg-[#FFFFFF]/90" />
                <div className="absolute bottom-[90px] left-[calc(50%-54px)] h-[52px] w-[10px] rounded-full bg-[#0A8D7F]" />
                <div className="absolute bottom-[90px] left-[calc(50%+44px)] h-[52px] w-[10px] rounded-full bg-[#0A8D7F]" />
                <div className="absolute bottom-[58px] left-[calc(50%-102px)] h-1.5 w-20 rounded-full bg-[#327E74]/60" />
                <div className="absolute bottom-[58px] right-[calc(50%-102px)] h-1.5 w-20 rounded-full bg-[#327E74]/60" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/95">
                  <p className="text-2xl font-black tracking-[0.2em]">WILLNESS</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.42em] text-white/75">
                    Safe Space
                  </p> */}
                {/* </div>
              </div>
            </section> */}
          </div>
        </section>
      </div>
    </>
  );
}

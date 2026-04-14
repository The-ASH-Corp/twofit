import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  CloudUpload,
  Dumbbell,
  Search,
  Send,
  Sparkles,
  Star,
  Stethoscope,
  UserCog,
  Users,
  X,
  Plus,
  Check,
} from "lucide-react";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";

// Thunks
import { getFounderAllAdmins } from "@/redux/features/admins/admin.thunk";
import { getFounderAllHeads } from "@/redux/features/head/head.thunk";
import { getFounderAllCoaches } from "@/redux/features/coach/coach.thunk";

// Selectors
import { selectFounderAllAdmins } from "@/redux/features/admins/admins.selecters";
import { selectFounderAllHeads } from "@/redux/features/head/head.selectors";
import { selectFounderAllCoaches } from "@/redux/features/coach/coach.selector";

const recipientOptions = [
  {
    id: "admin",
    label: "Admin",
    icon: UserCog,
    accent: "from-[#0A4F48] to-[#118477]",
    hint: "Operational support and escalations",
    nameKey: "adminName",
  },
  {
    id: "head",
    label: "Head",
    icon: Star,
    accent: "from-[#C2A96B] to-[#E4CEA3]",
    hint: "Leadership-level decisions and approvals",
    nameKey: "headName",
  },
  {
    id: "trainer",
    label: "Trainer",
    icon: Dumbbell,
    accent: "from-[#216B63] to-[#72B5AA]",
    hint: "Mobility, strength, and workout planning",
    nameKey: "coachName",
    roleFilter: "Trainer",
  },
  {
    id: "dietitian",
    label: "Dietitian",
    icon: Stethoscope,
    accent: "from-[#7A8E5F] to-[#C2D59F]",
    hint: "Nutrition insights and meal guidance",
    nameKey: "coachName",
    roleFilter: "Dietician",
  },
  {
    id: "therapist",
    label: "Therapist",
    icon: Star,
    accent: "from-[#7A8EF0] to-[#C2D589]",
    hint: "Mental wellness and therapy sessions",
    nameKey: "coachName",
    roleFilter: "Therapist",
  },
];

// Helper: get avatar initials from name
function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function GrowthSupport() {
  const dispatch = useDispatch();

  // Recipient type selection (null = none selected)
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  // Selected individual people Array of { id, name }
  const [selectedPeople, setSelectedPeople] = useState([]);

  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const fileInputRef = useRef(null);

  // Redux data
  const allAdmins = useAppSelector(selectFounderAllAdmins);
  const allHeads = useAppSelector(selectFounderAllHeads);
  const allCoaches = useAppSelector(selectFounderAllCoaches);

  // Fetch data when a recipient type is selected
  useEffect(() => {
    if (!selectedRecipient) return;
    if (selectedRecipient === "admin") {
      dispatch(getFounderAllAdmins({ page: 1, limit: 100 }));
    } else if (selectedRecipient === "head") {
      dispatch(getFounderAllHeads({ page: 1, limit: 100 }));
    } else {
      // trainer | dietitian | therapist — all use coaches
      dispatch(getFounderAllCoaches({ page: 1, limit: 100 }));
    }
    // Reset person selection when type changes
    setSelectedPeople([]);
    setMemberSearch("");
  }, [selectedRecipient, dispatch]);

  // Derive filtered member list
  const memberList = useMemo(() => {
    if (!selectedRecipient) return [];
    const opt = recipientOptions.find((o) => o.id === selectedRecipient);
    let list = [];
    if (selectedRecipient === "admin") list = allAdmins ?? [];
    else if (selectedRecipient === "head") list = allHeads ?? [];
    else {
      const roleFilter = opt?.roleFilter;
      list = (allCoaches ?? []).filter((c) =>
        roleFilter ? c.role === roleFilter : true
      );
    }
    const search = memberSearch.trim().toLowerCase();
    if (!search) return list;
    return list.filter((m) =>
      (m[opt?.nameKey ?? ""] ?? "").toLowerCase().includes(search)
    );
  }, [selectedRecipient, allAdmins, allHeads, allCoaches, memberSearch]);

  const selectedRecipientMeta = useMemo(
    () => recipientOptions.find((o) => o.id === selectedRecipient),
    [selectedRecipient]
  );

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(files);
  };

  const handleRecipientTypeClick = (id) => {
    if (selectedRecipient === id) {
      // Toggle off
      setSelectedRecipient(null);
      setSelectedPeople([]);
    } else {
      setSelectedRecipient(id);
    }
  };

  const handlePersonSelect = (person) => {
    setSelectedPeople((prev) => {
      const isAlreadySelected = prev.find((p) => p.id === person.id);
      if (isAlreadySelected) {
        return prev.filter((p) => p.id !== person.id);
      } else {
        return [...prev, person];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPeople.length === memberList.length && memberList.length > 0) {
      setSelectedPeople([]);
    } else {
      const allMembers = memberList.map((m) => {
        const nameKey = selectedRecipientMeta?.nameKey ?? "";
        const name = m[nameKey] ?? "Unknown";
        const id = m._id ?? m.id ?? name;
        return { id, name };
      });
      setSelectedPeople(allMembers);
    }
  };

  // "Sending to" label
  const sendingTo = useMemo(() => {
    if (selectedPeople.length === 0) {
      return selectedRecipientMeta
        ? `All ${selectedRecipientMeta.label}s`
        : "—";
    }
    if (selectedPeople.length === 1) {
      return selectedPeople[0].name;
    }
    if (selectedPeople.length === memberList.length && memberList.length > 0) {
      return `All ${selectedPeople.length} ${selectedRecipientMeta?.label}s`;
    }
    return `${selectedPeople[0].name} + ${selectedPeople.length - 1} others`;
  }, [selectedPeople, selectedRecipientMeta, memberList]);

  return (
    <>
      <BackgroundAnimation />
      <div className="relative z-10 mx-auto flex min-h-full max-w-[1450px] flex-col gap-6 px-3 py-4 md:gap-8 md:px-5 md:py-6 lg:px-8">
        {/* Header */}
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
                Choose a recipient type, then optionally pick multiple specific
                people. Add context, attach files, and share a complete brief in
                one place.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          {/* ── Left sidebar ── */}
          <aside className="flex flex-col gap-4">
            {/* Recipient type selector */}
            <div className="rounded-[30px] bg-white/90 p-5 shadow-[0_12px_34px_-26px_rgba(10,79,72,0.5)] backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#6E8A84]">
                  Choose Recipient Type
                </p>
                <h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#163A36]">
                  Route this request with clarity.
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-[#667875]">
                  Select a recipient type — you can pick multiple people from
                  the list below.
                </p>
              </div>

              <div className="space-y-2.5">
                {recipientOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = selectedRecipient === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleRecipientTypeClick(option.id)}
                      className={`w-full rounded-[20px] p-3.5 text-left transition-all duration-300 ${
                        isActive
                          ? "bg-[#F0F7F5] shadow-[0_10px_22px_-18px_rgba(10,79,72,0.7)] ring-1 ring-[#0A4F48]/20"
                          : "bg-[#F8FAF9] hover:bg-[#F1F5F4]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br ${option.accent} text-white shadow-[0_8px_20px_-14px_rgba(10,79,72,0.8)]`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-extrabold text-[#173B37]">
                              {option.label}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-4 text-[#728481]">
                              {option.hint}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isActive && (
                            <span className="text-[10px] font-bold text-[#0A4F48] uppercase tracking-wide">
                              Multi-Select
                            </span>
                          )}
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                              isActive
                                ? "bg-[#0A4F48] text-white"
                                : "bg-white text-transparent border border-[#DDE5E2]"
                            }`}
                          >
                            <CheckCircle2 size={13} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Member list panel — shown when a type is selected */}
            {selectedRecipient && (
              <div className="rounded-[28px] bg-white/90 p-5 shadow-[0_12px_34px_-26px_rgba(10,79,72,0.5)] backdrop-blur-xl md:p-5 animate-in slide-in-from-top-2 duration-300">
                {/* panel header */}
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br ${selectedRecipientMeta?.accent} text-white`}
                    >
                      <Users size={14} />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6E8A84]">
                        Select {selectedRecipientMeta?.label}s
                      </p>
                      <p className="text-xs text-[#94A7A3]">
                        {selectedPeople.length} of {memberList.length} selected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {memberList.length > 0 && (
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-[10px] font-bold text-[#0A4F48] hover:underline"
                      >
                        {selectedPeople.length === memberList.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    )}
                    {selectedPeople.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedPeople([])}
                        className="flex items-center gap-1 rounded-full bg-[#F1F5F4] px-2.5 py-1 text-[10px] font-bold text-[#4E615E] hover:bg-[#E5ECEA] transition-colors"
                      >
                        <X size={10} />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* search */}
                <div className="relative mb-3">
                  <Search
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA8A5]"
                  />
                  <input
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder={`Search ${selectedRecipientMeta?.label}s…`}
                    className="w-full rounded-[14px] bg-[#F4F7F6] py-2.5 pl-8 pr-3 text-[13px] text-[#1B3431] outline-none placeholder:text-[#9AA8A5] focus:ring-2 focus:ring-[#0A4F48]/15"
                  />
                </div>

                {/* member list */}
                <div className="max-h-[280px] space-y-2 overflow-y-auto pr-0.5 [scrollbar-width:thin] [scrollbar-color:#D4DDD9_transparent]">
                  {memberList.length === 0 ? (
                    <p className="py-6 text-center text-xs text-[#9AA8A5]">
                      No {selectedRecipientMeta?.label}s found.
                    </p>
                  ) : (
                    memberList.map((member) => {
                      const nameKey = selectedRecipientMeta?.nameKey ?? "";
                      const name = member[nameKey] ?? "Unknown";
                      const id = member._id ?? member.id ?? name;
                      const isChosen = !!selectedPeople.find(
                        (p) => p.id === id
                      );

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handlePersonSelect({ id, name })}
                          className={`w-full flex items-center gap-3 rounded-[14px] p-2.5 text-left transition-all duration-200 ${
                            isChosen
                              ? "bg-[#EAF4F2] ring-1 ring-[#0A4F48]/25"
                              : "hover:bg-[#F4F7F6]"
                          }`}
                        >
                          {/* selection indicator */}
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                              isChosen
                                ? "bg-[#0A4F48] border-[#0A4F48] text-white"
                                : "bg-white border-[#DDE5E2] text-transparent"
                            }`}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>

                          {/* avatar */}
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                              isChosen
                                ? "bg-[#0A4F48] text-white"
                                : "bg-[#E8EFED] text-[#4E615E]"
                            }`}
                          >
                            {getInitials(name)}
                          </div>
                          <span
                            className={`flex-1 truncate text-[13px] font-semibold ${
                              isChosen ? "text-[#0A4F48]" : "text-[#2B4744]"
                            }`}
                          >
                            {name}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* ── Right: compose area ── */}
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

                {/* "Sending to" badge */}
                <div
                  className={`rounded-[22px] px-4 py-3 transition-all duration-300 ${
                    selectedRecipient ? "bg-[#EAF4F2]" : "bg-[#F5F8F7]"
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7B8D89]">
                    Sending To
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {selectedRecipient && selectedRecipientMeta && (
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br ${selectedRecipientMeta.accent}`}
                      >
                        {React.createElement(selectedRecipientMeta.icon, {
                          size: 9,
                          className: "text-white",
                        })}
                      </div>
                    )}
                    <p
                      className={`text-sm font-extrabold ${
                        selectedRecipient ? "text-[#0A4F48]" : "text-[#9AA8A5]"
                      }`}
                    >
                      {sendingTo}
                    </p>
                  </div>
                  {!selectedRecipient && (
                    <p className="mt-1 text-[10px] text-[#B0BDB9]">
                      Pick a recipient type first
                    </p>
                  )}
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
                  {selectedPeople.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4F2] px-3 py-1.5 text-xs font-bold text-[#0A4F48]">
                      <CheckCircle2 size={12} />
                      Sending to {selectedPeople.length} people
                    </span>
                  ) : selectedRecipient ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F8F7] px-3 py-1.5 text-xs font-semibold text-[#4E615E]">
                      <Users size={12} />
                      Sending to all {selectedRecipientMeta?.label}s
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  disabled={!selectedRecipient}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#0A4F48] to-[#117E72] px-8 py-3.5 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_-18px_rgba(10,79,72,0.9)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Send Message
                  <Send size={16} />
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}

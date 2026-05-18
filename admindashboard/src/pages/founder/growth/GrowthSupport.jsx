<<<<<<< Updated upstream
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
  Loader2,
} from "lucide-react";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { toast } from "react-toastify";

// Thunks
import { getFounderAllAdmins } from "@/redux/features/admins/admin.thunk";
import { getFounderAllHeads } from "@/redux/features/head/head.thunk";
import { getFounderAllCoaches } from "@/redux/features/coach/coach.thunk";
import { sendSupportRequest } from "@/redux/features/growthSupport/growthSupport.thunk";

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
  const [isSending, setIsSending] = useState(false);
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
=======
import React, { useEffect, useRef, useState } from "react";
import {
  Apple,
  ArrowRight,
  Dumbbell,
  LoaderCircle,
  Lock,
  Paperclip,
  Send,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { assets } from "@/assets/asset";
import axiosInstance from "@/utils/axiosInstance";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

const recipientOptions = [
  { id: "admin", label: "Admin", icon: ShieldCheck },
  { id: "head", label: "Head", icon: UserRound },
  { id: "trainer", label: "Trainer", icon: Dumbbell },
  { id: "dietitian", label: "Dietitian", icon: Apple },
];

const formatFileSize = (bytes = 0) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function GrowthSupport() {
  const [selectedDepartment, setSelectedDepartment] = useState("admin");
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/growth-support");
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        setRequests(items);
      } catch (error) {
        console.error("Failed to fetch growth support requests", error);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
>>>>>>> Stashed changes

    fetchRequests();
  }, []);

  const mergeFiles = (incomingFiles = []) => {
    if (!incomingFiles.length) return;

    const nextFiles = [...attachedFiles];
    const seen = new Set(
      nextFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
    );

    for (const file of incomingFiles) {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;

      if (seen.has(fileKey)) continue;

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not supported. Use PNG, JPG or PDF.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 10MB limit.`);
        continue;
      }

      if (nextFiles.length >= MAX_FILES) {
        toast.info(`You can attach up to ${MAX_FILES} files.`);
        break;
      }

      seen.add(fileKey);
      nextFiles.push(file);
    }

    setAttachedFiles(nextFiles);
  };

<<<<<<< Updated upstream
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

  const handleSendMessage = async () => {
    if (!selectedRecipient) {
      toast.error("Please pick a recipient type");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    const formData = new FormData();
    formData.append("recipientType", selectedRecipient);
    
    // If no specific people selected, send to entire list
    const finalRecipientIds = selectedPeople.length > 0 
      ? selectedPeople.map(p => p.id)
      : memberList.map(m => m._id || m.id);

    if (finalRecipientIds.length === 0) {
        toast.error(`No ${selectedRecipientMeta?.label}s available to receive this message`);
        setIsSending(false);
        return;
    }

    formData.append("recipientIds", JSON.stringify(finalRecipientIds));
    formData.append("message", message);
    
    attachedFiles.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const result = await dispatch(sendSupportRequest(formData)).unwrap();
      if (result.success) {
        toast.success("Support request sent successfully!");
        // Reset form
        setMessage("");
        setAttachedFiles([]);
        setSelectedRecipient(null);
        setSelectedPeople([]);
      }
    } catch (err) {
      toast.error(err || "Failed to send support request");
=======
  const handleFilesChange = (event) => {
    mergeFiles(Array.from(event.target.files || []));
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    mergeFiles(Array.from(event.dataTransfer.files || []));
  };

  const removeFile = (targetFile) => {
    setAttachedFiles((current) =>
      current.filter(
        (file) =>
          `${file.name}-${file.size}-${file.lastModified}` !==
          `${targetFile.name}-${targetFile.size}-${targetFile.lastModified}`,
      ),
    );
  };

  const handleSubmit = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      toast.error("Please enter a message first");
      return;
    }

    try {
      setIsSending(true);

      const formData = new FormData();
      formData.append("recipient", selectedDepartment);
      formData.append("message", trimmedMessage);
      attachedFiles.forEach((file) => formData.append("attachments", file));

      const response = await axiosInstance.post("/growth-support", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const createdRequest = response?.data || response;
      setRequests((current) => [createdRequest, ...current]);
      setMessage("");
      setAttachedFiles([]);
      toast.success("Growth support request sent");
    } catch (error) {
      console.error("Failed to send growth support request", error);
      toast.error(
        error?.response?.data?.message || "Failed to send growth support request",
      );
>>>>>>> Stashed changes
    } finally {
      setIsSending(false);
    }
  };

<<<<<<< Updated upstream
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
                      disabled={isSending}
                      onClick={() => handleRecipientTypeClick(option.id)}
                      className={`w-full rounded-[20px] p-3.5 text-left transition-all duration-300 ${
                        isActive
                          ? "bg-[#F0F7F5] shadow-[0_10px_22px_-18px_rgba(10,79,72,0.7)] ring-1 ring-[#0A4F48]/20"
                          : "bg-[#F8FAF9] hover:bg-[#F1F5F4]"
                      } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
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
                        disabled={isSending}
                        onClick={handleSelectAll}
                        className="text-[10px] font-bold text-[#0A4F48] hover:underline disabled:opacity-50"
                      >
                        {selectedPeople.length === memberList.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    )}
                    {selectedPeople.length > 0 && (
                      <button
                        type="button"
                        disabled={isSending}
                        onClick={() => setSelectedPeople([])}
                        className="flex items-center gap-1 rounded-full bg-[#F1F5F4] px-2.5 py-1 text-[10px] font-bold text-[#4E615E] hover:bg-[#E5ECEA] transition-colors disabled:opacity-50"
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
                    disabled={isSending}
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
                          disabled={isSending}
                          onClick={() => handlePersonSelect({ id, name })}
                          className={`w-full flex items-center gap-3 rounded-[14px] p-2.5 text-left transition-all duration-200 ${
                            isChosen
                              ? "bg-[#EAF4F2] ring-1 ring-[#0A4F48]/25"
                              : "hover:bg-[#F4F7F6]"
                          } ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
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
                disabled={isSending}
                onChange={(event) => setMessage(event.target.value)}
                rows={10}
                placeholder="Type your message here. Include the context, expected outcome, and any timing details your team should know."
                className="min-h-[280px] w-full rounded-[26px] bg-[#F4F7F6] px-5 py-4 text-[15px] leading-7 text-[#1B3431] outline-none ring-0 placeholder:text-[#9AA8A5] focus:ring-2 focus:ring-[#0A4F48]/15 disabled:opacity-50"
              />

              <div className="mt-6 rounded-[28px] bg-[linear-gradient(180deg,rgba(248,250,249,0.95),rgba(241,245,244,0.85))] p-4 md:p-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  disabled={isSending}
                  onChange={handleFilesChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isSending}
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-[#DDE5E2] bg-white/70 px-4 py-10 text-center transition-all duration-300 hover:bg-white disabled:opacity-50"
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
                    {attachedFiles.map((file, idx) => (
                      <span
                        key={`${file.name}-${idx}`}
                        className="flex items-center gap-2 rounded-full bg-[#F1F5F4] px-3 py-2 text-xs font-semibold text-[#4E615E]"
                      >
                        {file.name}
                        {!isSending && (
                             <button 
                                type="button" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
                                }}
                                className="text-[#FB5858] hover:scale-110 transition-transform"
                             >
                                <X size={12} />
                             </button>
                        )}
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
                  disabled={!selectedRecipient || isSending}
                  onClick={handleSendMessage}
                  className="inline-flex min-w-[180px] items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#0A4F48] to-[#117E72] px-8 py-3.5 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_18px_30px_-18px_rgba(10,79,72,0.9)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSending ? (
                      <>
                        Sending...
                        <Loader2 size={16} className="animate-spin" />
                      </>
                  ) : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                  )}
                </button>
              </div>
            </section>
=======
  const departmentHistory = requests.filter(
    (request) => request.recipientType === selectedDepartment,
  );

  return (
    <div className="min-h-full bg-[#f6f6f1] px-4 pb-6 pt-3 md:px-6 md:pb-8 md:pt-4">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-6">
          <h1 className="text-[40px] font-black leading-none tracking-[-0.055em] text-[#0c6a5f] md:text-[46px]">
            Send Message
          </h1>
          <p className="mt-2 text-[15px] text-[#60726b]">
            Communicate directly with your dedicated wellness team members.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[174px_minmax(0,1fr)]">
          <section className="min-h-[540px] rounded-[18px] border border-[#ecefe8] bg-white px-4 py-4 shadow-[0_6px_18px_-16px_rgba(26,52,45,0.18)]">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#5d7f73]">
              Choose Recipient
            </p>

            <div className="mt-4 space-y-2.5">
              {recipientOptions.map((recipient) => {
                const Icon = recipient.icon;
                const isActive = recipient.id === selectedDepartment;

                return (
                  <button
                    key={recipient.id}
                    type="button"
                    onClick={() => setSelectedDepartment(recipient.id)}
                    className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-3 text-left transition-colors ${
                      isActive
                        ? "border-[#edf0e9] bg-[#f7f8f4]"
                        : "border-[#f3f4ee] bg-[#fbfcf8] hover:bg-[#f7f8f4]"
                    }`}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef3ef] text-[#7ba99e]">
                      <Icon size={14} />
                    </div>
                    <span className="flex-1 text-[14px] font-semibold text-[#344741]">
                      {recipient.label}
                    </span>
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        isActive
                          ? "border-[#0d6f64] bg-[#0d6f64] shadow-[inset_0_0_0_3px_#f7f8f4]"
                          : "border-[#d7ddd6] bg-white"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-[12px] bg-[#fbf4e6] px-3 py-4">
              <p className="text-[10px] leading-5 text-[#9d8d72]">
                Response time is typically within 4-6 business hours. For
                emergencies, please use the direct hotline.
              </p>
            </div>

            <div className="mt-5 min-h-[220px] rounded-[14px] bg-white">
              {isLoading ? (
                <div className="px-2 py-2 text-[11px] text-[#9aa7a0]">Loading...</div>
              ) : departmentHistory.length > 0 ? (
                <div className="space-y-2">
                  {departmentHistory.slice(0, 2).map((request) => (
                    <div
                      key={request._id}
                      className="rounded-[12px] border border-[#eef1ea] bg-[#fbfcf8] px-3 py-3"
                    >
                      <p className="line-clamp-3 text-[12px] leading-5 text-[#72847d]">
                        {request.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[18px] border border-[#ecefe8] bg-white px-4 py-4 shadow-[0_6px_18px_-16px_rgba(26,52,45,0.18)] md:px-5 md:py-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#5d7f73]">
              Message Content
            </p>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type your message here..."
              className="mt-4 h-[192px] w-full resize-none rounded-[12px] border border-[#edf0e9] bg-[#f3f4f0] px-4 py-4 text-[14px] leading-6 text-[#344741] outline-none placeholder:text-[#b3bcb7] focus:border-[#d8e0d8]"
            />

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`mt-4 rounded-[12px] border border-dashed px-5 py-10 text-center transition-colors ${
                isDragging
                  ? "border-[#a0bfb4] bg-[#f4f8f5]"
                  : "border-[#e7ebe4] bg-[#fbfcf8]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFilesChange}
                className="hidden"
              />

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ef] text-[#8ab3a8]">
                <Upload size={18} />
              </div>
              <p className="mt-3 text-[15px] font-bold text-[#384741]">
                Drag &amp; Drop files
              </p>
              <p className="mt-1 text-[11px] text-[#9da9a3]">
                PNG, JPG PDF up to 10MB
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 rounded-full bg-[#edf2eb] px-4 py-2 text-[11px] font-bold text-[#687d75]"
              >
                Or browse files
              </button>
            </div>

            {attachedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dfe6df] bg-[#f8fbf8] px-3 py-1.5 text-[11px] font-semibold text-[#587068]"
                  >
                    <Paperclip size={12} />
                    <span className="max-w-[180px] truncate">{file.name}</span>
                    <span>{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="text-[#7a8d86]"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 border-t border-[#eff2eb] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-[11px] text-[#9aa6a0]">
                <Lock size={13} />
                Attachments are encrypted and secure
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSending}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#0d7669] px-7 py-3 text-[15px] font-bold text-white shadow-[0_10px_18px_-14px_rgba(13,118,105,0.82)] transition-colors hover:bg-[#0b695f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSending ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        <section className="mt-4 overflow-hidden rounded-[18px] border border-[#ecefe8] bg-white shadow-[0_6px_18px_-16px_rgba(26,52,45,0.18)]">
          <div className="grid md:grid-cols-[minmax(0,1fr)_180px]">
            <div className="px-6 py-6 md:px-7 md:py-7">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#7d9169]">
                Wellness Insights
              </p>
              <h2 className="mt-4 max-w-[520px] text-[24px] font-black leading-[1.14] tracking-[-0.04em] text-[#195f55]">
                Enhance your consultation with historical data.
              </h2>
              <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-[#687971]">
                Attaching your latest biometric reports or meal logs helps our
                experts provide more nuanced and personalized advice.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-[#165d54]"
              >
                Explore library
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="relative flex min-h-[174px] items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#59bfa9_0%,#43aa95_100%)]">
              <img
                src={assets.dietitianCartoon}
                alt="Wellness support illustration"
                className="h-[172px] w-auto object-contain pt-4"
              />
            </div>
>>>>>>> Stashed changes
          </div>
        </section>
      </div>
    </div>
  );
}

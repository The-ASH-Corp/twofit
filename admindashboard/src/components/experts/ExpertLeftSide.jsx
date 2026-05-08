
import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  MessageSquare,
  User,
  Calendar,
  Mail,
  Phone,
  X,
  Briefcase,
  Clock,
  Loader2,
  Copy,
  Users,
  Award
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getChats } from "@/redux/features/chat/chat.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { toast } from "react-toastify";
import { ENV } from "../../utils/env";

const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const baseUrl = (ENV.API_BASE_URL || "").replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};

// Helper functions kept same
const getPrivateRoomId = (u1, u2) =>
  `private:${[String(u1), String(u2)].sort().join("_")}`;

const getMessageType = (msg) => {
  if (msg?.messageType) return msg.messageType;
  if (!msg?.mediaUrl) return "text";

  const mimeType = msg?.mediaMeta?.mimeType || "";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "voice";
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(msg.mediaUrl)) return "image";
  return "voice";
};

const ExpertLeftSide = ({ expert }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isChatMonitorOpen, setIsChatMonitorOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [monitorMessages, setMonitorMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState("");

  const assignedClients = useMemo(
    () =>
      Array.isArray(expert?.assignedUsers)
        ? expert.assignedUsers.filter((client) => client?._id)
        : [],
    [expert?.assignedUsers],
  );

  useEffect(() => {
    if (!isChatMonitorOpen) return;
    if (!selectedClient && assignedClients.length > 0) {
      setSelectedClient(assignedClients[0]);
    }
  }, [isChatMonitorOpen, selectedClient, assignedClients]);

  useEffect(() => {
    if (!isChatMonitorOpen || !expert?._id || !selectedClient?._id) {
      setMonitorMessages([]);
      return;
    }

    let isMounted = true;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      setChatError("");

      try {
        const roomId = getPrivateRoomId(expert?._id, selectedClient?._id);
        const response = await dispatch(
          getChats({ page: 1, limit: 300, chatId: roomId }),
        ).unwrap();

        if (!isMounted) return;
        setMonitorMessages(Array.isArray(response?.messages) ? response.messages : []);
      } catch (error) {
        if (!isMounted) return;
        setMonitorMessages([]);
        setChatError(
          typeof error === "string" ? error : "Failed to load chat messages",
        );
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [dispatch, isChatMonitorOpen, expert?._id, selectedClient?._id]);

  useEffect(() => {
    if (!isChatMonitorOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMonitor();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isChatMonitorOpen]);

  const closeMonitor = () => {
    setIsChatMonitorOpen(false);
    setSelectedClient(null);
    setMonitorMessages([]);
    setChatError("");
  };

  const handleCopy = (text) => {
    if (text && text !== "N/A") {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    }
  };

  const profileDetails = [
    {
      label: "Experience",
      value: `${expert?.experience || 0} Years`,
      icon: Clock,
    },
    {
      label: "Clients",
      value: expert?.assignedUsers?.length || 0,
      icon: Users,
    },
    {
      label: "Rating",
      value: `${expert?.avgRating?.toFixed(1) || 0} / 5.0`,
      icon: Star,
    },
    {
      label: "Specialisation",
      value: Array.isArray(expert?.specialization)
        ? expert.specialization
            .map((s) => (typeof s === "object" ? s.title : s))
            .join(", ")
        : expert?.specialization || "N/A",
      icon: Award
    },
  ];

  const contactDetails = [
    { label: "Email", value: expert?.email || "N/A", icon: Mail, copy: true },
    { label: "Phone", value: expert?.phone || "N/A", icon: Phone, copy: true },
    { label: "DOB", value: expert?.dob ? new Date(expert.dob).toLocaleDateString() : "N/A", icon: Calendar },
    { label: "Gender", value: expert?.gender || "N/A", icon: User },
  ];

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-[#EEF2F6] bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] transition-all group hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)]">
      {/* Header Background */}
      <div className="relative h-24 shrink-0 overflow-hidden bg-linear-to-r from-[#0A4F48] to-[#116D63] sm:h-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute right-4 top-3 text-white/10 sm:top-4">
          <Briefcase size={80} />
        </div>
        <div className="absolute right-3 top-3 flex gap-2 sm:right-4 sm:top-4">
          <span
            className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md sm:px-2.5 ${
              expert?.status
                ? "bg-emerald-400/20 text-emerald-50 border-emerald-400/30"
                : "bg-gray-400/20 text-gray-50 border-gray-400/30"
            }`}
          >
            {expert?.status == "Active" ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative flex shrink-0 flex-col px-4 sm:px-6">
        <div className="-mt-10 mb-3 self-start sm:-mt-12">
          <div className="h-16 w-16 rounded-2xl bg-white p-1.5 shadow-lg transition-transform duration-300 ease-out rotate-3 group-hover:rotate-0 group-hover:scale-105 sm:h-20 sm:w-20">
            <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
              {expert?.image ? (
                <img
                  src={getFileUrl(expert.image)}
                  alt={expert.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-gray-300 w-8 h-8" />
              )}
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col sm:mb-6">
          <h2 className="break-words text-lg font-bold tracking-tight text-[#1E293B] sm:text-xl">
            {expert?.name}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 break-words text-xs font-medium text-[#64748B]">
            <Briefcase size={12} className="text-[#0A4F48]" />
            {expert?.specialization?.join(", ") || "General Expert"}
          </p>
        </div>

        {/* Action Button */}
        {user?.role === "admin" && (
          <button
            onClick={() => setIsChatMonitorOpen(true)}
            className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] py-2.5 text-sm font-bold text-[#166534] shadow-sm transition-all duration-200 hover:bg-[#DCFCE7] sm:mb-6"
          >
            <MessageSquare size={16} />
            <span>Monitor Chats</span>
          </button>
        )}
      </div>

      {/* Details List */}
      <div className="overflow-y-visible px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="space-y-5 sm:space-y-6">
          {/* Stats Grid */}
          <div>
            <h3 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-wider mb-3">
              Professional Stats
            </h3>
            <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
              {profileDetails.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon size={12} className="text-[#64748B]" />
                    <span className="text-[10px] text-[#64748B] font-medium">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#334155] line-clamp-2">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-wider mb-3">
              Contact Info
            </h3>
            <div className="space-y-3">
              {contactDetails.map((item, i) => (
                <div
                  key={i}
                  className="group/item flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
                      <item.icon size={14} />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[10px] text-[#94A3B8] font-medium">
                        {item.label}
                      </span>
                      <span className="line-clamp-1 break-all text-sm font-semibold text-[#334155] sm:break-words">
                        {item.value}
                      </span>
                    </div>
                  </div>
                  {item.copy && (
                    <button
                      onClick={() => handleCopy(item.value)}
                      className="shrink-0 rounded-lg p-1.5 text-slate-400 opacity-100 transition-all hover:bg-slate-100 lg:opacity-0 group-hover/item:opacity-100"
                    >
                      <Copy size={14} className="rotate-90" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Monitor Modal/Overlay */}
      {isChatMonitorOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/45 backdrop-blur-[2px] p-0 sm:p-4">
          <button
            type="button"
            onClick={closeMonitor}
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Close chat monitor"
          />

          <div className="relative z-10 w-full max-w-none sm:max-w-6xl h-dvh sm:h-[88dvh] rounded-none sm:rounded-3xl border-0 sm:border border-slate-200 bg-white shadow-none sm:shadow-[0_30px_90px_rgba(15,23,42,0.28)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 sm:p-4 border-b border-[#F1F5F9] flex items-center justify-between bg-[#FAFCFF] shrink-0">
              <div>
                <h3 className="font-bold text-[#1E293B]">Chat Monitor</h3>
                <p className="text-[11px] text-[#64748B]">
                  View client interactions
                </p>
              </div>
              <button
                onClick={closeMonitor}
                className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-red-500 hover:border-red-200 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
              {/* Client List */}
              <div className="w-full border-b border-[#F1F5F9] bg-[#F8FAFC] max-h-40 overflow-y-auto sm:w-[34%] sm:min-w-[180px] sm:max-w-[300px] sm:max-h-none sm:border-b-0 sm:border-r">
                {assignedClients.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">
                    No clients assigned
                  </div>
                ) : (
                  assignedClients.map((client) => (
                    <div
                      key={client._id}
                      onClick={() => setSelectedClient(client)}
                      className={`p-3 border-b border-[#F1F5F9] cursor-pointer hover:bg-white transition-colors ${selectedClient?._id === client._id ? "bg-white border-l-4 border-l-[#0A4F48]" : "border-l-4 border-l-transparent"}`}
                    >
                      <div className="font-semibold text-xs text-[#334155] truncate">
                        {client.name}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {/* Messages Header */}
                {selectedClient && (
                  <div className="p-2 border-b border-[#F1F5F9] text-xs font-bold text-center text-[#0A4F48] bg-emerald-50/50">
                    Chat with {selectedClient.name}
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[#fafafa]">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2
                        className="animate-spin text-[#0A4F48]"
                        size={24}
                      />
                    </div>
                  ) : chatError ? (
                    <div className="text-center text-red-400 text-xs mt-10">
                      {chatError}
                    </div>
                  ) : monitorMessages.length === 0 ? (
                    <div className="text-center text-slate-300 text-xs mt-10">
                      No messages found
                    </div>
                  ) : (
                    monitorMessages.map((msg, idx) => {
                      const isExpert = msg.sender === expert._id;
                      const type = getMessageType(msg);
                      return (
                        <div
                          key={idx}
                          className={`flex max-w-[92%] flex-col sm:max-w-[85%] ${isExpert ? "ml-auto items-end" : "mr-auto items-start"}`}
                        >
                          <div
                            className={`px-3 py-2 rounded-xl text-xs ${isExpert ? "bg-[#0A4F48] text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm"}`}
                          >
                            {type === "text" && <p>{msg.content}</p>}
                            {type === "image" && (
                              <img
                                src={getFileUrl(msg.mediaUrl)}
                                alt="attachment"
                                className="max-w-[160px] rounded-lg sm:max-w-[220px]"
                              />
                            )}
                            {type === "voice" && (
                              <span className="italic opacity-80">
                                🎤 Voice Message
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertLeftSide;

import React, { useEffect, useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
  MailOpen,
  MessageCircleMore,
  Paperclip,
  Search,
  Shield,
  UserRound,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { ENV } from "@/utils/env";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";

const PAGE_SIZE = 10;

const roleTitles = {
  admin: "Admin Inbox",
  head: "Head Inbox",
  trainer: "Trainer Inbox",
  therapist: "Therapist Inbox",
  dietician: "Dietician Inbox",
  dietitian: "Dietitian Inbox",
  expert: "Expert Inbox",
};

const buildAttachmentHref = (url = "") => {
  if (!url) return "#";

  try {
    return new URL(url, ENV.API_BASE_URL).toString();
  } catch {
    return url;
  }
};

const toReadableRecipient = (value = "") => {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "dietitian") return "Dietitian";
  if (normalized === "dietician") return "Dietician";

  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : "Support";
};

const getStorageKey = (user = {}) => {
  const userId = user?._id || user?.id || "unknown";
  const role = String(user?.role || "unknown").toLowerCase();
  return `twofit-support-read:${role}:${userId}`;
};

const readStoredReadIds = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function TwofitSupport() {
  const user = useAppSelector(selectUser);
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [readIds, setReadIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const storageKey = useMemo(() => getStorageKey(user), [user]);

  useEffect(() => {
    setReadIds(readStoredReadIds(storageKey));
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(readIds));
    } catch {
      // ignore localStorage errors
    }
  }, [readIds, storageKey]);

  const pageTitle = useMemo(() => {
    const role = String(user?.role || "").trim().toLowerCase();
    return roleTitles[role] || roleTitles.expert;
  }, [user?.role]);

  const normalizedRequests = useMemo(
    () =>
      requests.map((request) => ({
        ...request,
        isRead: readIds.includes(request._id),
      })),
    [readIds, requests],
  );

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return normalizedRequests.filter((request) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !request.isRead) ||
        (filter === "read" && request.isRead);

      if (!matchesFilter) return false;

      if (!query) return true;

      const haystack = [
        request.founderName,
        request.founderEmail,
        request.message,
        request.recipientType,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [filter, normalizedRequests, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));

  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRequests.slice(start, start + PAGE_SIZE);
  }, [filteredRequests, page]);

  const selectedRequest = useMemo(
    () =>
      normalizedRequests.find((request) => request._id === selectedRequestId) ||
      null,
    [normalizedRequests, selectedRequestId],
  );

  const unreadCount = useMemo(
    () => normalizedRequests.filter((request) => !request.isRead).length,
    [normalizedRequests],
  );

  const markAsRead = (requestId) => {
    if (!requestId) return;
    setReadIds((current) =>
      current.includes(requestId) ? current : [...current, requestId],
    );
  };

  const toggleReadState = (requestId) => {
    if (!requestId) return;
    setReadIds((current) =>
      current.includes(requestId)
        ? current.filter((id) => id !== requestId)
        : [...current, requestId],
    );
  };

  const selectMessage = (request) => {
    setSelectedRequestId(request._id);
    markAsRead(request._id);
  };

  const markAllAsRead = () => {
    setReadIds(normalizedRequests.map((request) => request._id));
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/growth-support");
        const items = Array.isArray(response?.data) ? response.data : [];
        setRequests(items);
        setSelectedRequestId(items[0]?._id || null);
      } catch (error) {
        console.error("Failed to fetch support messages", error);
        setRequests([]);
        setSelectedRequestId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!selectedRequestId && filteredRequests.length > 0) {
      setSelectedRequestId(filteredRequests[0]._id);
    }

    if (
      selectedRequestId &&
      !normalizedRequests.some((request) => request._id === selectedRequestId)
    ) {
      setSelectedRequestId(filteredRequests[0]?._id || null);
    }
  }, [filteredRequests, normalizedRequests, selectedRequestId]);

  return (
    <div className="flex h-[calc(100vh-96px)] gap-4 overflow-hidden bg-[#f6f8fc] p-3 md:p-4">
      <aside className="hidden w-[86px] shrink-0 rounded-[28px] border border-[#e2e7f0] bg-white p-3 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] xl:flex xl:flex-col xl:items-center xl:gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dbeafe] text-[#1d4ed8]">
          <Mail size={20} />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5e9] text-[#2e7d32]">
          <Inbox size={20} />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff8e1] text-[#b7791f]">
          <Shield size={20} />
        </div>
        <div className="mt-auto rounded-[20px] bg-[#f1f5f9] px-3 py-4 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#64748b]">
            Unread
          </p>
          <p className="mt-1 text-lg font-black text-[#0f172a]">
            {unreadCount}
          </p>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 overflow-hidden rounded-[30px] border border-[#e2e7f0] bg-white shadow-[0_18px_48px_-28px_rgba(15,23,42,0.28)]">
        <div className="flex w-full min-w-0 flex-col border-r border-[#e8edf5] lg:w-[520px]">
          <div className="border-b border-[#edf2f7] bg-[#f8faff] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#64748b]">
                  TwoFit Support
                </p>
                <h1 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-[#111827]">
                  {pageTitle}
                </h1>
              </div>

              <button
                type="button"
                onClick={markAllAsRead}
                disabled={!unreadCount}
                className="rounded-full border border-[#d7dfea] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#1f2937] transition-all hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Mark All Read
              </button>
            </div>

            <div className="mt-4 rounded-full border border-[#d7dfea] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <Search size={16} className="text-[#94a3b8]" />
                <input
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search support mail"
                  className="w-full bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:text-[#94a3b8]"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {[
                { value: "all", label: "Primary" },
                { value: "unread", label: "Unread" },
                { value: "read", label: "Read" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setFilter(item.value);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all ${
                    filter === item.value
                      ? "bg-[#2563eb] text-white shadow-[0_10px_18px_-12px_rgba(37,99,235,0.8)]"
                      : "bg-[#eef2f7] text-[#64748b] hover:bg-[#e2e8f0]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-white">
            {loading ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="h-20 animate-pulse rounded-2xl bg-[#f3f6fb]" />
                ))}
              </div>
            ) : paginatedRequests.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f6fb] text-[#94a3b8]">
                  <Inbox size={34} />
                </div>
                <h2 className="text-lg font-black text-[#111827]">
                  No support messages
                </h2>
                <p className="mt-2 max-w-[280px] text-sm leading-6 text-[#6b7280]">
                  Try another search or filter. Founder support messages will appear here like inbox mail.
                </p>
              </div>
            ) : (
              paginatedRequests.map((request) => (
                <button
                  key={request._id}
                  type="button"
                  onClick={() => selectMessage(request)}
                  className={`grid w-full grid-cols-[auto_minmax(0,150px)_minmax(0,1fr)_auto] items-center gap-3 border-b border-[#edf2f7] px-4 py-4 text-left transition-all hover:bg-[#f8fbff] ${
                    selectedRequest?._id === request._id ? "bg-[#eef4ff]" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleReadState(request._id);
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        request.isRead
                          ? "bg-[#eef2f7] text-[#64748b]"
                          : "bg-[#dbeafe] text-[#2563eb]"
                      }`}
                    >
                      {request.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                    </button>
                    {!request.isRead && <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm ${
                        request.isRead ? "font-bold text-[#475569]" : "font-black text-[#0f172a]"
                      }`}
                    >
                      {request.founderName || "Founder"}
                    </p>
                    <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                      {toReadableRecipient(request.recipientType)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm ${
                        request.isRead ? "font-medium text-[#64748b]" : "font-semibold text-[#1f2937]"
                      }`}
                    >
                      {request.message}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                      {formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-[#64748b]">
                      {request.attachments?.length || 0} files
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-[#edf2f7] bg-[#fafcff] px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#64748b]">
                Page {page} / {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d7dfea] bg-white text-[#64748b] transition-all hover:bg-[#eef4ff] hover:text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d7dfea] bg-white text-[#64748b] transition-all hover:bg-[#eef4ff] hover:text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 bg-[#f8faff] lg:flex lg:flex-col">
          {selectedRequest ? (
            <>
              <div className="border-b border-[#e8edf5] bg-white px-8 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#64748b]">
                      Support Mail
                    </p>
                    <h2 className="mt-2 text-[30px] font-black tracking-[-0.03em] text-[#111827]">
                      Message from {selectedRequest.founderName || "Founder"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#64748b]">
                      {toReadableRecipient(selectedRequest.recipientType)} mailbox
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReadState(selectedRequest._id)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] ${
                      selectedRequest.isRead
                        ? "border border-[#d7dfea] bg-white text-[#475569]"
                        : "bg-[#2563eb] text-white"
                    }`}
                  >
                    <CheckCheck size={14} />
                    {selectedRequest.isRead ? "Mark Unread" : "Mark Read"}
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-4 rounded-[24px] bg-[#f8faff] px-5 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dbeafe] text-[#2563eb]">
                    <UserRound size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-[#111827]">
                      {selectedRequest.founderName || "Founder"}
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-[#64748b]">
                      {selectedRequest.founderEmail || "No email provided"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#94a3b8]">
                      {format(new Date(selectedRequest.createdAt), "MMMM d, yyyy")}
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-[#64748b]">
                      {format(new Date(selectedRequest.createdAt), "hh:mm aa")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
                <div className="mx-auto max-w-4xl space-y-6">
                  <section className="rounded-[28px] border border-[#e2e7f0] bg-white p-7 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)]">
                    <div className="flex items-center gap-3 text-[#2563eb]">
                      <MessageCircleMore size={20} />
                      <h3 className="text-lg font-black tracking-tight text-[#111827]">
                        Message Body
                      </h3>
                    </div>

                    <div className="mt-5 rounded-[24px] bg-[#f8faff] p-6">
                      <p className="whitespace-pre-line text-[15px] leading-8 text-[#334155]">
                        {selectedRequest.message}
                      </p>
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-[#e2e7f0] bg-white p-7 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)]">
                    <div className="flex items-center gap-3 text-[#2563eb]">
                      <Shield size={20} />
                      <h3 className="text-lg font-black tracking-tight text-[#111827]">
                        Mail Details
                      </h3>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-[22px] bg-[#f8faff] p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
                          Recipient
                        </p>
                        <p className="mt-2 text-sm font-black text-[#111827]">
                          {toReadableRecipient(selectedRequest.recipientType)}
                        </p>
                      </div>
                      <div className="rounded-[22px] bg-[#f8faff] p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
                          Status
                        </p>
                        <p className="mt-2 text-sm font-black text-[#111827]">
                          {selectedRequest.isRead ? "Read" : "Unread"}
                        </p>
                      </div>
                      <div className="rounded-[22px] bg-[#f8faff] p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
                          Attachments
                        </p>
                        <p className="mt-2 text-sm font-black text-[#111827]">
                          {selectedRequest.attachments?.length || 0}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[28px] border border-[#e2e7f0] bg-white p-7 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)]">
                    <div className="flex items-center gap-3 text-[#2563eb]">
                      <Paperclip size={20} />
                      <h3 className="text-lg font-black tracking-tight text-[#111827]">
                        Attachments
                      </h3>
                    </div>

                    {selectedRequest.attachments?.length ? (
                      <div className="mt-5 grid gap-3">
                        {selectedRequest.attachments.map((attachment, index) => (
                          <a
                            key={`${attachment.filename}-${index}`}
                            href={buildAttachmentHref(attachment.url)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between rounded-[22px] border border-[#e2e7f0] bg-[#f8faff] px-5 py-4 transition-all hover:border-[#bfdbfe] hover:bg-[#eff6ff]"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-[#111827]">
                                {attachment.originalName}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-[#64748b]">
                                {attachment.mimeType}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#2563eb] ring-1 ring-[#d7dfea]">
                              Open
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-5 text-sm font-medium text-[#64748b]">
                        No files were attached to this support mail.
                      </p>
                    )}
                  </section>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-10 text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white text-[#94a3b8] shadow-[0_18px_32px_-24px_rgba(15,23,42,0.35)]">
                <Inbox size={40} />
              </div>
              <h2 className="text-2xl font-black text-[#111827]">
                Select a message
              </h2>
              <p className="mt-3 max-w-[340px] text-sm leading-7 text-[#64748b]">
                Choose any founder support message from the inbox list to open it in this reading pane.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Clock,
  Calendar,
  Sparkles,
  User,
  Paperclip,
  ArrowRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { fetchReceivedSupport, markSupportAsRead } from "@/redux/features/growthSupport/growthSupport.thunk";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";

export default function ReceivedSupport() {
  const dispatch = useDispatch();
  const { requests, totalCount, status } = useAppSelector((state) => state.growthSupport);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchReceivedSupport({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    if (requests?.length > 0 && !selectedRequest) {
      setSelectedRequest(requests[0]);
    }
  }, [requests]);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    if (request.status === "unread") {
      dispatch(markSupportAsRead(request._id));
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(totalCount / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <BackgroundAnimation />
      <div className="relative z-10 flex h-[calc(100vh-140px)] bg-transparent gap-6 p-4 md:p-6 overflow-hidden">
        {/* List Panel */}
        <div className="w-full lg:w-[420px] xl:w-[480px] bg-white/90 backdrop-blur-xl rounded-[32px] border border-[#0A4F48]/10 shadow-[0_8px_30px_-12px_rgba(10,79,72,0.1)] flex flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(10,79,72,0.15)] mt-4">
          <div className="p-6 border-b border-[#0A4F48]/5 flex justify-between items-center bg-white/50 backdrop-blur-xl sticky top-0 z-10">
            <div>
              <h2 className="text-[#0A4F48] text-2xl font-black tracking-tight leading-none">
                Growth Support
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 bg-[#0A4F48] rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black text-[#6E8A84] uppercase tracking-widest leading-none">
                  {totalCount} MESSAGES RECEIVED
                </p>
              </div>
            </div>
            <div className="p-3 bg-[#EAF4F2] text-[#0A4F48] rounded-2xl ring-1 ring-[#DDF1ED] transition-transform hover:rotate-12">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
            {status === "loading" && requests?.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-[#F8FAF9] animate-pulse rounded-2xl w-full"
                  />
                ))}
              </div>
            ) : requests?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-[#F8FAF9] rounded-full flex items-center justify-center mb-4">
                  <Inbox size={32} className="text-[#9AA8A5]" />
                </div>
                <h3 className="text-[#163A36] font-bold">Inbox is empty</h3>
                <p className="text-xs text-[#6E8A84] mt-2 max-w-[200px]">
                  No growth support messages from the Founder yet.
                </p>
              </div>
            ) : (
              requests?.map((request) => (
                <div
                  key={request._id}
                  onClick={() => handleRequestClick(request)}
                  className={`group relative p-5 rounded-[24px] transition-all duration-500 border cursor-pointer active:scale-[0.98] ${
                    selectedRequest?._id === request._id
                      ? "bg-gradient-to-br from-[#EAF4F2]/80 to-white border-[#0A4F48]/10 shadow-[0_10px_20px_-10px_rgba(10,79,72,0.1)] translate-x-1"
                      : "bg-white border-transparent hover:bg-[#F8FAF9] hover:border-[#0A4F48]/5 hover:shadow-xl hover:shadow-teal-100/30 hover:-translate-y-1"
                  }`}
                >
                  {selectedRequest?._id === request._id && (
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#0A4F48] rounded-r-full shadow-[0_0_12px_rgba(10,79,72,0.4)] transition-all duration-500" />
                  )}

                  <div className="flex gap-4">
                    <div className={`p-3 rounded-2xl shrink-0 transition-all duration-300 ${request.status === 'read' ? 'bg-[#F1F5F4] text-[#7B8D89]' : 'bg-[#0A4F48] text-white shadow-lg shadow-[#0A4F48]/20'}`}>
                      <User size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1.5">
                        <h3 className={`font-black text-sm truncate tracking-tight ${request.status === 'read' ? "text-[#7B8D89]" : "text-[#163A36]"}`}>
                          {request.sender?.name || "Founder"}
                        </h3>
                        {request.status === 'unread' && (
                          <span className="w-2.5 h-2.5 bg-[#0A4F48] rounded-full shadow-[0_0_15px_rgba(10,126,114,0.8)] shrink-0 mt-1 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-[#6E8A84] line-clamp-1 mb-3 leading-relaxed font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                        {request.message}
                      </p>
                      <div className="flex items-center gap-2.5 text-[9px] text-[#9AA8A5] font-black uppercase tracking-widest bg-[#F8FAF9] w-fit px-2 py-1 rounded-lg group-hover:bg-[#EAF4F2] transition-all">
                        <Clock size={10} className="group-hover:text-[#0A4F48]" />
                        <span>
                          {formatDistanceToNow(new Date(request.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-[#0A4F48]/5 bg-white/50 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-[11px] font-black text-[#163A36]">
                  Page {page} <span className="text-[#9AA8A5]">/</span> {totalPages || 1}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center bg-[#F8FAF9] text-[#0A4F48] rounded-xl hover:bg-[#0A4F48] hover:text-white disabled:opacity-30 disabled:hover:bg-[#F8FAF9] transition-all active:scale-90"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-[#F8FAF9] text-[#0A4F48] rounded-xl hover:bg-[#0A4F48] hover:text-white disabled:opacity-30 disabled:hover:bg-[#F8FAF9] transition-all active:scale-90"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="hidden lg:flex flex-1 flex-col h-full perspective-1000 mt-4">
          {selectedRequest ? (
            <div className="bg-white/95 backdrop-blur-xl rounded-[40px] border border-[#0A4F48]/10 shadow-[0_20px_60px_-15px_rgba(10,79,72,0.1)] flex flex-col h-full overflow-hidden animate-in fade-in zoom-in-95 duration-700 ease-out">
              <div className="relative h-48 bg-gradient-to-br from-[#0A4F48] via-[#117E72] to-[#163A36] p-10 flex flex-col justify-end overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">
                  <Sparkles size={160} className="text-white" />
                </div>
                <div className="relative z-10">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] ring-1 ring-white/20">
                    SENDER: FOUNDER
                  </span>
                  <h1 className="text-3xl font-black text-white mt-4 tracking-tight">
                    {selectedRequest.sender?.name || "Growth Support Request"}
                  </h1>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                <div className="flex items-center gap-6 p-6 rounded-[28px] bg-[#F8FAF9] border border-[#0A4F48]/5">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-[#6E8A84] uppercase tracking-widest">
                      Received Date
                    </p>
                    <div className="flex items-center gap-2 text-[#163A36] font-bold">
                      <Calendar size={16} className="text-[#0A4F48]" />
                      <span>{format(new Date(selectedRequest.createdAt), "MMMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-[#DDE5E2]" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-[#6E8A84] uppercase tracking-widest">
                      Exact Time
                    </p>
                    <div className="flex items-center gap-2 text-[#163A36] font-bold">
                      <Clock size={16} className="text-[#0A4F48]" />
                      <span>{format(new Date(selectedRequest.createdAt), "hh:mm aa")}</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-emerald max-w-none">
                  <p className="text-[15px] text-[#4E615E] leading-[1.8] font-medium whitespace-pre-line">
                    {selectedRequest.message}
                  </p>
                </div>

                {selectedRequest.attachments?.length > 0 && (
                  <div className="pt-8 border-t border-[#F0F4F2]">
                    <h4 className="text-xs font-black text-[#163A36] uppercase tracking-widest mb-4">
                      Attached Materials ({selectedRequest.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedRequest.attachments.map((url, idx) => {
                        const fileUrl = `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${url}`;
                        const isImage = /\\.(jpg|jpeg|png|gif|webp)$/i.test(url);

                        if (isImage) {
                          return (
                            <a
                              key={idx}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-2xl overflow-hidden border border-[#DDE5E2] hover:border-[#0A4F48]/30 hover:shadow-lg transition-all group relative aspect-video bg-[#F8FAF9]"
                            >
                              <img
                                src={fileUrl}
                                alt={`Attachment ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink className="text-white" size={24} />
                              </div>
                            </a>
                          );
                        }

                        return (
                          <a
                            key={idx}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#DDE5E2] hover:border-[#0A4F48]/30 hover:shadow-lg transition-all group"
                          >
                            <div className="p-2.5 bg-[#EAF4F2] text-[#0A4F48] rounded-xl group-hover:bg-[#0A4F48] group-hover:text-white transition-colors">
                              <Paperclip size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#163A36] truncate">
                                Attachment {idx + 1}
                              </p>
                              <p className="text-[10px] text-[#6E8A84]">
                                Click to view resource
                              </p>
                            </div>
                            <ExternalLink size={14} className="text-[#9AA8A5] group-hover:text-[#0A4F48]" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/50 backdrop-blur-xl rounded-[40px] border border-dashed border-[#DDE5E2]">
              <div className="w-24 h-24 bg-[#F8FAF9] rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Sparkles size={40} className="text-[#9AA8A5]" />
              </div>
              <h2 className="text-lg font-bold text-[#163A36]">Select a request</h2>
              <p className="text-sm text-[#6E8A84] mt-2 max-w-[280px]">
                Choose a support message from the list to view full details and instructions.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

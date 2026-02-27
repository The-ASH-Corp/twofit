import {
  selectBroadcast,
  selectBroadcastError,
  selectBroadcastStatus,
} from "@/redux/features/broadcast/broadcast.selector";
import { getBroadcast } from "@/redux/features/broadcast/broadcast.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { ENV } from "@/utils/env";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Type,
  Layers,
  MessageSquare,
  Eye,
  FileText,
} from "lucide-react";

const TemplateSummary = () => {
  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const baseUrl = (ENV.API_BASE_URL || "")
      .replace(/\/api\/v1\/?$/, "")
      .replace(/\/api\/?$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const broadcast = useSelector(selectBroadcast);
  const status = useSelector(selectBroadcastStatus);
  const error = useSelector(selectBroadcastError);
  const path = getFileUrl(broadcast?.attachment);

  useEffect(() => {
    if (id) {
      dispatch(getBroadcast(id));
    }
  }, [id, dispatch]);

  const fileExt = broadcast?.attachment?.split(".").pop()?.toUpperCase();

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}!</p>;

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-100px)] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/founder/broadcasts")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-[#0A4F48]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Broadcast Summary
            </h1>
            <p className="text-xs text-gray-500">
              Review your broadcast details before sending
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar pr-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
          {/* Main Content Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Title Section */}
                <div className="flex gap-4">
                  <div className="p-2.5 bg-emerald-50 text-[#0A4F48] rounded-xl h-fit">
                    <Type size={18} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Broadcast Title
                    </p>
                    <h2 className="text-lg font-bold text-gray-900">
                      {broadcast?.title || "No Title"}
                    </h2>
                  </div>
                  <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full h-fit">
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-600 capitalize">
                        {broadcast?.type || "Standard"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-50 w-full" />

                {/* Message Section */}
                <div className="flex gap-4">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl h-fit">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Message Content
                    </p>
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-50">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {broadcast?.message || "No message content provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Attachments Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-center gap-2">
                  <Paperclip size={18} className="text-[#0A4F48]" />
                  <h3 className="font-bold text-gray-900 text-sm">
                    Attachments
                  </h3>
                </div>
              </div>
              <div className="p-5">
                {broadcast?.attachment ? (
                  <div className="group relative bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 transition-all duration-300 hover:border-[#0A4F48]/30 hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white shadow-sm rounded-xl text-orange-500 border border-orange-50 group-hover:scale-110 transition-transform duration-300">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900 truncate flex-1">
                            {broadcast?.attachment.split("/").pop()}
                          </p>
                          <a
                            href={path}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-[#0A4F48] rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
                          >
                            <Eye size={12} />
                            View
                          </a>
                        </div>
                        <p className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase">
                          {fileExt} FILE
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <div className="p-3 bg-white rounded-full text-gray-300">
                      <Paperclip size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400">
                        No Attachments
                      </p>
                      <p className="text-[11px] text-gray-400">
                        This broadcast has no files attached
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats / Info Card */}
            <div className="bg-[#0A4F48] rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/10 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <p className="text-[#A5C1BD] text-xs font-semibold uppercase tracking-widest mb-4">
                Ready to Broadcast?
              </p>
              <p className="text-sm leading-relaxed opacity-90 mb-6">
                Ensure all details are correct. Once sent, this message will be
                delivered to the targeted audience immediately.
              </p>
              <button
                type="submit"
                className="w-full py-3 bg-white text-[#0A4F48] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-md group"
              >
                Launch Broadcast
                <Send
                  size={16}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Mobile Only or sticky desktop */}
      <div className="lg:hidden flex items-center justify-end gap-3 pb-4 pt-2 border-t border-gray-100 bg-white">
        <button
          type="button"
          onClick={() => navigate("/founder/broadcasts")}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 rounded-xl text-sm font-bold bg-[#0A4F48] text-white hover:bg-[#073a35] shadow-sm flex items-center gap-2"
        >
          Send Now
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default TemplateSummary;

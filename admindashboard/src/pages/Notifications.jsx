import React, { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Calendar,
  Clock,
  ArrowRight,
  Inbox,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

const NotificationIcon = ({ type, isRead }) => {
  const baseClasses = "p-2.5 rounded-2xl shrink-0 transition-all duration-300";

  switch (type) {
    case "weight_update":
      return (
        <div
          className={`${baseClasses} ${isRead ? "bg-emerald-50 text-emerald-600" : "bg-emerald-500 text-white shadow-lg shadow-emerald-200"}`}
        >
          <CheckCircle2 size={20} />
        </div>
      );
    case "alert":
    case "emergency":
      return (
        <div
          className={`${baseClasses} ${isRead ? "bg-rose-50 text-rose-600" : "bg-rose-500 text-white shadow-lg shadow-rose-200"}`}
        >
          <AlertCircle size={20} />
        </div>
      );
    case "reminder":
      return (
        <div
          className={`${baseClasses} ${isRead ? "bg-amber-50 text-amber-600" : "bg-amber-500 text-white shadow-lg shadow-amber-200"}`}
        >
          <Clock size={20} />
        </div>
      );
    default:
      return (
        <div
          className={`${baseClasses} ${isRead ? "bg-teal-50 text-teal-600" : "bg-teal-500 text-white shadow-lg shadow-teal-200"}`}
        >
          <Bell size={20} />
        </div>
      );
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/notifications?page=${page}&limit=10`,
      );

      if (res.success) {
        setNotifications(res.data || []);
        setPagination(
          res.pagination || { page, limit: 10, total: 0, totalPages: 1 },
        );

        if (res.data?.length > 0 && !selectedNotification) {
          setSelectedNotification(res.data[0]);
        }
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchNotifications(newPage);
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n,
        ),
      );
      axiosInstance
        .patch(`/notifications/${notification._id}/read`)
        .catch(console.error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50/20 gap-6 p-4 md:p-6 overflow-hidden">
      {/* List Panel */}
      <div className="w-full lg:w-[420px] xl:w-[480px] bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white/70 backdrop-blur-xl sticky top-0 z-10">
          <div>
            <h2 className="text-[#0A4F48] text-2xl font-black tracking-tight leading-none">
              Activity
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                {pagination.total} TOTAL MESSAGES
              </p>
            </div>
          </div>
          <div className="p-3 bg-teal-50/50 text-[#0A4F48] rounded-2xl ring-1 ring-teal-100/50 transition-transform hover:rotate-12">
            <Bell size={20} weight="fill" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-50 animate-pulse rounded-2xl w-full"
                />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Inbox size={32} className="text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-bold">All caught up!</h3>
              <p className="text-xs text-gray-400 mt-2 max-w-[200px]">
                No new notifications at the moment.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`group relative p-5 rounded-[24px] transition-all duration-500 border cursor-pointer active:scale-[0.98] ${
                  selectedNotification?._id === notification._id
                    ? "bg-linear-to-br from-teal-50/80 to-teal-50/30 border-teal-100 shadow-[0_10px_20px_-10px_rgba(13,148,136,0.1)] translate-x-1"
                    : "bg-white border-transparent hover:bg-gray-50/50 hover:border-gray-100 hover:shadow-xl hover:shadow-gray-200/30 hover:-translate-y-1"
                }`}
              >
                {/* Selection Pillar */}
                {selectedNotification?._id === notification._id && (
                  <div className="absolute left-0 top-6 bottom-6 w-1 bg-teal-500 rounded-r-full shadow-[0_0_12px_rgba(20,184,166,0.4)] transition-all duration-500" />
                )}

                <div className="flex gap-5">
                  <div className="transition-transform duration-500 group-hover:scale-110 group-active:scale-95">
                    <NotificationIcon
                      type={notification.type}
                      isRead={notification.isRead}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3
                        className={`font-black text-sm truncate tracking-tight ${notification.isRead ? "text-gray-500" : "text-[#011412]"}`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2.5 h-2.5 bg-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.8)] shrink-0 mt-1 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-3 leading-relaxed font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2.5 text-[9px] text-gray-400 font-black uppercase tracking-widest bg-gray-50/50 w-fit px-2 py-1 rounded-lg ring-1 ring-gray-100/50 group-hover:bg-teal-50/50 group-hover:ring-teal-100/50 transition-all">
                      <Clock
                        size={10}
                        className="text-gray-300 group-hover:text-teal-500"
                      />
                      <span>
                        {formatDistanceToNow(new Date(notification.createdAt), {
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

        {/* Improved Pagination */}
        <div className="p-8 border-t border-gray-50 bg-white/70 backdrop-blur-xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
                Location
              </p>
              <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest leading-none mt-1">
                Page {pagination.page}{" "}
                <span className="text-gray-300 mx-1">/</span>{" "}
                {pagination.totalPages}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-teal-500 hover:text-white disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400 transition-all duration-500 shadow-sm border border-gray-100 hover:border-teal-400 active:scale-90"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-teal-500 hover:text-white disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-gray-400 transition-all duration-500 shadow-sm border border-gray-100 hover:border-teal-400 active:scale-90"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="hidden lg:flex flex-1 flex-col h-full perspective-1000">
        {selectedNotification ? (
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] flex flex-col h-full overflow-hidden animate-in fade-in zoom-in-95 duration-700 ease-out">
            {/* Detail Top Header */}
            <div className="relative h-56 bg-linear-to-br from-teal-500 via-teal-600 to-teal-900 p-10 flex flex-col justify-end overflow-hidden shadow-[inset_0_-40px_80px_-20px_rgba(0,0,0,0.2)]">
              <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150 transition-transform duration-1000 hover:rotate-45">
                <Bell size={200} className="text-white" />
              </div>
              <div className="relative z-10">
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase tracking-[0.2em] ring-1 ring-white/20 shadow-xl">
                  {selectedNotification.type?.replace("_", " ") ||
                    "notification"}
                </span>
                <h1 className="text-4xl font-black text-white mt-5 tracking-[ -0.02em] leading-tight drop-shadow-md">
                  {selectedNotification.title}
                </h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="flex items-center gap-6 p-6 rounded-[28px] bg-gray-50/80 border border-gray-100">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Received on
                  </p>
                  <div className="flex items-center gap-2 text-gray-700 font-bold">
                    <Calendar size={16} className="text-teal-600" />
                    <span>
                      {format(
                        new Date(selectedNotification.createdAt),
                        "MMMM d, yyyy",
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Time
                  </p>
                  <div className="flex items-center gap-2 text-gray-700 font-bold">
                    <Clock size={16} className="text-teal-600" />
                    <span>
                      {format(
                        new Date(selectedNotification.createdAt),
                        "hh:mm aa",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-teal max-w-none">
                <p className="text-[15px] text-gray-600 leading-[1.8] font-medium whitespace-pre-line">
                  {selectedNotification.message}
                </p>
              </div>

              {(selectedNotification.type === "weight_update" ||
                selectedNotification.title?.toLowerCase().includes("weight") ||
                selectedNotification.metadata?.actionUrl) && (
                <div className="pt-8 mt-8 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (selectedNotification.metadata?.actionUrl) {
                        window.location.href =
                          selectedNotification.metadata.actionUrl;
                      }
                    }}
                    className="group flex items-center gap-3 bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 hover:shadow-teal-200"
                  >
                    {selectedNotification.metadata?.actionLabel || "Update Now"}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-[40px] border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Bell size={40} className="text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Select a message
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-[280px]">
              Choose a notification from the list to view its full content and
              actions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

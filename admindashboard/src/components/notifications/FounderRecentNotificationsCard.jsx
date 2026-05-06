import React from "react";
import {
  MoreHorizontal,
  Bell,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  formatNotificationTime,
  getDashboardNotificationStyle,
} from "@/utils/notification";

const getIcon = (iconType, className) => {
  if (iconType === "message")
    return <MessageSquare size={18} className={className} />;
  if (iconType === "refresh")
    return <RefreshCw size={18} className={className} />;
  if (iconType === "success")
    return <CheckCircle size={18} className={className} />;
  if (iconType === "alert")
    return <AlertCircle size={18} className={className} />;
  return <Bell size={18} className={className} />;
};

export default function FounderRecentNotificationsCard({
  notifications = [],
  loading = false,
  emptyLabel = "No notifications yet",
  className = "",
  title = "Recent Notifications",
}) {
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  return (
    <div
      className={`bg-white p-5 md:p-6 rounded-[24px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 border border-[#EEF2F6] flex flex-col flex-1 overflow-hidden min-h-[350px] md:min-h-[500px] group hover:border-[#E2E8F0] ${className}`}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-1 h-4 md:h-5 bg-[#DAA520] rounded-full group-hover:h-6 md:group-hover:h-8 group-hover:bg-[#0A4F48] transition-all duration-500 ease-out"></div>
          <h3 className="text-[15px] md:text-[17px] font-bold text-[#1E293B] tracking-tight">
            {title}
          </h3>
        </div>
        <button className="p-1.5 md:p-2 hover:bg-[#F8FAFC] rounded-full transition-colors">
          <MoreHorizontal
            size={20}
            className="text-[#94A3B8] group-hover:text-[#0A4F48] transition-colors"
          />
        </button>
      </div>

      <div className="flex flex-col gap-1 md:gap-2 overflow-y-auto pr-1 md:pr-2 no-scrollbar flex-1 -mr-1 md:-mr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-60">
            <div className="w-6 h-6 md:w-8 md:h-8 border-3 border-[#0A4F48] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs md:text-sm text-[#64748B] font-medium animate-pulse">
              Loading updates...
            </p>
          </div>
        ) : safeNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 md:gap-4 text-center py-6 md:py-10">
            <div className="bg-[#F8FAFC] p-4 md:p-6 rounded-full shadow-inner">
              <Bell size={24} className="text-[#CBD5E1] md:w-8 md:h-8" />
            </div>
            <p className="text-xs md:text-sm text-[#64748B] font-medium">
              {emptyLabel}
            </p>
          </div>
        ) : (
          safeNotifications.map((notification, index) => {
            const style = getDashboardNotificationStyle(notification.type);
            // Overriding bgClass for more color pop if needed, but sticking to style map for consistency
            return (
              <div
                key={notification._id || index}
                className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-[#F8FAFC] transition-all duration-200 group/item cursor-pointer border border-transparent hover:border-[#F1F5F9] relative"
              >
                <div
                  className={`${style.bgClass} p-2 md:p-3 h-fit rounded-lg shrink-0 shadow-sm group-hover/item:scale-105 transition-transform duration-300`}
                >
                  {getIcon(style.icon, style.iconClass)}
                </div>
                <div className="flex flex-col gap-0.5 md:gap-1 flex-1 relative">
                  <p className="text-[12px] md:text-[13px] font-semibold text-[#1E293B] leading-snug group-hover/item:text-[#0A4F48] transition-colors line-clamp-2 pr-4 md:pr-6">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#DAA520]/80"></span>
                    <span className="text-[10px] md:text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                  </div>
                  <div className="absolute right-0 top-1 md:top-2 opacity-0 group-hover/item:opacity-100 transition-all duration-300 translate-x-2 group-hover/item:translate-x-0">
                    <CheckCircle
                      size={12}
                      className="text-[#0A4F48] md:w-3.5 md:h-3.5"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

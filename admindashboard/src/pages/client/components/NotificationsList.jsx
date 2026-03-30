import React from "react";
import { MoreHorizontal, Bell } from "lucide-react";
import useRecentNotifications from "@/hooks/useRecentNotifications";
import {
  formatNotificationTime,
  getClientNotificationBubbleClass,
} from "@/utils/notification";

export default function NotificationsList() {
  const { notifications, loading } = useRecentNotifications(4);

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-6 group transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-gray-400 font-black text-[15px] uppercase tracking-widest leading-none">
          Recent Activities
        </h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-100 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-2 bg-gray-50 rounded w-1/4" />
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
             <Bell size={24} className="text-gray-200 mb-2" />
             <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">No activities</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const bgClass = getClientNotificationBubbleClass(notification.type);
            const isDarkBubble = bgClass === "bg-[#0A4F48]";

            return (
              <div key={notification._id} className="flex gap-4 items-start group/item cursor-pointer">
                <div
                  className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm transition-transform group-hover/item:scale-110 ${bgClass}`}
                >
                  <Bell 
                    size={16} 
                    className={isDarkBubble ? "text-white fill-current" : "text-[#0A4F48] opacity-60"} 
                  />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[13px] font-black text-gray-800 leading-tight tracking-tight">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-widest">
                    {formatNotificationTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

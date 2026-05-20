import React from "react";
import { Bell } from "lucide-react";
import useRecentNotifications from "@/hooks/useRecentNotifications";
import { formatNotificationTime } from "@/utils/notification";

export default function NotificationsList() {
  const { notifications, loading } = useRecentNotifications(4);
  const fallbackNotifications = [
    {
      _id: "fallback-1",
      message: "Notificalications reoonded",
      time: "3 hours ago",
    },
    {
      _id: "fallback-2",
      message: "Notificalications insreaded",
      time: "2 weeks ago",
    },
  ];

  const notificationsToRender = notifications.length ? notifications : fallbackNotifications;

  return (
    <section className="mt-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="client-title text-[14px]">Recent Notifications</h3>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="h-9 w-9 shrink-0 rounded-full bg-[#eef4ef]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-[#edf3ed]" />
                  <div className="h-2 w-1/4 rounded bg-[#f4f8f4]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          notificationsToRender.map((notification) => (
            <div key={notification._id} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(10,79,72,0.12)] bg-white text-[#0A4F48] shadow-[0_3px_10px_rgba(38,58,45,0.09)]">
                <Bell size={14} fill="#0A4F48" fillOpacity={0.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="client-title text-[12px] leading-tight whitespace-normal break-words">
                  {notification.message}
                </p>
                <p className="client-subtitle mt-0.5 text-[10.5px] whitespace-normal break-words">
                  {notification.time || formatNotificationTime(notification.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

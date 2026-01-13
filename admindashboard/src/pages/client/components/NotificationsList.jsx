import React from "react";
import { assets } from "@/assets/asset";

export default function NotificationsList() {
  const notifications = [
    {
      text: "Breakfast marked as approved by Dietitian",
      time: "Today, 11:20 AM",
      bg: "bg-[#0A4F48]",
      icon: assets.bellVector,
    },
    {
      text: "You skipped lunch today",
      time: "Today, 10:00 AM",
      bg: "bg-[#FBEAD9]",
      icon: assets.bellVector,
    },
    {
      text: "Dietitian left feedback on your dinner",
      time: "Yesterday, 6:05 PM",
      bg: "bg-[#0A4F48]",
      icon: assets.bellVector,
    },
    {
      text: "Your trainer has been updated",
      time: "2 Days Ago, 2:30 PM",
      bg: "bg-[#FBEAD9]",
      icon: assets.bellVector,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#0A4F48] font-bold text-sm uppercase tracking-wider">
          Recent Notifications
        </h3>
        <img
          src={assets.threeDotVector}
          alt="more"
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="space-y-6">
        {notifications.map((notif, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div
              className={`w-9 h-9 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${notif.bg}`}
            >
              <img
                src={notif.icon}
                alt="notification"
                className={`w-4 h-4 ${
                  notif.bg === "bg-[#0A4F48]"
                    ? "invert brightness-0"
                    : "opacity-60"
                }`}
              />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-gray-800 leading-[1.3]">
                {notif.text}
              </p>
              <p className="text-[11px] text-gray-400 font-bold mt-1.5 leading-none">
                {notif.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

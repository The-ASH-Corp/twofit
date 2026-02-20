import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Bell } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

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
      const res = await axiosInstance.get(`/notifications?page=${page}&limit=10`);
      // Adapt to backend response structure
      // The backend returns { success: true, data: { notifications: [], pagination: {} } }
      // OR { success: true, data: [] } for recent
      // I implemented getAllNotifications to return { notifications, pagination } in data.
      
      const responseData = res.data?.data || {};
      
      if (responseData.notifications) {
          setNotifications(responseData.notifications);
          setPagination(responseData.pagination || { page, limit: 10, total: 0, totalPages: 1 });
          
          if (responseData.notifications.length > 0 && !selectedNotification) {
             setSelectedNotification(responseData.notifications[0]);
          }
      } else {
        // Fallback or empty
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
    // Mark as read if not already? Backend logic for markRead is separate.
    if (!notification.isRead) {
        // Optimistically update UI
        setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
        axiosInstance.patch(`/notifications/${notification._id}/read`).catch(console.error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#F8F9FA] gap-6 p-6">
      {/* Left List Panel */}
      <div className="w-1/2 bg-white rounded-2xl shadow-sm p-6 flex flex-col h-full">
        <h2 className="text-[#0A4F48] text-xl font-bold mb-6">Notifications</h2>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {loading ? (
             <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : notifications.length === 0 ? (
             <div className="text-center py-10 text-gray-400">No notifications found</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-xl cursor-pointer border transition-all hover:bg-gray-50 ${
                  selectedNotification?._id === notification._id
                    ? "border-[#0A4F48] bg-[#F0F7F6]"
                    : "border-transparent border-b-gray-100"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#011412] text-sm">
                        {notification.title}
                        </h3>
                        <span className="bg-[#FFF4E5] text-[#B56D07] text-[10px] px-2 py-0.5 rounded-md font-medium">
                        {notification.type || "notification"}
                        </span>
                     </div>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1"></div>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                  {notification.message}
                </p>
                <span className="text-[10px] text-gray-400 block">
                  {format(new Date(notification.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>
            Show {pagination.limit} of {pagination.total} results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="bg-[#0A4F48] text-white px-2.5 py-1 rounded">
              {pagination.page}
            </span>
            {pagination.totalPages > 1 && pagination.page < pagination.totalPages && (
                <span className="text-gray-400">...</span>
            )}
             {/* Simple logic for now, enhance if needed */}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Detail Panel */}
      <div className="w-1/2 flex flex-col">
        {selectedNotification ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 h-fit min-h-[500px]">
             {/* Header: Tag and Date */}
            <div className="flex justify-between items-center mb-6">
              <span className="bg-[#FFF4E5] text-[#B56D07] text-xs px-3 py-1 rounded-md font-medium">
                {selectedNotification.type || "notification"}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {format(new Date(selectedNotification.createdAt), "MMM d, yyyy")}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-[#011412] mb-4">
              {selectedNotification.title}
            </h1>

             {/* Message Body */}
            <p className="text-sm text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
              {selectedNotification.message}
            </p>

             {/* Action Button */}
            {(selectedNotification.type === "weight_update" || 
              selectedNotification.title.toLowerCase().includes("weight") ||
              selectedNotification.metadata?.actionUrl) && (
              <button 
                onClick={() => {
                    if (selectedNotification.metadata?.actionUrl) {
                        window.location.href = selectedNotification.metadata.actionUrl;
                    }
                }}
                className="bg-[#0A4F48] text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-[#083d38] transition-colors shadow-sm"
              >
                {selectedNotification.metadata?.actionLabel || "Update Weight"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a notification to view details
          </div>
        )}
      </div>
    </div>
  );
}

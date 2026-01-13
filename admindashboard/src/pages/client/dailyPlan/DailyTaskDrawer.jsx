import React from "react";
import { X } from "lucide-react";

export default function DailyTaskDrawer({ selectedDate, tasks, onClose }) {
  if (!selectedDate) return null;

  const statusColors = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    skipped: "bg-yellow-50 text-yellow-700 border-yellow-200",
    missed: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-gray-50 text-gray-700 border-gray-200",
    "in review": "bg-purple-50 text-purple-700 border-purple-200",
    improve: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[320px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-[16px] text-gray-800">
            {formatDate(selectedDate)}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-[15px] font-medium text-gray-800">
                  {task.name}
                </span>
                <span
                  className={`text-[12px] font-semibold px-3 py-1 rounded-full border ${
                    statusColors[task.status.toLowerCase()] ||
                    statusColors.pending
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-[14px]">No tasks for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DailyTaskDrawer from "./DailyTaskDrawer";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyPlan() {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth()); // Current month (0-based)
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const calendarData = {
    // January 2026 data with detailed tasks
    "2026-01-02": {
      summary: [
        { type: "skipped", count: 2 },
        { type: "missed", count: 1 },
      ],
      tasks: [
        { name: "Breakfast", status: "Completed" },
        { name: "Lunch", status: "Skipped" },
        { name: "Snack", status: "Missed" },
        { name: "Dinner", status: "Pending" },
        { name: "Workout", status: "Skipped" },
        { name: "Therapy", status: "In Review" },
      ],
    },
    "2026-01-05": {
      summary: [{ type: "skipped", count: 3 }],
      tasks: [
        { name: "Breakfast", status: "Completed" },
        { name: "Lunch", status: "Skipped" },
        { name: "Snack", status: "Skipped" },
        { name: "Dinner", status: "Completed" },
        { name: "Workout", status: "Skipped" },
        { name: "Therapy", status: "Improve" },
      ],
    },
    "2026-01-07": {
      summary: [{ type: "missed", count: 2 }],
      tasks: [
        { name: "Breakfast", status: "Completed" },
        { name: "Lunch", status: "Missed" },
        { name: "Snack", status: "Completed" },
        { name: "Dinner", status: "Missed" },
        { name: "Workout", status: "In Review" },
        { name: "Therapy", status: "Completed" },
      ],
    },
    "2026-01-09": {
      summary: [
        { type: "skipped", count: 1 },
        { type: "missed", count: 1 },
      ],
      tasks: [
        { name: "Breakfast", status: "Completed" },
        { name: "Lunch", status: "Skipped" },
        { name: "Snack", status: "Missed" },
        { name: "Dinner", status: "Pending" },
        { name: "Workout", status: "Completed" },
        { name: "Therapy", status: "Improve" },
      ],
    },
  };

  const today = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  // Build calendar grid including previous month's trailing days
  const dates = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({ day: i, isCurrentMonth: true });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const filterTasks = (summary) => {
    if (selectedStatus === "All Status") return summary;
    return summary?.filter(
      (task) => task.type.toLowerCase() === selectedStatus.toLowerCase()
    );
  };

  const handleDateClick = (fullDate) => {
    if (fullDate && calendarData[fullDate]) {
      setSelectedDate(fullDate);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-bold text-[20px] text-[#0A4F48]">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <div className="flex gap-4 items-center">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-[13px] font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20"
            >
              <option>All Status</option>
              <option>Skipped</option>
              <option>Missed</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-4">
        {days.map((d) => (
          <div
            key={d}
            className="text-center text-[13px] font-medium text-gray-500 py-3"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-gray-200">
        {dates.map((dateObj, index) => {
          const { day, isCurrentMonth } = dateObj;
          const fullDate = isCurrentMonth
            ? `${currentYear}-${String(currentMonth + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`
            : null;

          const tasksForDay = fullDate ? calendarData[fullDate] : null;
          const filteredTasks = tasksForDay?.summary
            ? filterTasks(tasksForDay.summary)
            : null;

          return (
            <div
              key={index}
              onClick={() => handleDateClick(fullDate)}
              className={`min-h-[120px] border-r border-b border-gray-200 p-3 relative cursor-pointer hover:bg-gray-50/50 transition-colors ${
                !isCurrentMonth ? "bg-gray-50/30" : ""
              }`}
            >
              {isCurrentMonth && (
                <>
                  <span
                    className={`text-[13px] font-medium ${
                      !isCurrentMonth ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>

                  {/* TODAY Badge */}
                  {fullDate === today && (
                    <div className="absolute bottom-3 left-3 right-3 bg-[#0A4F48] text-white text-[11px] font-bold py-1.5 rounded-lg text-center">
                      Today
                    </div>
                  )}

                  {/* TASKS */}
                  <div className="mt-2 space-y-1.5">
                    {filteredTasks?.map((task, i) => (
                      <div
                        key={i}
                        className={`text-[11px] font-medium px-2 py-1 rounded border ${
                          task.type === "skipped"
                            ? "bg-[#FFFBF0] border-[#FFE4A3] text-[#B8860B]"
                            : "bg-[#FFF5F5] border-[#FFC9C9] text-[#C53030]"
                        }`}
                      >
                        {task.count} Task -{" "}
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <DailyTaskDrawer
        selectedDate={selectedDate}
        tasks={selectedDate ? calendarData[selectedDate]?.tasks : null}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}

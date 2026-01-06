import React from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyPlan() {

  const calendarData = {
  "2025-01-01": [
    { type: "skipped", count: 2 },
    { type: "missed", count: 1 },
  ],
  "2025-01-02": [
    { type: "skipped", count: 4 },
    { type: "missed", count: 2 },
  ],
  "2025-01-03": [{ type: "skipped", count: 6 }],
  "2025-01-04": [{ type: "missed", count: 6 }],
};

  const year = 2026;
  const month = 0; // January (0-based)
  const today = "2025-01-05";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">January 2026</h2>

        <div className="flex gap-3 items-center">
          <select className="border rounded px-3 py-1 text-sm">
            <option>All Status</option>
            <option>Skipped</option>
            <option>Missed</option>
          </select>
          <button>{"<"}</button>
          <button>{">"}</button>
        </div>
      </div>

      {/* DAYS HEADER */}
      <div className="grid grid-cols-7 text-sm text-gray-500 mb-2">
        {days.map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 border rounded overflow-hidden">
        {dates.map((date, index) => {
          const fullDate = date
            ? `2025-01-${String(date).padStart(2, "0")}`
            : null;

          return (
            <div
              key={index}
              className="h-32 border p-2 text-sm relative"
            >
              {date && (
                <>
                  <span className="text-gray-600">{date}</span>

                  {/* TODAY */}
                  {fullDate === today && (
                    <div className="absolute bottom-2 left-2 right-2 bg-green-900 text-white text-xs py-1 rounded">
                      Today
                    </div>
                  )}

                  {/* TASKS */}
                  <div className="mt-2 space-y-1">
                    {calendarData[fullDate]?.map((task, i) => (
                      <div
                        key={i}
                        className={`text-xs px-2 py-1 rounded border
                          ${
                            task.type === "skipped"
                              ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                              : "bg-red-50 border-red-400 text-red-800"
                          }`}
                      >
                        {task.count} Task - {task.type}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

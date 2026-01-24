import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DailyTaskDrawer from "./DailyTaskDrawer";
import MobileBottomNav from "../components/MobileBottomNav";
import { useDispatch } from "react-redux";
import { getUserTaskStatus } from "@/redux/features/tasks/task.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getProgramById } from "@/redux/features/program/program.thunk";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyPlan() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth()); // Current month (0-based)
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [program, setProgram] = useState(null);
  const [calendarData, setCalendarData] = useState({});

  // Fetch program and tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.programType) {
          const programId =
            typeof user.programType === "object"
              ? user.programType._id
              : user.programType;
          const programData = await dispatch(
            getProgramById(programId),
          ).unwrap();
          setProgram(programData);
        }
        await dispatch(getUserTaskStatus()).unwrap();
      } catch (error) {
        console.error("Error fetching daily plan data:", error);
      }
    };

    if (user?._id) {
      fetchData();
    }
  }, [dispatch, user?._id, user?.programType]);

  // Calculate calendar data based on tasks and program
  useEffect(() => {
    if (!program || !tasks) return;

    const newCalendarData = {};
    const programStartDate = user?.programStartDate
      ? new Date(user.programStartDate)
      : new Date();

    // Get all days from the program
    const days =
      program?.plan?.weeks?.flatMap((week, weekIndex) =>
        week.days.map((day, dayIndex) => ({
          ...day,
          weekIndex: weekIndex + 1,
          dayIndex: dayIndex + 1,
          globalIndex: weekIndex * 7 + dayIndex + 1,
        })),
      ) || [];

    // Process each day
    days.forEach((day) => {
      const dayDate = new Date(programStartDate);
      dayDate.setDate(programStartDate.getDate() + (day.globalIndex - 1));
      const dateKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`;

      // Get tasks for this day
      const dayTasks = tasks.filter(
        (t) => t.globalDayIndex === day.globalIndex,
      );

      // Calculate expected task count
      const workoutCount = day.exercises?.length || 0;
      const mealCount = 4; // Always 4 meals
      const totalExpected = workoutCount + mealCount;

      // Check if day has passed (missed) or is today/future (skipped = not done yet)
      const isBeforeToday = dayDate < new Date(new Date().setHours(0, 0, 0, 0));

      // Build task list with status
      const taskList = [];

      // Add workout tasks
      day.exercises?.forEach((ex, idx) => {
        const submission = dayTasks.find(
          (t) => t.exerciseIndex === idx && t.taskType === "Workout",
        );
        let status = submission ? submission.status : "todo";
        if (status === "todo" && isBeforeToday) {
          status = "missed";
        }

        taskList.push({
          name: ex.name || `Exercise ${idx + 1}`,
          status: status,
          type: "Workout",
          // Metadata for skipping/verifying
          globalDayIndex: day.globalIndex,
          weekIndex: day.weekIndex,
          dayIndex: day.dayIndex,
          exerciseIndex: idx,
          programId: program._id,
        });
      });

      // Add meal tasks
      for (let i = 0; i < 4; i++) {
        const submission = dayTasks.find(
          (t) => t.exerciseIndex === 100 + i && t.taskType === "Meal",
        );
        let status = submission ? submission.status : "todo";
        if (status === "todo" && isBeforeToday) {
          status = "missed";
        }

        taskList.push({
          name: `Meal ${i + 1}`,
          status: status,
          type: "Meal",
          // Metadata
          globalDayIndex: day.globalIndex,
          weekIndex: day.weekIndex,
          dayIndex: day.dayIndex,
          exerciseIndex: 100 + i,
          programId: program._id,
        });
      }

      // Calculate summary
      const verified = taskList.filter((t) => t.status === "verified").length;
      const pending = taskList.filter((t) => t.status === "pending").length;
      const rejected = taskList.filter((t) => t.status === "rejected").length;
      const skipped = taskList.filter((t) => t.status === "skipped").length;
      const missed = taskList.filter((t) => t.status === "missed").length;
      const todo = taskList.filter((t) => t.status === "todo").length;

      // Determine if tasks were skipped or missed
      const summary = [];

      if (rejected > 0) summary.push({ type: "rejected", count: rejected });
      if (pending > 0) summary.push({ type: "pending", count: pending });
      if (skipped > 0) summary.push({ type: "skipped", count: skipped });
      if (missed > 0) summary.push({ type: "missed", count: missed });
      if (todo > 0) summary.push({ type: "todo", count: todo }); // Optional: explicit todo summary if needed, but usually we just want exceptions.
 

      newCalendarData[dateKey] = {
        summary,
        tasks: taskList,
        verified,
        pending,
        rejected,
        skipped,
        missed,
        todo,
        totalExpected,
      };
    });

    setCalendarData(newCalendarData);
  }, [program, tasks, user?.programStartDate]);

  const handleSkipTask = async (task) => {
    if (task.type !== "Meal") return;

    // Optimistic update locally could be done here, but let's rely on re-fetch or socket for now.
    // Or dispatch returns the new submission.

    const formData = new FormData();
    formData.append("programId", task.programId);
    formData.append("weekIndex", task.weekIndex);
    formData.append("dayIndex", task.dayIndex);
    formData.append("globalDayIndex", task.globalDayIndex);
    formData.append("exerciseIndex", task.exerciseIndex);
    formData.append("taskType", "Meal");
    formData.append("status", "skipped");
    formData.append("notes", "Skipped by user");

    try {
      await dispatch(uploadTask(formData)).unwrap();
      // Refresh tasks
      await dispatch(getUserTaskStatus());
    } catch (error) {
      console.error("Failed to skip task:", error);
      alert("Failed to skip task: " + error);
    }
  };

  const today = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1,
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
      (task) => task.type.toLowerCase() === selectedStatus.toLowerCase(),
    );
  };

  const handleDateClick = (fullDate) => {
    if (fullDate) {
      setSelectedDate(fullDate);
    }
  };

  return (
    <div className="bg-white lg:rounded-2xl lg:p-8 p-4 lg:shadow-sm">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 lg:gap-0 mb-6 lg:mb-8">
        <h2 className="font-bold text-[18px] lg:text-[20px] text-[#0A4F48]">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <div className="flex gap-3 lg:gap-4 items-center">
          <div className="relative flex-1 lg:flex-initial">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 lg:px-4 py-2 pr-10 text-[12px] lg:text-[13px] font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20"
            >
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Rejected</option>
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

      <div className="grid grid-cols-7 mb-3 lg:mb-4">
        {days.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] lg:text-[13px] font-medium text-gray-500 py-2 lg:py-3"
          >
            <span className="hidden lg:inline">{d}</span>
            <span className="lg:hidden">{d.charAt(0)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-gray-200">
        {dates.map((dateObj, index) => {
          const { day, isCurrentMonth } = dateObj;
          const fullDate = isCurrentMonth
            ? `${currentYear}-${String(currentMonth + 1).padStart(
                2,
                "0",
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
              className={`min-h-[80px] lg:min-h-[120px] border-r border-b border-gray-200 p-2 lg:p-3 relative cursor-pointer hover:bg-gray-50/50 transition-colors ${
                !isCurrentMonth ? "bg-gray-50/30" : ""
              }`}
            >
              {isCurrentMonth && (
                <>
                  <span
                    className={`text-[11px] lg:text-[13px] font-medium ${
                      !isCurrentMonth ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>

                  {/* TODAY Badge */}
                  {fullDate === today && (
                    <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 right-2 lg:right-3 bg-[#0A4F48] text-white text-[9px] lg:text-[11px] font-bold py-1 lg:py-1.5 rounded-lg text-center">
                      Today
                    </div>
                  )}

                  {/* TASKS */}
                  <div className="mt-1.5 lg:mt-2 space-y-1">
                    {filteredTasks?.map((task, i) => {
                      let badgeClasses = "";
                      if (task.type === "verified") {
                        badgeClasses =
                          "bg-green-50 border-green-200 text-green-700";
                      } else if (task.type === "pending") {
                        badgeClasses =
                          "bg-yellow-50 border-yellow-200 text-yellow-700";
                      } else if (task.type === "rejected") {
                        badgeClasses = "bg-red-50 border-red-200 text-red-700";
                      } else if (task.type === "missed") {
                        badgeClasses =
                          "bg-gray-100 border-gray-300 text-gray-700";
                      } else if (task.type === "skipped") {
                        badgeClasses =
                          "bg-orange-50 border-orange-200 text-orange-700";
                      }

                      return (
                        <div
                          key={i}
                          className={`text-[9px] lg:text-[11px] font-medium px-1.5 lg:px-2 py-0.5 lg:py-1 rounded border truncate ${badgeClasses}`}
                        >
                          <span className="hidden lg:inline">
                            {task.count} Task -{" "}
                            {task.type.charAt(0).toUpperCase() +
                              task.type.slice(1)}
                          </span>
                          <span className="lg:hidden">
                            {task.type.charAt(0).toUpperCase() +
                              task.type.slice(1).substring(0, 5)}
                            ...
                          </span>
                        </div>
                      );
                    })}
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
        onSkip={handleSkipTask}
      />
      <MobileBottomNav />
    </div>
  );
}

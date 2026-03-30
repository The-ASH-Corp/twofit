import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, Plus } from "lucide-react";
import DailyTaskDrawer from "./DailyTaskDrawer";
import MobileBottomNav from "../components/MobileBottomNav";
import { useDispatch } from "react-redux";
import {
  getUserTaskStatus,
  uploadTask,
} from "@/redux/features/tasks/task.thunk";
import { getPendingExtension } from "@/redux/features/plans/plan.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getProgramById } from "@/redux/features/program/program.thunk";
import {
  fetchClientComplianceStats,
  getClient,
} from "@/redux/features/client/client.thunk";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import { assets } from "@/assets/asset";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function DailyPlan() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth()); // Current month (0-based)
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [program, setProgram] = useState(null);
  const [therapyPlan, setTherapyPlan] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pendingExtension, setPendingExtension] = useState(null);
  const [compliance, setCompliance] = useState(0);
  const [streak, setStreak] = useState(0);

  // Fetch program, therapy plan and tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getClient({ id: user?._id }));

        if (user?.programType) {
          const programId =
            typeof user.programType === "object"
              ? user.programType?._id
              : user.programType;
          const programData = await dispatch(
            getProgramById(programId),
          ).unwrap();
          setProgram(programData.data);
        }

        await dispatch(getUserTaskStatus()).unwrap();
        
        // Fetch pending extension
        const extensionData = await dispatch(getPendingExtension(user?._id)).unwrap();
        if (extensionData) {
          setPendingExtension(extensionData);
        }

        // Fetch compliance and streaks
        const complianceRes = await dispatch(fetchClientComplianceStats(user?._id)).unwrap();
        if (complianceRes) {
          setCompliance(complianceRes.overall || 0);
          setStreak(complianceRes.streaks?.activeStreak || 0);
        }
      } catch (error) {
        console.error("Error fetching daily plan data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchData();
    }
  }, [dispatch, user?._id, user?.programType]);

  // Set therapy plan when clientUser is populated
  useEffect(() => {
    if (clientUser?.therapyType && typeof clientUser.therapyType === "object") {
      if (clientUser.therapyType.weeks) {
        setTherapyPlan(clientUser.therapyType);
      }
    }
  }, [clientUser]);

  const isProgramStarted = React.useMemo(() => {
    const startDate = clientUser?.programStartDate || user?.programStartDate;
    if (!startDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    return today >= start;
  }, [user?.programStartDate, clientUser?.programStartDate]);

  // Calculate calendar data based on tasks and program
  useEffect(() => {
    if (!program || !tasks) return;

    const newCalendarData = {};
    const programStartDateStr =
      clientUser?.programStartDate || user?.programStartDate;

    if (!programStartDateStr) return; // Don't generate calendar if no start date

    // Normalize start date to midnight
    let iteratorDate = new Date(programStartDateStr);
    iteratorDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getDateKey = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;

    // Flatten and sort program days
    const sortedDays =
      program?.plan?.weeks
        ?.flatMap((week, weekIndex) =>
          week.days.map((day, dayIndex) => ({
            ...day,
            weekIndex: weekIndex + 1,
            dayIndex: dayIndex + 1,
            globalIndex: weekIndex * 7 + dayIndex + 1,
          })),
        )
        .sort((a, b) => a.globalIndex - b.globalIndex) || [];

    // Flatten therapy days if available
    const sortedTherapyDays =
      therapyPlan?.weeks?.flatMap((week, weekIndex) =>
        week.days.map((day, dayIndex) => ({
          ...day,
          weekIndex: weekIndex + 1,
          dayIndex: dayIndex + 1,
          globalIndex: weekIndex * 7 + dayIndex + 1,
        })),
      ) || [];

    let programIndex = 0;
    const MAX_DAYS = 1000;
    let loopCount = 0;

    // Iterate through calendar days mapping program days to them
    while (programIndex < sortedDays.length && loopCount < MAX_DAYS) {
      loopCount++;
      const currentPDay = sortedDays[programIndex];
      const currentTherapyDay = sortedTherapyDays.find(
        (d) => d.globalIndex === currentPDay.globalIndex,
      );

      const dateKey = getDateKey(iteratorDate);
      const isBeforeToday = iteratorDate < today;

      // Get all submissions for this specific program day
      const dayTasks = tasks.filter(
        (t) => t.globalDayIndex === currentPDay.globalIndex,
      );

      // Check if user has ANY activity for this Program Day on this Calendar Date
      const hasActivityOnDate = dayTasks.some((t) => {
        if (t.status === "todo") return false;
        const tDate = new Date(t.updatedAt);
        tDate.setHours(0, 0, 0, 0);
        return tDate.getTime() === iteratorDate.getTime();
      });

      let mapDayToDate = false;

      if (isBeforeToday) {
        // In the past, we only map the program day if the user actually did it then.
        if (hasActivityOnDate) {
          mapDayToDate = true;
        } else {
          mapDayToDate = false;
        }
      } else {
        mapDayToDate = true;
      }

      if (mapDayToDate) {
        // Build the task list for this day
        const taskList = [];
        const isWeightLoss = program?.title
          ?.toLowerCase()
          .includes("weight loss");
        const defaultMealCount = isWeightLoss ? 5 : 6;
        const mealCount =
          clientUser?.dietPlanMealCount ||
          user?.dietPlanMealCount ||
          defaultMealCount;

        const workoutCount = currentPDay.exercises?.length || 0;
        const therapyCount = currentTherapyDay?.therapies?.length || 0;
        const totalExpected = workoutCount + mealCount + therapyCount;

        // Helper to process individual task items
        const processItem = (idx, type, name, meta = {}) => {
          const submission = dayTasks.find(
            (t) => t.exerciseIndex === idx && t.taskType === type,
          );

          let status = submission ? submission.status : "todo";

          taskList.push({
            name: name,
            status: status,
            type: type,
            globalDayIndex: currentPDay.globalIndex,
            weekIndex: currentPDay.weekIndex,
            dayIndex: currentPDay.dayIndex,
            exerciseIndex: idx,
            programId: program?._id,
            ...meta,
          });
        };

        currentPDay.exercises?.forEach((ex, idx) => {
          processItem(idx, "Workout", ex.name || `Exercise ${idx + 1}`);
        });

        for (let i = 0; i < mealCount; i++) {
          processItem(100 + i, "Meal", `Meal ${i + 1}`);
        }

        // Process Therapy Tasks
        if (currentTherapyDay && currentTherapyDay.therapies) {
          currentTherapyDay.therapies.forEach((therapy, idx) => {
            processItem(idx, "Therapy", therapy.type || "Therapy Task", {
              notes: therapy.notes,
              mediaUrl: therapy.url,
            });
          });
        }

        // Calculate stats
        const verified = taskList.filter((t) => t.status === "verified").length;
        const pending = taskList.filter((t) => t.status === "pending").length;
        const rejected = taskList.filter((t) => t.status === "rejected").length;
        const skipped = taskList.filter((t) => t.status === "skipped").length;
        const missed = taskList.filter((t) => t.status === "missed").length;
        const todo = taskList.filter((t) => t.status === "todo").length;

        const summary = [];
        if (rejected > 0) summary.push({ type: "rejected", count: rejected });
        if (pending > 0) summary.push({ type: "pending", count: pending });
        if (skipped > 0) summary.push({ type: "skipped", count: skipped });
        if (missed > 0) summary.push({ type: "missed", count: missed });
        if (todo > 0) summary.push({ type: "todo", count: todo });
        if (verified > 0) summary.push({ type: "verified", count: verified });

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
          allMissed: false,
        };
        // Advance to next Program Day
        programIndex++;
      } else {
        // This calendar date was missed/skipped
        newCalendarData[dateKey] = {
          summary: [{ type: "not_logged_in", count: 1 }],
          tasks: [],
          verified: 0,
          pending: 0,
          rejected: 0,
          skipped: 0,
          missed: 0,
          todo: 0,
          totalExpected: 0,
          allMissed: true,
        };
        // Do NOT advance programIndex (try again next date)
      }

      // Always advance calendar date
      iteratorDate.setDate(iteratorDate.getDate() + 1);
    }

    setCalendarData(newCalendarData);
  }, [
    program,
    therapyPlan,
    tasks,
    user?.programStartDate,
    clientUser?.programStartDate,
  ]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );
  }

  if (!isProgramStarted) {
    const startDate = clientUser?.programStartDate || user?.programStartDate;
    return (
      <>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white sticky top-0 z-10 border-b border-gray-100">
          <h1 className="text-[18px] font-bold text-[#181E27]">Daily Plan</h1>
        </div>

        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
          <div className="bg-[#E6EEED] p-4 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-[#0A4F48] opacity-50" />
          </div>
          <h2 className="text-xl font-bold text-[#0A4F48] mb-2">
            Program Hasn't Started Yet
          </h2>
          <p className="text-gray-500 max-w-md">
            Your program is scheduled to start on{" "}
            <b>
              {new Date(startDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </b>
            . Your daily plan will be available then.
          </p>
        </div>
        <MobileBottomNav />
      </>
    );
  }

  const handleSkipTask = async (task) => {
    if (task.type !== "Meal") return;

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
      toast.error("Failed to skip task: " + error);
    }
  };

  const today = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  const firstDayOriginal = new Date(currentYear, currentMonth, 1).getDay();
  // Shift Sunday (0) to 6, and Monday (1) to 0, to make grid start on Monday natively
  const firstDayMonday = firstDayOriginal === 0 ? 6 : firstDayOriginal - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Build calendar grid handling empty spaces
  const dates = [];
  for (let i = 0; i < firstDayMonday; i++) {
    dates.push({ day: null, isCurrentMonth: false });
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
    <div className="bg-[#F8FAFA] lg:p-8 p-4 min-h-screen relative pb-32">
      {/* Extension Info Banner */}
      {pendingExtension && !pendingExtension.isActivated && (
        <div className="mb-6 lg:mb-8 p-4 lg:p-6 bg-linear-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl max-w-7xl mx-auto">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-purple-900 mb-1">Program Extension Coming!</h3>
              <p className="text-sm text-purple-800 mb-2">
                Your current program ends on <strong>{new Date(pendingExtension.originalProgramEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              </p>
              <p className="text-sm text-purple-800">
                <strong>{pendingExtension.extensionDuration} days</strong> extension starts on <strong>{new Date(pendingExtension.extendedProgramStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Desktop & Mobile Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
          <div className="flex items-center gap-6">
            <h2 className="font-black text-[20px] lg:text-[24px] text-gray-800 leading-none">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
              <button
                onClick={handlePrevMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="px-5 text-[13px] font-bold text-[#0A4F48]">Today</span>
              <button
                onClick={handleNextMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-center justify-between lg:justify-end">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-gray-400 hidden lg:block">Filter:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-transparent lg:text-[#0A4F48] text-gray-700 font-bold text-[13px] cursor-pointer focus:outline-none pr-6"
              >
                <option>All Statuses</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Rejected</option>
                <option>Skipped</option>
              </select>
            </div>

         
            {/* Mobile Month Nav */}
            <div className="flex lg:hidden gap-1 bg-white rounded-full p-1 border border-gray-100 shadow-sm">
              <button
                onClick={handlePrevMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleNextMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-4 px-2">
          {days.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] font-black tracking-widest text-[#0A4F48] lg:text-gray-800"
            >
              <span className="hidden lg:inline">{d}</span>
              <span className="lg:hidden">{d.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid - Modern Rounded Tiles */}
        <div className="grid grid-cols-7 gap-1 lg:gap-3 mb-10">
          {dates.map((dateObj, index) => {
            const { day, isCurrentMonth } = dateObj;
            const fullDate = isCurrentMonth && day
              ? `${currentYear}-${String(currentMonth + 1).padStart(
                  2,
                  "0",
                )}-${String(day).padStart(2, "0")}`
              : null;

            const tasksForDay = fullDate ? calendarData[fullDate] : null;
            const filteredTasks = tasksForDay?.summary
              ? filterTasks(tasksForDay.summary)
              : null;

            const isToday = fullDate === today;

            if (!isCurrentMonth) {
              return <div key={index} className="lg:min-h-[100px] bg-transparent rounded-[20px]" />;
            }

            return (
              <div
                key={index}
                onClick={() => handleDateClick(fullDate)}
                className={`min-h-[80px] lg:min-h-[120px] p-2 lg:p-3 rounded-[12px] lg:rounded-[24px] cursor-pointer transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col relative
                  ${isToday ? "bg-white border-2 border-[#0A4F48] shadow-md" : "bg-white border border-gray-50"}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[14px] lg:text-[15px] font-black ${isToday ? "text-[#0A4F48]" : "text-gray-800"}`}>
                    {day}
                  </span>
                  
                  {isToday && (
                    <div className="bg-[#0A4F48] text-white text-[8px] lg:text-[9px] uppercase font-black tracking-widest py-0.5 lg:py-1 px-1.5 lg:px-2 rounded-full leading-none">
                      {fullDate}
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-1.5 lg:space-y-2 w-full">
                  {filteredTasks?.map((task, i) => {
                    let pillStyle = "";
                    let dotColor = "";

                    if (task.type === "verified") {
                      pillStyle = "bg-[#E6FFFA] text-[#0A4F48]";
                      dotColor = "bg-[#0A4F48]";
                    } else if (task.type === "todo") {
                      pillStyle = "bg-[#0A4F48] text-white";
                      dotColor = "bg-[#E6FFFA]";
                    } else if (task.type === "skipped" || task.type === "not_logged_in") {
                      pillStyle = "bg-rose-50 text-rose-500";
                      dotColor = "bg-rose-500";
                    } else if (task.type === "pending") {
                      pillStyle = "bg-yellow-50 text-yellow-700";
                      dotColor = "bg-yellow-500";
                    } else if (task.type === "rejected" || task.type === "missed") {
                      pillStyle = "bg-gray-100 text-gray-500";
                      dotColor = "bg-gray-400";
                    }

                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 px-1.5 lg:px-2 py-1 lg:py-1.5 rounded-[8px] lg:rounded-full ${pillStyle} overflow-hidden`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                        <span className="text-[8px] lg:text-[10px] font-black tracking-widest uppercase truncate whitespace-nowrap leading-none pt-0.5">
                          {task.type === "not_logged_in"
                            ? "You were not logged in"
                            : `${task.count} Task - ${task.type}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section - Insights */}
        <div className="hidden lg:flex gap-6 mt-12 mb-8">
          {/* Monthly Outlook */}
          <div className="bg-[#0A4F48] rounded-[32px] p-8 flex-1 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(10,79,72,0.3)]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#A7F3D0] mb-3">Monthly Outlook</h4>
            <h3 className="text-[28px] font-black leading-[1.1] mb-8 max-w-lg tracking-tight">
              {monthNames[currentMonth]} is looking<br />strong for endurance.
            </h3>
            <div className="flex gap-12 relative z-10">
              <div>
                <p className="text-[32px] font-black leading-none mb-1">{Math.round(compliance)}%</p>
                <p className="text-[10px] font-bold text-[#A7F3D0] uppercase tracking-widest">Completion Rate</p>
              </div>
              <div>
                <p className="text-[32px] font-black leading-none mb-1">{streak}</p>
                <p className="text-[10px] font-bold text-[#A7F3D0] uppercase tracking-widest">Active Streaks</p>
              </div>
            </div>
            {/* Visual Decoration */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#073D38] rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#0D635B] rounded-full blur-3xl opacity-40 pointer-events-none" />
          </div>

          {/* Expert Tip */}
          <div className="bg-[#8C5A35] rounded-[32px] p-8 w-[380px] text-white flex flex-col justify-between shadow-[0_20px_50px_rgba(140,90,53,0.3)]">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-200 mb-4">Expert Tip</h4>
              <p className="text-[16px] font-medium italic leading-relaxed opacity-90 pr-4">
                "Consistency in {monthNames[currentMonth]} prepares the muscle fibers for high-intensity training."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/20 shadow-md">
                 <img src={assets.profile} alt="Coach" className="w-full h-full object-cover" />
              </div>
              <p className="text-[15px] font-black tracking-wide">Coach Marcus</p>
            </div>
          </div>
        </div>
      </div>

      <DailyTaskDrawer
        selectedDate={selectedDate}
        tasks={selectedDate ? calendarData[selectedDate]?.tasks : null}
        allMissed={selectedDate ? calendarData[selectedDate]?.allMissed : false}
        onClose={() => setSelectedDate(null)}
        onSkip={handleSkipTask}
      />
      <MobileBottomNav />
    </div>
  );
}

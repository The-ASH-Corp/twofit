import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  SkipForward,
  Play,
} from "lucide-react";
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
import workoutBg from "@/assets/workout-bg.jpg";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { dualEdgeDepthShadow } from "../habit/HabitTracker";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const motivationQuotes = [
  "Don’t wait for perfect conditions. Keep moving and let the process shape you.",
  "Progress is built by the people who continue when others stop.",
  "The process may be slow, but stopping guarantees failure.",
  "You don’t need instant results. You need consistency.",
  "Every small step forward is proof that you refused to quit.",
  "Growth happens quietly while you keep showing up.",
  "Success belongs to the people who stay in the process long enough.",
  "Keep going, even when the progress is invisible.",
  "Discipline is choosing the process over temporary comfort.",
  "The strongest people are not the fastest; they are the most consistent.",
  "You are closer than you think. Don’t stop now.",
  "The process is painful sometimes, but regret hurts longer.",
  "Keep building, even on the days you doubt yourself.",
  "Momentum is created by continuing, not by waiting.",
  "One more step today can change your entire future.",
  "Trust the process, especially when the results take time.",
  "Winners are ordinary people with extraordinary persistence.",
  "Keep moving forward, even if it’s only one inch at a time.",
  "Your future is being shaped by what you consistently do today.",
  "The journey rewards the people who refuse to stop.",
  "Don’t chase motivation every day. Build habits that keep you going.",
  "Every repetition, every effort, every struggle is part of your transformation.",
  "Some days will test you. Keep going anyway.",
  "You don’t fail when it gets hard. You fail when you stop.",
  "The process is turning you into someone stronger than yesterday.",
  "Great things take time. Stay patient and keep working.",
  "Your consistency will take you places motivation never can.",
  "Small progress repeated daily becomes massive success.",
  "Keep showing up for yourself, no matter how difficult it feels.",
  "Never stop the process. Just keep going, one step at a time.",
];

const sliderImages = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200",
  "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1200",
];
export default function DailyPlan() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const { tasks } = useAppSelector((state) => state.tasks);

  const initialQuoteIndex = React.useMemo(() => {
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return dateSeed % motivationQuotes.length;
  }, []);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(initialQuoteIndex);
  const dailyQuote = motivationQuotes[currentQuoteIndex];

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % motivationQuotes.length);
  };

  const greeting = React.useMemo(() => {
    const hours = new Date().getHours();
    const name = user?.name ? user.name.split(" ")[0] : "Champion";
    if (hours < 12) return `Good morning, ${name}! ✨`;
    if (hours < 17) return `Good afternoon, ${name}! ☀️`;
    return `Good evening, ${name}! 🌙`;
  }, [user?.name]);

  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(null);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [program, setProgram] = useState(null);
  const [extensionProgram, setExtensionProgram] = useState(null);
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
        const extensionData = await dispatch(
          getPendingExtension(user?._id),
        ).unwrap();
        if (extensionData) {
          setPendingExtension(extensionData);
          const extensionProgramId =
            typeof extensionData.extendedProgramId === "object"
              ? extensionData.extendedProgramId?._id
              : extensionData.extendedProgramId;

          if (extensionProgramId) {
            const extensionProgramData = await dispatch(
              getProgramById(extensionProgramId),
            ).unwrap();
            setExtensionProgram(extensionProgramData?.data || null);
          } else {
            setExtensionProgram(null);
          }
        } else {
          setPendingExtension(null);
          setExtensionProgram(null);
        }

        // Fetch compliance and streaks
        const complianceRes = await dispatch(
          fetchClientComplianceStats(user?._id),
        ).unwrap();
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

  const extensionInfo = React.useMemo(() => {
    if (!pendingExtension) return null;

    const formatDate = (dateStr) => {
      const parsed = new Date(dateStr);
      if (Number.isNaN(parsed.getTime())) return dateStr;
      return parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    return {
      title:
        extensionProgram?.title ||
        pendingExtension?.extendedProgramId?.title ||
        "Extended Program",
      startLabel: formatDate(pendingExtension.extendedProgramStartDate),
      endLabel: formatDate(pendingExtension.extendedProgramEndDate),
    };
  }, [pendingExtension, extensionProgram]);

  // Calculate calendar data
  useEffect(() => {
    if (!program || !tasks) return;

    const newCalendarData = {};
    const programStartDateStr =
      clientUser?.programStartDate || user?.programStartDate;
    if (!programStartDateStr) return;

    const toLocalDateOnly = (dateLike) => {
      const date = new Date(dateLike);
      if (Number.isNaN(date.getTime())) return null;
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const programStartDate = new Date(programStartDateStr);
    if (Number.isNaN(programStartDate.getTime())) return;
    programStartDate.setHours(0, 0, 0, 0);

    // Keep calendar aligned with when day-1 was actually submitted.
    // This prevents expert verification timing from visually shifting day mapping.
    let effectiveProgramStartDate = new Date(programStartDate);
    const dayOneSubmittedDates = tasks
      .filter((task) => Number(task?.globalDayIndex) === 1)
      .map((task) => toLocalDateOnly(task?.createdAt || task?.updatedAt))
      .filter(Boolean)
      .sort((a, b) => a.getTime() - b.getTime());

    if (dayOneSubmittedDates.length > 0) {
      effectiveProgramStartDate = dayOneSubmittedDates[0];
    } else {
      let anchorTask = null;

      tasks.forEach((task) => {
        const taskDay = Number(task?.globalDayIndex);
        const taskDate = toLocalDateOnly(task?.createdAt || task?.updatedAt);
        if (!Number.isFinite(taskDay) || taskDay <= 0 || !taskDate) return;

        if (!anchorTask) {
          anchorTask = { taskDay, taskDate };
          return;
        }

        if (
          taskDay < anchorTask.taskDay ||
          (taskDay === anchorTask.taskDay &&
            taskDate.getTime() < anchorTask.taskDate.getTime())
        ) {
          anchorTask = { taskDay, taskDate };
        }
      });

      if (anchorTask) {
        effectiveProgramStartDate = new Date(anchorTask.taskDate);
        effectiveProgramStartDate.setDate(
          effectiveProgramStartDate.getDate() - (anchorTask.taskDay - 1),
        );
        effectiveProgramStartDate.setHours(0, 0, 0, 0);
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getDateKey = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;

    const flattenDaysWithGlobalIndex = (weeks = []) => {
      let globalIndex = 0;
      return weeks.flatMap((week, weekIndex) =>
        (week?.days || []).map((day, dayIndex) => {
          globalIndex += 1;
          return {
            ...day,
            weekIndex: weekIndex + 1,
            dayIndex: dayIndex + 1,
            globalIndex,
          };
        }),
      );
    };

    const sortedDays = flattenDaysWithGlobalIndex(program?.plan?.weeks || []);
    const sortedExtensionDays = flattenDaysWithGlobalIndex(
      extensionProgram?.plan?.weeks || [],
    );
    const sortedTherapyDays = flattenDaysWithGlobalIndex(
      therapyPlan?.weeks || [],
    );
    const therapyDayMap = new Map(
      sortedTherapyDays.map((day) => [day.globalIndex, day]),
    );

    const isWeightLoss = program?.title?.toLowerCase().includes("weight loss");
    const defaultMealCount = isWeightLoss ? 5 : 6;
    const mealCount =
      clientUser?.dietPlanMealCount ||
      user?.dietPlanMealCount ||
      defaultMealCount;

    let todayDateKey = null;
    let currentDatePointer = new Date(effectiveProgramStartDate);
    let displayProgramEndDate = new Date(effectiveProgramStartDate);

    sortedDays.forEach((currentPDay) => {
      const currentTherapyDay = therapyDayMap.get(currentPDay.globalIndex);

      let dayDate = null;
      let foundDate = null;

      const candidateDate = new Date(currentDatePointer);
      while (!foundDate) {
        candidateDate.setHours(0, 0, 0, 0);
        const dateKey = getDateKey(candidateDate);

        if (candidateDate < today) {
          // Check if user has task submissions on this calendar date 'candidateDate'
          const hasSubmissionsOnDate = tasks.some((task) => {
            const taskDate = toLocalDateOnly(
              task?.createdAt || task?.updatedAt,
            );
            return taskDate && taskDate.getTime() === candidateDate.getTime();
          });

          const isStartDate =
            candidateDate.getTime() === effectiveProgramStartDate.getTime();

          if (hasSubmissionsOnDate || isStartDate) {
            foundDate = new Date(candidateDate);
          } else {
            // No submissions on a past date -> "Offline Day"
            newCalendarData[dateKey] = {
              tasks: [],
              verified: 0,
              pending: 0,
              rejected: 0,
              skipped: 0,
              missed: 0,
              todo: 0,
              totalExpected: 0,
              allMissed: true,
              programDay: null,
            };
            candidateDate.setDate(candidateDate.getDate() + 1);
          }
        } else {
          // Today or future dates are active program days sequentially mapped
          foundDate = new Date(candidateDate);
        }
      }

      dayDate = foundDate;
      currentDatePointer = new Date(dayDate);
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
      displayProgramEndDate = new Date(dayDate);

      const dateKey = getDateKey(dayDate);
      const isBeforeToday = dayDate < today;

      if (dayDate.getTime() === today.getTime()) {
        todayDateKey = dateKey;
      }

      const dayTasks = tasks.filter(
        (t) => Number(t.globalDayIndex) === Number(currentPDay.globalIndex),
      );

      const taskList = [];
      const processItem = (idx, type, name, meta = {}) => {
        const submission = dayTasks.find(
          (t) => Number(t.exerciseIndex) === Number(idx) && t.taskType === type,
        );
        const status = submission ? submission.status : "todo";
        taskList.push({
          name,
          status,
          type,
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
      if (currentTherapyDay?.therapies) {
        currentTherapyDay.therapies.forEach((therapy, idx) => {
          processItem(idx, "Therapy", therapy.type || "Therapy Task", {
            notes: therapy.notes,
            mediaUrl: therapy.url,
          });
        });
      }

      const stats = {
        verified: taskList.filter((t) => t.status === "verified").length,
        pending: taskList.filter((t) => t.status === "pending").length,
        rejected: taskList.filter((t) => t.status === "rejected").length,
        skipped: taskList.filter((t) => t.status === "skipped").length,
        missed: taskList.filter((t) => t.status === "missed").length,
        todo: taskList.filter((t) => t.status === "todo").length,
      };

      const hasAnySubmittedStatus =
        stats.verified +
          stats.pending +
          stats.rejected +
          stats.skipped +
          stats.missed >
        0;
      const allMissed = isBeforeToday && !hasAnySubmittedStatus;

      newCalendarData[dateKey] = {
        tasks: allMissed ? [] : taskList,
        verified: allMissed ? 0 : stats.verified,
        pending: allMissed ? 0 : stats.pending,
        rejected: allMissed ? 0 : stats.rejected,
        skipped: allMissed ? 0 : stats.skipped,
        missed: allMissed ? 0 : stats.missed,
        todo: allMissed ? 0 : stats.todo,
        totalExpected: allMissed ? 0 : taskList.length,
        allMissed,
        programDay: currentPDay.globalIndex,
      };
    });

    // Add upcoming pending extension program days to calendar preview.
    if (pendingExtension && sortedExtensionDays.length > 0) {
      const extensionStartDate = toLocalDateOnly(
        pendingExtension.extendedProgramStartDate,
      );

      if (extensionStartDate) {
        const extensionPreviewStartDate = new Date(displayProgramEndDate);
        extensionPreviewStartDate.setHours(0, 0, 0, 0);

        const previewStartDate =
          extensionStartDate <= extensionPreviewStartDate
            ? new Date(
                extensionPreviewStartDate.getTime() + 24 * 60 * 60 * 1000,
              )
            : extensionStartDate;

        const extensionTitle = String(
          extensionProgram?.title ||
            pendingExtension?.extendedProgramId?.title ||
            "",
        ).toLowerCase();
        const extensionDefaultMealCount = extensionTitle.includes("weight loss")
          ? 5
          : 6;
        const extensionMealCount =
          clientUser?.dietPlanMealCount ||
          user?.dietPlanMealCount ||
          extensionDefaultMealCount;

        sortedExtensionDays.forEach((extensionDay) => {
          const extensionDate = new Date(previewStartDate);
          extensionDate.setDate(
            previewStartDate.getDate() + (extensionDay.globalIndex - 1),
          );
          extensionDate.setHours(0, 0, 0, 0);

          const extensionDateKey = getDateKey(extensionDate);
          if (newCalendarData[extensionDateKey]) return;

          const extensionTaskList = [];
          extensionDay.exercises?.forEach((ex, idx) => {
            extensionTaskList.push({
              name: ex.name || `Exercise ${idx + 1}`,
              status: "todo",
              type: "Workout",
              globalDayIndex: extensionDay.globalIndex,
              weekIndex: extensionDay.weekIndex,
              dayIndex: extensionDay.dayIndex,
              exerciseIndex: idx,
              programId:
                extensionProgram?._id ||
                (typeof pendingExtension.extendedProgramId === "object"
                  ? pendingExtension.extendedProgramId?._id
                  : pendingExtension.extendedProgramId),
            });
          });

          for (let i = 0; i < extensionMealCount; i++) {
            extensionTaskList.push({
              name: `Meal ${i + 1}`,
              status: "todo",
              type: "Meal",
              globalDayIndex: extensionDay.globalIndex,
              weekIndex: extensionDay.weekIndex,
              dayIndex: extensionDay.dayIndex,
              exerciseIndex: 100 + i,
              programId:
                extensionProgram?._id ||
                (typeof pendingExtension.extendedProgramId === "object"
                  ? pendingExtension.extendedProgramId?._id
                  : pendingExtension.extendedProgramId),
            });
          }

          newCalendarData[extensionDateKey] = {
            tasks: extensionTaskList,
            verified: 0,
            pending: 0,
            rejected: 0,
            skipped: 0,
            missed: 0,
            todo: extensionTaskList.length,
            totalExpected: extensionTaskList.length,
            allMissed: false,
            programDay: extensionDay.globalIndex,
            isExtensionPreview: true,
          };
        });
      }
    }

    if (todayDateKey) {
      setActiveDate(todayDateKey);
      setSelectedDate(todayDateKey);
      // Ensure drawer is closed on initial load
      setIsDrawerOpen(false);
    }

    setCalendarData(newCalendarData);
  }, [
    program,
    therapyPlan,
    extensionProgram,
    pendingExtension,
    tasks,
    user?.programStartDate,
    clientUser?.programStartDate,
    user?.dietPlanMealCount,
    clientUser?.dietPlanMealCount,
  ]);

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
      await dispatch(getUserTaskStatus());
    } catch (error) {
      toast.error("Failed to skip task: " + error);
    }
  };

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
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <Calendar className="w-12 h-12 text-[#0A4F48] opacity-20 mb-4" />
        <h2 className="text-xl font-bold text-[#0A4F48] mb-2">
          Program Hasn't Started Yet
        </h2>
        <p className="text-gray-500 max-w-md">
          Scheduled to start on{" "}
          <b>{new Date(startDate).toLocaleDateString()}</b>
        </p>
        <MobileBottomNav />
      </div>
    );
  }

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDates = [];
  for (let i = 0; i < firstDay; i++)
    calendarDates.push({ day: null, isCurrentMonth: false });
  for (let i = 1; i <= daysInMonth; i++)
    calendarDates.push({ day: i, isCurrentMonth: true });

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

  const selectedDayData = selectedDate ? calendarData[selectedDate] : null;

  // Stats for indicators card
  const totalVerified = Object.values(calendarData).reduce(
    (acc, curr) => acc + (curr.verified || 0),
    0,
  );
  const totalTodo = Object.values(calendarData).reduce(
    (acc, curr) => acc + (curr.todo || 0),
    0,
  );
  const totalSkipped = Object.values(calendarData).reduce(
    (acc, curr) => acc + (curr.skipped || 0),
    0,
  );

  return (
    <div className="client-page-container p-5 sm:p-6 lg:p-7">
      <div className="client-page-shell">
        {/* <div className="relative rounded-[32px] overflow-hidden aspect-10/3 group cursor-pointer shadow-xl ">
               <img 
                 src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80" 
                 alt="Fitness" 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="text-white text-5xl font-bold leading-tight mb-2">"{motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)]}"</p>
                  <p className="text-white text-sm font-medium leading-tight mb-2">- Twofit Team</p>
               </div>
            </div> */}

        <div className="relative rounded-[32px] overflow-hidden aspect-10/3 shadow-xl">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop={true}
            className="h-full"
          >
            {sliderImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={img}
                    alt="Fitness"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <p className="text-white text-5xl font-bold leading-tight mb-2">
                     "{motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)]}"
                    </p>

                    <p className="text-white text-sm font-medium">
                      - Twofit Team
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 mt-8">
          <div className="flex items-center gap-8">
            <h1 className="text-[28px] font-bold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h1>
            <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-100">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-sm font-semibold text-gray-400">Filter:</span>
            <select
              className="text-sm font-bold text-[#0A4F48] bg-transparent outline-none cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Verified</option>
              <option>Todo</option>
              <option>Skipped</option>
            </select>
          </div>
        </div>

        {/* Daily Motivation Quote Banner */}
        <div 
          onClick={handleNextQuote}
          className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 text-white shadow-xl border border-white/5 mb-8 group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-[#0A4F48]/20 select-none active:scale-[0.99]"
        >
          {/* Background Image */}
          <img 
            src={workoutBg} 
            alt="Workout Motivation" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* Dark brand gradient overlays for extreme visual style & contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A4F48]/95 via-[#0A4F48]/80 to-[#12665D]/65 mix-blend-multiply opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

          {/* Decorative background glow blur blobs */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#34D399] opacity-20 blur-3xl group-hover:opacity-25 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-300 opacity-15 blur-3xl group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
          
          {/* Quote icon watermark */}
          <Quote className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-white/5 pointer-events-none transform rotate-180 transition-all duration-700 group-hover:rotate-0 group-hover:scale-110" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-4xl">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold tracking-wider uppercase backdrop-blur-md border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {greeting}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-relaxed text-emerald-50/95 italic font-serif transition-all duration-300">
                "{dailyQuote}"
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-white/60 text-xs font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-[1px] bg-white/30" />
                  Twofit Team Guidance
                </span>
                
              </div>
            </div>
          </div>
        </div>

        {extensionInfo && (
          <div className="mb-8 rounded-2xl border border-[#CDE9E4] bg-[#F3FBF9] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#0A4F48] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                Plan Extended
              </span>
              <p className="text-sm font-semibold text-[#0A4F48]">
                {extensionInfo.title}: {extensionInfo.startLabel} to{" "}
                {extensionInfo.endLabel}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Calendar Side */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-4">
              {days.map((d) => (
                <div
                  key={d}
                  className="text-center text-[12px] font-bold text-gray-400 tracking-widest mb-4 uppercase"
                >
                  {d}
                </div>
              ))}
              {calendarDates.map((dateObj, idx) => {
                const { day, isCurrentMonth } = dateObj;
                const fullDate = isCurrentMonth
                  ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  : null;
                const dayData = fullDate ? calendarData[fullDate] : null;
                const isActive = fullDate === activeDate;
                const isSelected = fullDate === selectedDate;

                if (!day) return <div key={idx} className="aspect-4/5" />;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDate(fullDate);
                      setIsDrawerOpen(true);
                    }}
                    className={`relative aspect-4/5 p-4 rounded-[28px] cursor-pointer transition-all duration-300 group
                      ${isActive ? "bg-[#0A4F48] text-white shadow-xl shadow-[#0A4F48]/20 scale-105 z-10" : "bg-white text-gray-900 hover:shadow-lg border border-gray-50"}
                      ${isSelected && !isActive ? "ring-2 ring-[#0A4F48]/20 bg-[#F0F7F5]" : ""}
                    `}
                  >
                    <span
                      className={`text-[17px] font-extrabold ${isActive ? "text-white" : "text-gray-800"}`}
                    >
                      {String(day).padStart(2, "0")}
                    </span>

                    {isActive && (
                      <div className="absolute bottom-6 left-4 right-4">
                        <div className="text-[10px] font-black tracking-widest mb-2 opacity-80 uppercase">
                          Active
                        </div>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-1000"
                            style={{
                              width: `${dayData?.totalExpected ? (dayData.verified / dayData.totalExpected) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {!isActive && dayData && (
                      <div className="absolute bottom-5 left-4 right-4 flex flex-col gap-2">
                        {dayData.isExtensionPreview ? (
                          <div className="text-[9px] font-black text-[#0A4F48] uppercase tracking-tight">
                            Extended
                          </div>
                        ) : dayData.allMissed ? (
                          <div className="text-[9px] font-black text-gray-300 uppercase tracking-tight">
                            Offline Day
                          </div>
                        ) : dayData.totalExpected > 0 &&
                          dayData.verified === dayData.totalExpected ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-[#0A4F48]" />
                            <span className="text-[9px] font-black text-[#0A4F48] uppercase tracking-tight leading-none pt-0.5">
                              Completed
                            </span>
                          </div>
                        ) : dayData.totalExpected > 0 &&
                          dayData.verified > 0 ? (
                          <div className="w-full">
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#0A4F48] opacity-60 transition-all duration-1000"
                                style={{
                                  width: `${(dayData.verified / dayData.totalExpected) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : dayData.totalExpected > 0 ? (
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:w-[380px] flex flex-col gap-8">
            {/* Task Indicators */}
            <div
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50"
              style={dualEdgeDepthShadow}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Task Indicators
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0A4F48]" />
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Verified
                    </span>
                  </div>
                  <span className="text-lg font-black text-[#0A4F48]">
                    {totalVerified}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Todo
                    </span>
                  </div>
                  <span className="text-lg font-black text-gray-800">
                    {totalTodo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Skipped
                    </span>
                  </div>
                  <span className="text-lg font-black text-gray-800">
                    {totalSkipped}
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule View */}
            <div
              className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm flex flex-col"
              style={dualEdgeDepthShadow}
            >
              <div className="bg-[#F0F7F5] p-6 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#0A4F48]" />
                <h3 className="text-[15px] font-bold text-gray-800">
                  Schedule for{" "}
                  {selectedDate
                    ? `Day ${calendarData[selectedDate]?.programDay || "?"}`
                    : "Selected Day"}
                </h3>
                {selectedDayData?.isExtensionPreview && (
                  <span className="ml-auto rounded-full bg-[#0A4F48] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                    Extended Plan
                  </span>
                )}
              </div>
              <div className="p-6 flex-1 min-h-[300px]">
                {selectedDayData?.tasks?.length > 0 ? (
                  <div className="space-y-8 relative">
                    <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-gray-100" />
                    {selectedDayData.tasks.slice(0, 4).map((task, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div
                          className={`absolute left-0 top-1.5 w-2 h-2 rounded-full border-2 border-white ring-2 ${task.status === "verified" ? "ring-[#0A4F48] bg-[#0A4F48]" : "ring-gray-200 bg-white"}`}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${task.status === "verified" ? "text-[#0A4F48]" : "text-gray-400"}`}
                          >
                            {10 + idx}:00 AM
                          </span>
                          <h4 className="text-[15px] font-extrabold text-gray-800">
                            {task.name}
                          </h4>
                          <p className="text-[11px] font-medium text-gray-400">
                            Type: {task.type}
                          </p>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className="w-full py-4 mt-4 bg-[#F0F7F5] text-[#0A4F48] text-[13px] font-black rounded-2xl hover:bg-[#E6F3EF] transition-all"
                    >
                      View All
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <Clock className="w-10 h-10 text-gray-100 mb-3" />
                    <p className="text-sm font-medium text-gray-400">
                      No tasks scheduled
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quote Card */}
            {/* <div className="relative rounded-[32px] overflow-hidden aspect-4/3 group cursor-pointer shadow-xl">
               <img 
                 src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80" 
                 alt="Fitness" 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="text-white text-lg font-bold leading-tight mb-2">"{motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)]}"</p>
                  <p className="text-white text-sm font-medium leading-tight mb-2">- Twofit Team</p>
               </div>
            </div> */}
          </div>
        </div>
      </div>

      {isDrawerOpen && selectedDate && (
        <DailyTaskDrawer
          selectedDate={selectedDate}
          tasks={calendarData[selectedDate]?.tasks}
          allMissed={calendarData[selectedDate]?.allMissed}
          isExtensionPreview={calendarData[selectedDate]?.isExtensionPreview}
          onClose={() => setIsDrawerOpen(false)}
          onSkip={handleSkipTask}
        />
      )}
      <MobileBottomNav />
    </div>
  );
}

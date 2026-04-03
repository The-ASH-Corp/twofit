import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, CheckCircle2, Clock, SkipForward, Play } from "lucide-react";
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

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function DailyPlan() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(null);
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
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

  // Calculate calendar data
  useEffect(() => {
    if (!program || !tasks) return;

    const newCalendarData = {};
    const programStartDateStr = clientUser?.programStartDate || user?.programStartDate;
    if (!programStartDateStr) return;

    let iteratorDate = new Date(programStartDateStr);
    iteratorDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getDateKey = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`;

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

    while (programIndex < sortedDays.length && loopCount < MAX_DAYS) {
      loopCount++;
      const currentPDay = sortedDays[programIndex];
      const currentTherapyDay = sortedTherapyDays.find(
        (d) => d.globalIndex === currentPDay.globalIndex,
      );

      const dateKey = getDateKey(iteratorDate);
      const isBeforeToday = iteratorDate < today;
      const isDayToday = dateKey === getDateKey(today);

      if (isDayToday) {
        setActiveDate(dateKey);
        setSelectedDate(dateKey);
        // Ensure drawer is closed on initial load
        setIsDrawerOpen(false);
      }

      const dayTasks = tasks.filter(
        (t) => t.globalDayIndex === currentPDay.globalIndex,
      );

      const hasActivityOnDate = dayTasks.some((t) => {
        if (t.status === "todo") return false;
        const tDate = new Date(t.updatedAt);
        tDate.setHours(0, 0, 0, 0);
        return tDate.getTime() === iteratorDate.getTime();
      });

      let mapDayToDate = isBeforeToday ? hasActivityOnDate : true;

      if (mapDayToDate) {
        const taskList = [];
        const isWeightLoss = program?.title?.toLowerCase().includes("weight loss");
        const defaultMealCount = isWeightLoss ? 5 : 6;
        const mealCount = clientUser?.dietPlanMealCount || user?.dietPlanMealCount || defaultMealCount;

        const processItem = (idx, type, name, meta = {}) => {
          const submission = dayTasks.find(
            (t) => t.exerciseIndex === idx && t.taskType === type,
          );
          let status = submission ? submission.status : "todo";
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

        newCalendarData[dateKey] = {
          tasks: taskList,
          ...stats,
          totalExpected: taskList.length,
          allMissed: false,
          programDay: currentPDay.globalIndex,
        };
        programIndex++;
      } else {
        newCalendarData[dateKey] = {
          tasks: [],
          verified: 0, pending: 0, rejected: 0, skipped: 0, missed: 0, todo: 0,
          totalExpected: 0,
          allMissed: true,
        };
      }
      iteratorDate.setDate(iteratorDate.getDate() + 1);
    }
    setCalendarData(newCalendarData);
  }, [program, therapyPlan, tasks, user?.programStartDate, clientUser?.programStartDate]);

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
        <h2 className="text-xl font-bold text-[#0A4F48] mb-2">Program Hasn't Started Yet</h2>
        <p className="text-gray-500 max-w-md">Scheduled to start on <b>{new Date(startDate).toLocaleDateString()}</b></p>
        <MobileBottomNav />
      </div>
    );
  }

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDates = [];
  for (let i = 0; i < firstDay; i++) calendarDates.push({ day: null, isCurrentMonth: false });
  for (let i = 1; i <= daysInMonth; i++) calendarDates.push({ day: i, isCurrentMonth: true });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const selectedDayData = selectedDate ? calendarData[selectedDate] : null;

  // Stats for indicators card
  const totalVerified = Object.values(calendarData).reduce((acc, curr) => acc + (curr.verified || 0), 0);
  const totalTodo = Object.values(calendarData).reduce((acc, curr) => acc + (curr.todo || 0), 0);
  const totalSkipped = Object.values(calendarData).reduce((acc, curr) => acc + (curr.skipped || 0), 0);

  return (
    <div className="client-page-container">
      <div className="client-page-shell">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="flex items-center gap-8">
            <h1 className="text-[28px] font-bold text-gray-900">{monthNames[currentMonth]} {currentYear}</h1>
            <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-100">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
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

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Calendar Side */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-4">
              {days.map(d => (
                <div key={d} className="text-center text-[12px] font-bold text-gray-400 tracking-widest mb-4 uppercase">{d}</div>
              ))}
              {calendarDates.map((dateObj, idx) => {
                const { day, isCurrentMonth } = dateObj;
                const fullDate = isCurrentMonth ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
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
                      ${isActive ? 'bg-[#0A4F48] text-white shadow-xl shadow-[#0A4F48]/20 scale-105 z-10' : 'bg-white text-gray-900 hover:shadow-lg border border-gray-50'}
                      ${isSelected && !isActive ? 'ring-2 ring-[#0A4F48]/20 bg-[#F0F7F5]' : ''}
                    `}
                  >
                    <span className={`text-[17px] font-extrabold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                      {String(day).padStart(2, "0")}
                    </span>

                    {isActive && (
                      <div className="absolute bottom-6 left-4 right-4">
                        <div className="text-[10px] font-black tracking-widest mb-2 opacity-80 uppercase">Active</div>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white transition-all duration-1000" 
                            style={{ width: `${dayData?.totalExpected ? (dayData.verified / dayData.totalExpected) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {!isActive && dayData && (
                      <div className="absolute bottom-5 left-4 right-4 flex flex-col gap-2">
                         {dayData.allMissed ? (
                           <div className="text-[9px] font-black text-gray-300 uppercase tracking-tight">Offline Day</div>
                         ) : dayData.totalExpected > 0 && dayData.verified === dayData.totalExpected ? (
                           <div className="flex items-center gap-1.5">
                             <CheckCircle2 className="w-3 h-3 text-[#0A4F48]" />
                             <span className="text-[9px] font-black text-[#0A4F48] uppercase tracking-tight leading-none pt-0.5">Completed</span>
                           </div>
                         ) : dayData.totalExpected > 0 && dayData.verified > 0 ? (
                           <div className="w-full">
                             <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-[#0A4F48] opacity-60 transition-all duration-1000" 
                                 style={{ width: `${(dayData.verified / dayData.totalExpected) * 100}%` }}
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
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Task Indicators</h3>
              <div className="space-y-5">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#0A4F48]" />
                       <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Verified</span>
                    </div>
                    <span className="text-lg font-black text-[#0A4F48]">{totalVerified}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                       <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Todo</span>
                    </div>
                    <span className="text-lg font-black text-gray-800">{totalTodo}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                       <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Skipped</span>
                    </div>
                    <span className="text-lg font-black text-gray-800">{totalSkipped}</span>
                 </div>
              </div>
            </div>

            {/* Schedule View */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm flex flex-col">
              <div className="bg-[#F0F7F5] p-6 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#0A4F48]" />
                <h3 className="text-[15px] font-bold text-gray-800">
                  Schedule for {selectedDate ? `Day ${calendarData[selectedDate]?.programDay || '?'}` : 'Selected Day'}
                </h3>
              </div>
              <div className="p-6 flex-1 min-h-[300px]">
                 {selectedDayData?.tasks?.length > 0 ? (
                   <div className="space-y-8 relative">
                      <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-gray-100" />
                      {selectedDayData.tasks.slice(0, 4).map((task, idx) => (
                        <div key={idx} className="relative pl-8">
                           <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full border-2 border-white ring-2 ${task.status === 'verified' ? 'ring-[#0A4F48] bg-[#0A4F48]' : 'ring-gray-200 bg-white'}`} />
                           <div className="flex flex-col gap-0.5">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${task.status === 'verified' ? 'text-[#0A4F48]' : 'text-gray-400'}`}>
                                {10 + idx}:00 AM
                              </span>
                              <h4 className="text-[15px] font-extrabold text-gray-800">{task.name}</h4>
                              <p className="text-[11px] font-medium text-gray-400">Type: {task.type}</p>
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
                      <p className="text-sm font-medium text-gray-400">No tasks scheduled</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Quote Card */}
            <div className="relative rounded-[32px] overflow-hidden aspect-4/3 group cursor-pointer shadow-xl">
               <img 
                 src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80" 
                 alt="Fitness" 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <p className="text-white text-lg font-bold leading-tight mb-2">"Precision is the foundation of excellence."</p>
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-[2px]">Clinical Directive 2026</p>
               </div>
               <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#0A4F48] text-white flex items-center justify-center shadow-lg transition-transform hover:rotate-90">
                  <Play className="w-5 h-5 fill-current" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {isDrawerOpen && selectedDate && (
        <DailyTaskDrawer
          selectedDate={selectedDate}
          tasks={calendarData[selectedDate]?.tasks}
          allMissed={calendarData[selectedDate]?.allMissed}
          onClose={() => setIsDrawerOpen(false)}
          onSkip={handleSkipTask}
        />
      )}
      <MobileBottomNav />
    </div>
  );
}

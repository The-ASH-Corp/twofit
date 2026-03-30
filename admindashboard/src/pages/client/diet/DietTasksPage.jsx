import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Droplets, 
  Apple, 
  Moon, 
  Camera, 
  Check, 
  Utensils,
  Info,
  X
} from "lucide-react";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { assets } from "@/assets/asset";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import {
  getClient,
  fetchClientComplianceStats,
  fetchClientAdherenceStreaks,
} from "@/redux/features/client/client.thunk";
import { getProgramById } from "@/redux/features/program/program.thunk";
import {
  getUserTaskStatus,
  uploadTask,
} from "@/redux/features/tasks/task.thunk";
import MobileBottomNav from "../components/MobileBottomNav";
import { cn } from "@/lib/utils";

const getMealConfig = (index, totalCount, Apple, Utensils, Moon) => {
  if (totalCount === 4) {
    const configs = [
      { label: "BREAKFAST", time: "08:00 AM", icon: Apple },
      { label: "LUNCH", time: "01:30 PM", icon: Utensils },
      { label: "SNACK", time: "05:00 PM", icon: Apple },
      { label: "DINNER", time: "08:30 PM", icon: Moon },
    ];
    return configs[index] || { label: `MEAL ${index + 1}`, time: "--:--", icon: Utensils };
  }
  if (totalCount === 5) {
    const configs = [
      { label: "BREAKFAST", time: "08:00 AM", icon: Apple },
      { label: "MID-MORNING", time: "11:00 AM", icon: Apple },
      { label: "LUNCH", time: "01:30 PM", icon: Utensils },
      { label: "EVENING", time: "05:00 PM", icon: Apple },
      { label: "DINNER", time: "08:30 PM", icon: Moon },
    ];
    return configs[index] || { label: `MEAL ${index + 1}`, time: "--:--", icon: Utensils };
  }
  if (totalCount === 6) {
    const configs = [
      { label: "BREAKFAST", time: "07:30 AM", icon: Apple },
      { label: "MID-MORNING", time: "10:30 AM", icon: Apple },
      { label: "LUNCH", time: "01:00 PM", icon: Utensils },
      { label: "AFTERNOON", time: "04:00 PM", icon: Apple },
      { label: "EVENING", time: "07:00 PM", icon: Apple },
      { label: "DINNER", time: "09:30 PM", icon: Moon },
    ];
    return configs[index] || { label: `MEAL ${index + 1}`, time: "--:--", icon: Utensils };
  }
  return { label: `MEAL ${index + 1}`, time: "--:--", icon: Utensils };
};

export default function DietTasksPage() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Upload Meal Photo");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [skippingMeal, setSkippingMeal] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [complianceData, setComplianceData] = useState(null);
  const [streak, setStreak] = useState(0);
  const autoSkippedPreviousDayRef = useRef(null);
  const hasAutoSelected = useRef(false);
  const fileInputRef = useRef(null);

  const currentGlobalDay =
    clientUser?.currentGlobalDay || user?.currentGlobalDay || 1;
  const dietPlanPdf = clientUser?.dietPlanPdf || user?.dietPlanPdf;

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);

        const programId =
          typeof user?.programType === "object"
            ? user?.programType?._id
            : user?.programType;

        const [,, complianceRes, streaksRes, programData] = await Promise.all([
          user?._id ? dispatch(getClient({ id: user._id })).unwrap() : Promise.resolve(),
          dispatch(getUserTaskStatus()).unwrap(),
          user?._id ? dispatch(fetchClientComplianceStats(user._id)).unwrap() : Promise.resolve(null),
          user?._id ? dispatch(fetchClientAdherenceStreaks(user._id)).unwrap() : Promise.resolve(null),
          programId ? dispatch(getProgramById(programId)).unwrap() : Promise.resolve(null),
        ]);

        if (complianceRes) setComplianceData(complianceRes || null);
        if (streaksRes?.diet) setStreak(streaksRes.diet.activeStreak || 0);
        if (programData) setProgram(programData.data);
      } catch (error) {
        console.error("Failed to load diet page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [dispatch, user?._id, user?.programType]);

  const dietTasks = useMemo(() => {
    const isWeightLoss = program?.title?.toLowerCase().includes("weight loss");
    const defaultMealCount = isWeightLoss ? 5 : 6;
    const mealCount =
      clientUser?.dietPlanMealCount || user?.dietPlanMealCount || defaultMealCount;

    return Array.from({ length: mealCount }, (_, index) => {
      const mealIndex = 100 + index;
      const submission = tasks?.find(
        (task) =>
          task.globalDayIndex === currentGlobalDay &&
          task.exerciseIndex === mealIndex &&
          task.taskType === "Meal",
      );

      const config = getMealConfig(index, mealCount, Apple, Utensils, Moon);

      return {
        name: config.label,
        notes: "Upload a clear image of your meal for expert review.",
        index,
        exerciseIndex: mealIndex,
        status: submission?.status || "todo",
        programId: program?._id,
        weekIndex: Math.ceil(currentGlobalDay / 7),
        dayIndex: ((currentGlobalDay - 1) % 7) + 1,
        globalDayIndex: currentGlobalDay,
      };
    });
  }, [
    clientUser?.dietPlanMealCount,
    currentGlobalDay,
    program?._id,
    program?.title,
    tasks,
    user?.dietPlanMealCount,
  ]);

  // Auto-select the first actionable (todo or rejected) meal after data loads
  useEffect(() => {
    if (!isLoading && dietTasks.length > 0 && !hasAutoSelected.current) {
      const firstActionableIndex = dietTasks.findIndex(
        (t) => t.status === "todo" || t.status === "rejected"
      );

      if (firstActionableIndex !== -1) {
        setSelectedIndex(firstActionableIndex);
      } else {
        // If all are processed, stay at the last meal
        setSelectedIndex(dietTasks.length - 1);
      }
      hasAutoSelected.current = true;
    }
  }, [isLoading, dietTasks]);

  
  const isProgramStarted = useMemo(() => {
    const startDate = clientUser?.programStartDate || user?.programStartDate;
    if (!startDate) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    return today >= start;
  }, [clientUser?.programStartDate, user?.programStartDate]);

  

  const selectedTask = dietTasks[selectedIndex] || null;

  const selectedMealStatus = selectedTask?.status || "todo";

  const totalSkippedMeals = useMemo(
    () =>
      (tasks || []).filter(
        (task) => task.taskType === "Meal" && task.status === "skipped",
      ).length,
    [tasks],
  );

  const todayProgress = useMemo(() => {
    if (!dietTasks.length) return 0;
    const completedToday = dietTasks.filter(t => t.status === "verified").length;
    return Math.round((completedToday / dietTasks.length) * 100);
  }, [dietTasks]);

  const furthestIndex = useMemo(() => {
    // Find last verified or skipped meal
    const lastCompletedIdx = dietTasks.slice().reverse().findIndex(t => t.status === "verified" || t.status === "skipped");
    const lastIdx = lastCompletedIdx === -1 ? 0 : (dietTasks.length - 1 - lastCompletedIdx);
    // Determine the progress line endpoint: it should reach at least the selectedIndex or the last actioned meal
    return Math.max(lastIdx, selectedIndex);
  }, [dietTasks, selectedIndex]);

  const progressBarWidth = useMemo(() => {
    if (dietTasks.length <= 1) return 0;
    return (furthestIndex / (dietTasks.length - 1)) * 100;
  }, [furthestIndex, dietTasks.length]);

  const statusConfig = {
    pending: {
      label: "Pending",
      pillClass: "bg-yellow-100 text-yellow-700 border-yellow-300",
      panelClass: "bg-yellow-50 border-yellow-200",
      message: "Submission is waiting for expert review.",
    },
    verified: {
      label: "Verified",
      pillClass: "bg-green-100 text-green-700 border-green-300",
      panelClass: "bg-green-50 border-green-200",
      message: "Great work. Submission was verified.",
    },
    rejected: {
      label: "Rejected",
      pillClass: "bg-red-100 text-red-700 border-red-300",
      panelClass: "bg-red-50 border-red-200",
      message: "Submission was rejected. Please upload a better meal proof.",
    },
    skipped: {
      label: "Skipped",
      pillClass: "bg-orange-100 text-orange-800 border-orange-300",
      panelClass: "bg-orange-50 border-orange-200",
      message: "This meal was skipped.",
    },
  };

  const handleViewAssignedMealPdf = () => {
    if (!dietPlanPdf) {
      toast.info("No meal PDF is assigned yet.");
      return;
    }

    const fullUrl = `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${dietPlanPdf}`;
    window.open(fullUrl, "_blank");
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      toast.error("Only image files are allowed for diet submission.");
      e.target.value = "";
      return;
    }

    setFile(selected);
    setFileName(selected.name);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const shouldShowSubmissionForm =
    Boolean(selectedTask) &&
    selectedMealStatus !== "pending" &&
    selectedMealStatus !== "verified" &&
    selectedMealStatus !== "skipped";

  useEffect(() => {
    const autoSkipPreviousDayMeals = async () => {
      if (isLoading || currentGlobalDay <= 1 || !program?._id || !dietTasks.length) {
        return;
      }

      const previousDayIndex = currentGlobalDay - 1;
      if (autoSkippedPreviousDayRef.current === previousDayIndex) {
        return;
      }

      const mealCount = dietTasks.length;
      const previousWeekIndex = Math.ceil(previousDayIndex / 7);
      const previousDayInWeek = ((previousDayIndex - 1) % 7) + 1;
      const expectedMealIndices = Array.from({ length: mealCount }, (_, idx) => 100 + idx);

      const previousDaySubmissions = (tasks || []).filter(
        (task) => task.taskType === "Meal" && task.globalDayIndex === previousDayIndex,
      );

      const missingMealIndices = expectedMealIndices.filter(
        (exerciseIndex) =>
          !previousDaySubmissions.some(
            (submission) => Number(submission.exerciseIndex) === Number(exerciseIndex),
          ),
      );

      if (!missingMealIndices.length) {
        autoSkippedPreviousDayRef.current = previousDayIndex;
        return;
      }

      try {
        await Promise.all(
          missingMealIndices.map((exerciseIndex) => {
            const formData = new FormData();
            formData.append("taskType", "Meal");
            formData.append("status", "skipped");
            formData.append("notes", "Auto-skipped because the day ended.");
            formData.append("programId", program._id);
            formData.append("weekIndex", previousWeekIndex);
            formData.append("dayIndex", previousDayInWeek);
            formData.append("globalDayIndex", previousDayIndex);
            formData.append("exerciseIndex", exerciseIndex);
            return dispatch(uploadTask(formData)).unwrap();
          }),
        );

        autoSkippedPreviousDayRef.current = previousDayIndex;
        toast.info(
          `${missingMealIndices.length} previous-day meal${missingMealIndices.length > 1 ? "s were" : " was"} marked as skipped.`,
        );
        dispatch(getUserTaskStatus());
      } catch (error) {
        console.error("Auto-skip failed:", error);
      }
    };

    autoSkipPreviousDayMeals();
  }, [currentGlobalDay, dietTasks.length, dispatch, isLoading, program?._id, tasks]);

  const handleSubmit = async () => {
    if (!file) {
      toast.info("Please upload a meal photo.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed for diet submission.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", comment);
      formData.append("taskType", "Meal");

      formData.append("programId", selectedTask?.programId || "");
      formData.append("weekIndex", selectedTask?.weekIndex || 1);
      formData.append("dayIndex", selectedTask?.dayIndex || 1);
      formData.append("globalDayIndex", selectedTask?.globalDayIndex || 1);
      formData.append("exerciseIndex", selectedTask?.exerciseIndex ?? 100);

      const result = await dispatch(uploadTask(formData));
      if (uploadTask.fulfilled.match(result)) {
        toast.success(`${selectedTask?.name || "Meal"} submitted successfully!`);
        setFile(null);
        setFileName("Upload Meal Photo");
        setComment("");
        dispatch(getUserTaskStatus());
      } else {
        toast.error(result.payload || "Submission failed. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const handleSkipMeal = async () => {
    if (!selectedTask) {
      setShowSkipConfirm(false);
      return;
    }

    setSkippingMeal(true);
    try {
      const formData = new FormData();
      formData.append("taskType", "Meal");
      formData.append("status", "skipped");
      formData.append("notes", comment || "Meal skipped by client.");
      formData.append("programId", selectedTask?.programId || "");
      formData.append("weekIndex", selectedTask?.weekIndex || 1);
      formData.append("dayIndex", selectedTask?.dayIndex || 1);
      formData.append("globalDayIndex", selectedTask?.globalDayIndex || 1);
      formData.append("exerciseIndex", selectedTask?.exerciseIndex ?? 100);

      await dispatch(uploadTask(formData)).unwrap();
      toast.success(`${selectedTask?.name || "Meal"} marked as skipped.`);
      setFile(null);
      setFileName("Upload Meal Photo");
      setComment("");
      dispatch(getUserTaskStatus());
    } catch (error) {
      toast.error(error || "Failed to skip meal. Please try again.");
    } finally {
      setSkippingMeal(false);
      setShowSkipConfirm(false);
    }
  };

  const clientStatus = clientUser?.status || user?.status;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={16} />
      </div>
    );
  }

  if (!isProgramStarted) {
    return (
      <>
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#0A4F48]/10">
          <h2 className="text-xl font-bold text-[#0A4F48]">Program Not Started</h2>
          <p className="text-gray-500 mt-2">Diet tasks will appear once your program starts.</p>
        </div>
        <MobileBottomNav />
      </>
    );
  }

  if (clientStatus === "Inactive") {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#0A4F48]/10">
        <h2 className="text-xl font-bold text-[#0A4F48]">Account Inactive</h2>
        <p className="text-gray-500 mt-2">Please contact admin to reactivate your account.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FBFA] min-h-screen pb-32 font-sans selection:bg-[#0A4F48]/10">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-10 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* =========================================
            LEFT COLUMN (Banner + Progression + Summary)
            ========================================= */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Main Hero Banner: Ongoing Session */}
          <div className="relative w-full aspect-video lg:aspect-[1.8/1] rounded-[40px] overflow-hidden shadow-2xl group">
             {/* Gradient Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10" />
            
            <img
              src={selectedTask?.index === 1 ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200" : assets.MealPlaceholder}
              alt="Current Meal"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 z-20 max-w-2xl">
              <div className="bg-[#10B981] text-white text-[9px] lg:text-[10px] uppercase font-black tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 w-fit shadow-lg shadow-[#10B981]/20">
                Ongoing Session
              </div>
              <h1 className="text-white font-black text-3xl lg:text-5xl leading-tight tracking-tighter drop-shadow-md">
                {selectedTask?.name === "LUNCH" ? "Lunch" : `${selectedTask?.name}`}
              </h1>
              <p className="text-white/80 font-bold text-sm lg:text-base mt-2 lg:mt-4 leading-relaxed max-w-xl">
                Precision-balanced nutrients for optimal cognitive performance and sustained energy levels throughout the afternoon.
              </p>
            </div>
            
            
          </div>

          {/* Daily Progression Stepper */}
          <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#0A4F48]/5 group">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-[#0A4F48] font-black text-2xl lg:text-2xl tracking-tighter">
                Daily Progression
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[#0A4F48] font-black text-xl lg:text-xl">{todayProgress}% Completed</span>
              </div>
            </div>

            <div className="relative flex justify-between items-start pt-4 px-4 lg:px-8">
              {/* Connector Lines */}
              <div className="absolute top-[34px] left-16 right-16 h-1 bg-gray-100 z-0" />
              <div 
                className="absolute top-[34px] left-16 h-1 bg-[#0A4F48] z-0 transition-all duration-700 ease-in-out" 
                style={{ width: `calc(${progressBarWidth}% - ${progressBarWidth > 0 ? "32px" : "0px"})` }}
              />

              {dietTasks.map((item, idx) => {
                 const isActive = idx === selectedIndex;
                 const isVerified = item.status === "verified";
                 const isSkipped = item.status === "skipped";
                 const config = getMealConfig(idx, dietTasks.length, Apple, Utensils, Moon);
                 const Icon = config.icon;

                 return (
                   <div key={idx} className="flex flex-col items-center gap-4 relative z-10 w-24">
                      <button
                        onClick={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform",
                          isActive ? "bg-[#0A4F48] scale-115 shadow-xl shadow-[#0A4F48]/30 border-4 border-white" : 
                          isVerified ? "bg-[#0A4F48] text-white" :
                          isSkipped ? "bg-orange-500 text-white" :
                          "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        )}
                      >
                        {isVerified ? (
                          <Check size={24} strokeWidth={4} />
                        ) : isSkipped ? (
                          <X size={24} strokeWidth={4} />
                        ) : (
                          <Icon size={isActive ? 28 : 24} className={isActive ? "text-[#71FEE2]" : ""} />
                        )}
                      </button>
                      
                      <div className="text-center">
                        <h4 className={cn(
                          "text-[9px] lg:text-[10px] font-black tracking-widest uppercase transition-colors",
                          isActive ? "text-[#0A4F48]" : "text-gray-400"
                        )}>
                          {item.name}
                        </h4>
                        <p className={cn(
                          "text-[9px] font-bold mt-1 uppercase",
                          isActive ? "text-[#0A4F48]" : "text-gray-300"
                        )}>
                          {isActive ? "In Progress" : config.time}
                        </p>
                      </div>
                   </div>
                 );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Diet Summary Card */}
            <div className="bg-[#0A4F48] rounded-[48px] p-8 lg:p-10 shadow-2xl shadow-[#0A4F48]/20 flex flex-col gap-10 flex-1">
              <div className="flex justify-between items-start">
                 <h3 className="text-[#71FEE2] font-black text-[9px] uppercase tracking-[0.3em] pl-1">
                    Diet Summary
                 </h3>
                 <div className="flex items-center gap-2 bg-[#71FEE2]/10 px-3 py-1 rounded-full">
                    <span className="text-[#71FEE2] font-black text-[10px] tracking-widest uppercase">{streak}D Streak</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-6 lg:p-7 relative overflow-hidden group border border-white/5">
                  <h4 className="text-white/40 font-black text-[9px] uppercase tracking-widest mb-2">Meals Assigned</h4>
                  <p className="text-white font-black text-3xl tracking-tighter">
                    {String(complianceData?.stats?.expectedMeals || (dietTasks.length * currentGlobalDay)).padStart(2, '0')}
                  </p>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#71FEE2]" />
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-6 lg:p-7 relative overflow-hidden group border border-white/5">
                  <h4 className="text-white/40 font-black text-[9px] uppercase tracking-widest mb-2">Non-Compliant</h4>
                  <p className="text-white font-black text-3xl tracking-tighter">
                     {String((complianceData?.stats?.skippedCount || 0) + (complianceData?.stats?.missedCount || 0)).padStart(2, '0')}
                  </p>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-400" />
                </div>
              </div>

              <div className="flex items-center gap-4 pl-1">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#71FEE2]">
                  <TrendingUp size={20} />
                </div>
                <p className="text-white/90 font-black text-sm tracking-tight leading-tight">
                  {complianceData?.stats?.expectedMeals 
                    ? Math.round(((complianceData.stats.expectedMeals - (complianceData.stats.missedCount + complianceData.stats.skippedCount)) / complianceData.stats.expectedMeals) * 100) 
                    : 0}% Diet Compliance
                </p>
              </div>
            </div>

            {/* Hydration Tip */}
            <div className="bg-[#FFE5D2] rounded-[48px] p-8 lg:p-10 flex flex-col justify-center gap-6 group hover:translate-y-[-4px] transition-transform shadow-sm flex-1">
              <div className="w-14 h-14 rounded-2xl bg-[#CC895B]/10 flex items-center justify-center text-[#845E47] shrink-0">
                <Droplets size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-[#845E47]/40 font-black text-[9px] uppercase tracking-[0.2em] mb-2">Hydration Tip</h4>
                <p className="text-[#845E47] font-black text-[15px] lg:text-[18px] leading-snug tracking-tight">
                  Drink 250ml of water before this meal.
                </p>
                <p className="text-[#845E47]/60 text-xs font-bold mt-2">Proper hydration increases metabolic efficiency by 15% during digestion.</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN (Submission)
            ========================================= */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Header Task Info */}
          <div className="bg-transparent pl-2 pr-2">
             <h4 className="text-[#10B981] font-black text-[10px] tracking-[0.3em] uppercase mb-1">
                Current Task
             </h4>
             <h2 className="text-[#0A4F48] font-black text-2xl lg:text-3xl leading-tight tracking-tighter">
                {selectedTask?.name === "BREAKFAST" ? "Morning Meal" : selectedTask?.name} - Upload a clear image
             </h2>
             
             <div className="flex flex-col gap-3 mt-8">
                <div className="bg-gray-50 rounded-[28px] p-4 lg:p-5 flex items-center gap-4 border border-gray-100 transition-colors hover:bg-white hover:shadow-md cursor-default group">
                   <div className="w-10 h-10 rounded-2xl bg-[#EAF5F4] flex items-center justify-center text-[#0A4F48] shrink-0">
                      <Clock size={20} strokeWidth={2.5} />
                   </div>
                   <p className="text-gray-600 font-bold text-xs lg:text-sm leading-snug">
                      Submit within 15 minutes of eating
                   </p>
                </div>
             </div>
          </div>

          {/* Submission Form */}
          <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#0A4F48]/5">
            <h3 className="text-[#0A4F48] font-black text-sm uppercase tracking-widest pl-1 mb-6">
              Submit Diet Proof
            </h3>

            {shouldShowSubmissionForm && (
              <div className="flex flex-col gap-6">
                <div 
                  onClick={handleOpenFilePicker}
                  className="relative aspect-square w-full rounded-[40px] border-2 border-dashed border-gray-100 bg-[#F9FBFA] flex flex-col items-center justify-center gap-4 transition-all hover:border-[#0A4F48]/30 hover:bg-[#EAF1F0] cursor-pointer group overflow-hidden"
                >
                  {file ? (
                    <div className="absolute inset-0 w-full h-full p-6">
                      <div className="relative w-full h-full rounded-[30px] overflow-hidden group/img">
                         <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <span className="text-white font-black text-xs tracking-widest uppercase">Change Photo</span>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-[#0A4F48] group-hover:scale-110 transition-transform">
                        <Camera size={28} />
                      </div>
                      <p className="text-gray-500 font-bold text-xs lg:text-sm text-center px-8">
                        Drop image here or <span className="text-[#0A4F48] underline underline-offset-4 decoration-2">browse</span>
                      </p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add optional notes (e.g. substitutions, mood...)"
                  className="w-full rounded-[20px] border-none bg-gray-50 px-6 py-5 text-sm font-bold text-gray-700 placeholder-gray-400/60 focus:ring-0 resize-none h-32 transition-all shadow-inner"
                />

                <div className="flex flex-col gap-4 mt-2">
                   <button
                     onClick={handleSubmit}
                     disabled={uploading}
                     className="w-full bg-[#0A4F48] text-white disabled:bg-gray-200 disabled:text-gray-400 rounded-full py-5 text-[14px] font-black tracking-widest uppercase shadow-2xl shadow-[#0A4F48]/30 transition-all hover:scale-[1.02]"
                   >
                     {uploading ? "Submitting..." : "Submit Diet"}
                   </button>
                   <button 
                     onClick={() => setShowSkipConfirm(true)}
                     className="text-gray-400 font-black text-[12px] uppercase tracking-widest hover:text-[#0A4F48] transition-colors mt-2"
                   >
                     Skip Meal
                   </button>
                </div>
              </div>
            )}
            
            {/* Feedback Status */}
            {(selectedMealStatus !== "todo" && !shouldShowSubmissionForm) && statusConfig[selectedMealStatus] && (
               <div className={cn(
                  "p-8 rounded-[32px] border-2 text-center flex flex-col items-center gap-4",
                  statusConfig[selectedMealStatus].panelClass
               )}>
                  <CheckCircle2 size={40} className="text-[#0A4F48]" />
                  <h3 className="text-[#0A4F48] font-black text-lg tracking-tighter uppercase">Meal {selectedMealStatus}</h3>
                  <p className="text-gray-600 font-bold text-xs">{statusConfig[selectedMealStatus].message}</p>
               </div>
            )}
          </div>
        </div>
      </div>
      <MobileBottomNav />

      {/* Skip Confirmation Modal */}
      {showSkipConfirm && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[48px] bg-white p-10 border border-gray-100 shadow-[0_32px_64px_rgba(0,0,0,0.15)] transform transition-all animate-in fade-in zoom-in duration-300">
             <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-600 mb-8 mx-auto">
                <Info size={32} />
             </div>
             <h3 className="text-2xl font-black text-[#0A4F48] tracking-tighter text-center">Skip This Meal?</h3>
             <p className="text-sm text-gray-500 font-bold mt-4 text-center leading-relaxed">
               Are you sure you want to skip <span className="text-[#0A4F48]">{selectedTask?.name}</span>? This session tracking will be cancelled.
             </p>
             <div className="mt-10 flex flex-col gap-3">
                <button
                  onClick={handleSkipMeal}
                  disabled={skippingMeal}
                  className="w-full py-4 rounded-full bg-red-600 text-white font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-colors shadow-xl shadow-red-200 active:scale-95"
                >
                  {skippingMeal ? "Processing..." : "Yes, Skip Session"}
                </button>
                <button
                  onClick={() => setShowSkipConfirm(false)}
                  disabled={skippingMeal}
                  className="w-full py-4 rounded-full bg-gray-50 text-gray-400 font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors active:scale-95"
                >
                  Cancel
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

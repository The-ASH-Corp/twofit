import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { 
  CalendarDays,
  CheckCircle2, 
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

  const expectedMealsCount = useMemo(
    () =>
      Number(
        complianceData?.stats?.expectedMeals || dietTasks.length * currentGlobalDay,
      ),
    [complianceData?.stats?.expectedMeals, currentGlobalDay, dietTasks.length],
  );

  const nonCompliantCount = useMemo(
    () =>
      Number(complianceData?.stats?.skippedCount || 0) +
      Number(complianceData?.stats?.missedCount || 0),
    [complianceData?.stats?.missedCount, complianceData?.stats?.skippedCount],
  );

  const dietCompliancePercent = useMemo(() => {
    if (!expectedMealsCount) return 0;
    const compliance = Math.round(
      ((expectedMealsCount - nonCompliantCount) / expectedMealsCount) * 100,
    );
    return Math.max(0, Math.min(compliance, 100));
  }, [expectedMealsCount, nonCompliantCount]);

  const summaryCountBoxDepthStyle = {
    boxShadow:
      "inset 8px 8px 16px rgba(177, 190, 184, 0.62), inset -8px -8px 16px rgba(255, 255, 255, 0.96), inset 0 1px 0 rgba(255, 255, 255, 0.88)",
  };

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

  if (!dietPlanPdf) {
    return (
      <div className="client-page-container p-5 sm:p-6 min-h-[80vh] flex flex-col justify-center">
        <div className="client-page-shell max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-[32px] p-8 sm:p-12 text-center shadow-2xl border border-[#0A4F48]/10 flex flex-col items-center">
            <div className="w-24 h-24 bg-[#F0F7F4] rounded-[24px] flex items-center justify-center mb-8 rotate-3 transition-transform hover:rotate-6">
              <Utensils size={44} className="text-[#0A4F48]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F2F27] tracking-tight">Diet Plan Pending</h2>
            <p className="text-[#5F7269] mt-6 text-lg font-medium leading-relaxed">
              Your dietitian is currently crafting your personalized diet plan. Once it's ready, you'll see your daily meals and tracking tools here.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <div className="px-6 py-3 bg-[#E8F3EC] rounded-full text-[#0A4F48] font-bold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0A7B4E] animate-pulse"></span>
                Expert review in progress
              </div>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="client-page-container p-5 sm:p-6">
      <div className="client-page-shell">
        <section className="client-card rounded-[24px] p-4 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between gap-3 text-[#1F2F27]">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[#0A7B4E]" />
              <h2 className="text-[22px] font-black tracking-tight">Daily Progression</h2>
            </div>
            <p className="text-[12px] font-black text-[#0A7B4E]">{todayProgress}% complete</p>
          </div>
          <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#0A7B4E]">
            In Progress
          </p>

          <div className="relative mt-6 pb-1">
            <div className="absolute left-[24px] right-[24px] top-[20px] h-[5px] rounded-full bg-[#DDE5E1]" />
            <div
              className="absolute left-[24px] top-[20px] h-[5px] rounded-full bg-[#0A7B4E] transition-all duration-700"
              style={{ width: `${progressBarWidth}%` }}
            />

            <div className="relative flex justify-between gap-2">
              {dietTasks.map((item, idx) => {
                const isActive = idx === selectedIndex;
                const isVerified = item.status === "verified";
                const isSkipped = item.status === "skipped";
                const config = getMealConfig(
                  idx,
                  dietTasks.length,
                  Apple,
                  Utensils,
                  Moon,
                );
                const Icon = config.icon;

                return (
                  <div key={idx} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                    <button
                      onClick={() => setSelectedIndex(idx)}
                      className={cn(
                        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-[#7D8B84] transition-all sm:h-11 sm:w-11",
                        isActive && "border-[#0A7B4E] bg-[#ECF4EF] text-[#0A7B4E] shadow-[0_8px_16px_rgba(10,123,78,0.2)]",
                        isVerified &&
                          !isActive &&
                          "border-[#0A7B4E] bg-[#0A7B4E] text-white",
                        isSkipped &&
                          !isActive &&
                          "border-[#D97706] bg-[#D97706] text-white",
                        !isActive &&
                          !isVerified &&
                          !isSkipped &&
                          "border-[#D6DFDA] bg-[#F6FAF8] hover:border-[#0A7B4E]/50",
                      )}
                    >
                      {isVerified ? (
                        <Check size={16} strokeWidth={3} />
                      ) : isSkipped ? (
                        <X size={16} strokeWidth={3} />
                      ) : isActive ? (
                        <Icon size={17} />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-[#9AA7A1]" />
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedIndex(idx)}
                      className={cn(
                        "truncate text-center text-[11px] font-bold leading-tight text-[#5D6D65]",
                        isActive && "text-[#0A7B4E]",
                      )}
                    >
                      {item.name
                        .toLowerCase()
                        .replace(/\b\w/g, (match) => match.toUpperCase())}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-6">
            <section className="client-card rounded-[24px] p-5 sm:p-6">
              <h3 className="text-[28px] leading-none font-black text-[#1F2F27]">
                Diet Summary
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div
                  className="rounded-[14px] border border-[#D8E2DC] bg-[linear-gradient(165deg,#EEF4F0_0%,#E9F0EC_100%)] p-4 text-center"
                  style={summaryCountBoxDepthStyle}
                >
                  <p className="text-[44px] leading-none font-black text-[#0A7B4E]">
                    {expectedMealsCount}
                  </p>
                  <p className="mt-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#61736A]">
                    Meals Assigned
                  </p>
                </div>
                <div
                  className="rounded-[14px] border border-[#E7DBDB] bg-[linear-gradient(165deg,#F5EFEF_0%,#F0E8E8_100%)] p-4 text-center"
                  style={summaryCountBoxDepthStyle}
                >
                  <p className="text-[44px] leading-none font-black text-[#C11212]">
                    {nonCompliantCount}
                  </p>
                  <p className="mt-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#61736A]">
                    Non-Compliant
                  </p>
                </div>
              </div>
            </section>

            <section className="client-card rounded-[24px] border-l-[4px] border-l-[#0A7B4E] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#E8F3EC] text-[#0A7B4E]">
                  <Droplets size={20} />
                </div>
                <div>
                  <h4 className="text-[26px] leading-none font-black text-[#1F2F27]">
                    Hydration Tip
                  </h4>
                  <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#5F7269]">
                    Boost your metabolism and aid digestion by drinking exactly{" "}
                    <span className="font-black text-[#1F2F27]">250ml of water</span>{" "}
                    before your breakfast meal.
                  </p>
                </div>
              </div>
            </section>

            <section className="client-card rounded-[24px] p-5 sm:p-6">
              <div className="mx-auto flex w-[132px] flex-col items-center justify-center">
                <div className="relative h-[132px] w-[132px]">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#E2EBE6"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#0A7B4E"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 42 * (1 - dietCompliancePercent / 100)
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[28px] leading-none font-black text-[#1F2F27]">
                      {dietCompliancePercent}%
                    </p>
                    <p className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#63756C]">
                      Compliance
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="client-card rounded-[24px] p-5 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[36px] leading-none font-black text-[#1F2F27]">
                  Submit Diet Proof
                </h2>
                <p className="mt-2 text-[13px] font-black uppercase tracking-[0.12em] text-[#0A7B4E]">
                  Ongoing Session: {selectedTask?.name || "Meal"}
                </p>
              </div>
              <div className="rounded-full bg-[#F8DFDF] px-4 py-2 text-[13px] font-black text-[#C11212]">
                Submit within 15 minutes
              </div>
            </div>

            {shouldShowSubmissionForm ? (
              <div className="mt-6">
                <div
                  onClick={handleOpenFilePicker}
                  className="relative h-[340px] cursor-pointer overflow-hidden rounded-[24px] border border-[#CAD6D0] bg-[#334A67]"
                >
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Meal proof preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={assets.MealPlaceholder}
                        alt="Meal placeholder"
                        className="absolute inset-0 h-full w-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-[#354B68]/55" />
                    </>
                  )}

                  <div className="absolute inset-4 rounded-[18px] border-[3px] border-dashed border-white/45" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0A7B4E] shadow-[0_10px_20px_rgba(10,123,78,0.25)]">
                      <Camera size={25} />
                    </div>
                    <p className="mt-4 text-[18px] font-bold text-white">
                      Drop image here or{" "}
                      <span className="font-black underline underline-offset-4">
                        browse
                      </span>
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-white/80">
                      Supports JPG, PNG and WEBP
                    </p>
                    {fileName !== "Upload Meal Photo" && (
                      <p className="mt-2 max-w-[80%] truncate text-[12px] font-black text-[#D9FBE9]">
                        {fileName}
                      </p>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Optional note for your coach..."
                  className="mt-4 h-20 w-full resize-none rounded-[14px] border border-[#D8E2DD] bg-[#F5F8F6] px-4 py-3 text-[13px] font-semibold text-[#32443C] placeholder:text-[#8A9B93] outline-none focus:border-[#0A7B4E]/40"
                />

                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#0A4F48] py-4 text-[22px] font-black text-white shadow-[0_14px_25px_rgba(8,123,68,0.25)] transition-all hover:bg-[#073d2d] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <CheckCircle2 size={20} />
                  {uploading ? "Submitting..." : "Submit Diet"}
                </button>

                <div className="mt-3 flex justify-center">
                  <button
                    onClick={() => setShowSkipConfirm(true)}
                    className="text-[18px] font-bold text-[#5F7269] transition-colors hover:text-[#0A7B4E]"
                  >
                    Skip Meal →
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "mt-6 rounded-[18px] border p-5 text-center",
                  statusConfig[selectedMealStatus]?.panelClass,
                )}
              >
                <p className="text-[18px] font-black uppercase tracking-[0.08em] text-[#1F2F27]">
                  {statusConfig[selectedMealStatus]?.label || "Completed"}
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#5F7269]">
                  {statusConfig[selectedMealStatus]?.message}
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-[#E4ECE7] pt-4">
              <div className="text-[12px] font-bold text-[#6D7E76]">
                Current streak: <span className="text-[#0A7B4E]">{streak} days</span>
              </div>
              {dietPlanPdf && (
                <button
                  onClick={handleViewAssignedMealPdf}
                  className="inline-flex items-center gap-1 rounded-full border border-[#CFE0D6] bg-[#F4F8F5] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#0A7B4E] transition-all hover:bg-[#EAF2ED]"
                >
                  View Plan
                </button>
              )}
            </div>
          </section>
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

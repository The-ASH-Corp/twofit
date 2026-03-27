import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Upload, 
  UtensilsCrossed, 
  Clock, 
  TrendingUp, 
  Droplets, 
  Apple, 
  Moon, 
  Camera, 
  Check, 
  ChevronRight,
  Utensils,
  Smartphone,
  Info,
  Calendar
} from "lucide-react";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { assets } from "@/assets/asset";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import { getClient } from "@/redux/features/client/client.thunk";
import { getProgramById } from "@/redux/features/program/program.thunk";
import {
  getUserTaskStatus,
  uploadTask,
} from "@/redux/features/tasks/task.thunk";
import MobileBottomNav from "../components/MobileBottomNav";
import { cn } from "@/lib/utils";

const MEAL_LABELS = [
  { label: "BREAKFAST", time: "08:00 AM", icon: Apple },
  { label: "LUNCH", time: "01:00 PM", icon: Utensils },
  { label: "SNACK", time: "04:30 PM", icon: Apple },
  { label: "DINNER", time: "07:30 PM", icon: Moon },
];

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
  const autoSkippedPreviousDayRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);

        const programId =
          typeof user?.programType === "object"
            ? user?.programType?._id
            : user?.programType;

        const [, programData] = await Promise.all([
          user?._id ? dispatch(getClient({ id: user._id })).unwrap() : Promise.resolve(),
          programId ? dispatch(getProgramById(programId)).unwrap() : Promise.resolve(null),
          dispatch(getUserTaskStatus()).unwrap(),
        ]);

        if (programData) setProgram(programData.data);
      } catch (error) {
        console.error("Failed to load diet page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [dispatch, user?._id, user?.programType]);

  const currentGlobalDay =
    clientUser?.currentGlobalDay || user?.currentGlobalDay || 1;
  const dietPlanPdf = clientUser?.dietPlanPdf || user?.dietPlanPdf;

  const isProgramStarted = useMemo(() => {
    const startDate = clientUser?.programStartDate || user?.programStartDate;
    if (!startDate) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    return today >= start;
  }, [clientUser?.programStartDate, user?.programStartDate]);

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

      return {
        name: MEAL_LABELS[index]?.label || `Meal ${index + 1}`,
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

  const selectedTask = dietTasks[selectedIndex] || null;

  const selectedMealStatus = selectedTask?.status || "todo";

  const totalSkippedMeals = useMemo(
    () =>
      (tasks || []).filter(
        (task) => task.taskType === "Meal" && task.status === "skipped",
      ).length,
    [tasks],
  );

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
            LEFT COLUMN (Banner + Progression)
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
                {selectedTask?.name === "LUNCH" ? "Mindful Lunch Protocol" : `${selectedTask?.name} Protocol`}
              </h1>
              <p className="text-white/80 font-bold text-sm lg:text-base mt-2 lg:mt-4 leading-relaxed max-w-xl">
                Precision-balanced nutrients for optimal cognitive performance and sustained energy levels throughout the afternoon.
              </p>
            </div>
            
            <div className="absolute top-8 left-8 lg:top-10 lg:left-10 z-20">
               <button onClick={() => window.history.back()} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white hover:text-[#0A4F48] transition-all">
                  <span className="text-xl font-bold">‹</span>
               </button>
            </div>
          </div>

          {/* Daily Progression Stepper */}
          <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#0A4F48]/5 group">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-[#0A4F48] font-black text-2xl lg:text-2xl tracking-tighter">
                Daily Progression
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[#0A4F48] font-black text-xl lg:text-xl">65% Completed</span>
              </div>
            </div>

            <div className="relative flex justify-between items-start pt-4 px-4 lg:px-8">
              {/* Connector Lines */}
              <div className="absolute top-[34px] left-16 right-16 h-1 bg-gray-100 z-0" />
              <div className="absolute top-[34px] left-16 w-1/3 h-1 bg-[#0A4F48] z-0" />

              {MEAL_LABELS.map((item, idx) => {
                 const isActive = idx === selectedIndex;
                 const isCompleted = tasks?.some(t => t.exerciseIndex === (100 + idx) && t.status === "verified");
                 const Icon = item.icon;

                 return (
                   <div key={idx} className="flex flex-col items-center gap-4 relative z-10 w-24">
                      <button
                        onClick={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform",
                          isActive ? "bg-[#0A4F48] scale-115 shadow-xl shadow-[#0A4F48]/30 border-4 border-white" : 
                          isCompleted ? "bg-[#0A4F48] text-white" : 
                          "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        )}
                      >
                        {isCompleted ? (
                          <Check size={24} strokeWidth={4} />
                        ) : (
                          <Icon size={isActive ? 28 : 24} className={isActive ? "text-[#71FEE2]" : ""} />
                        )}
                      </button>
                      
                      <div className="text-center">
                        <h4 className={cn(
                          "text-[9px] lg:text-[10px] font-black tracking-widest uppercase transition-colors",
                          isActive ? "text-[#0A4F48]" : "text-gray-400"
                        )}>
                          {item.label}
                        </h4>
                        <p className={cn(
                          "text-[9px] font-bold mt-1 uppercase",
                          isActive ? "text-[#0A4F48]" : "text-gray-300"
                        )}>
                          {isActive ? "In Progress" : item.time}
                        </p>
                      </div>
                   </div>
                 );
              })}
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN (Submission + Summary)
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
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                   </div>
                   <p className="text-gray-600 font-bold text-xs lg:text-sm leading-snug">
                      Validation required for AI nutrient tracking
                   </p>
                </div>
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
                  className="w-full rounded-[32px] border-none bg-gray-50 px-6 py-5 text-sm font-bold text-gray-700 placeholder-gray-400/60 focus:ring-0 resize-none h-32 transition-all shadow-inner"
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

          {/* Diet Summary Card */}
          <div className="bg-[#0A4F48] rounded-[48px] p-8 lg:p-10 shadow-2xl shadow-[#0A4F48]/20 flex flex-col gap-10">
            <h3 className="text-[#71FEE2] font-black text-[9px] uppercase tracking-[0.3em] pl-1">
               Diet Summary
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-6 lg:p-7 relative overflow-hidden group border border-white/5">
                  <h4 className="text-white/40 font-black text-[9px] uppercase tracking-widest mb-2">Meals Assigned</h4>
                  <p className="text-white font-black text-3xl tracking-tighter">24</p>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#71FEE2]" />
               </div>
               <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-6 lg:p-7 relative overflow-hidden group border border-white/5">
                  <h4 className="text-white/40 font-black text-[9px] uppercase tracking-widest mb-2">Meals Skipped</h4>
                  <p className="text-white font-black text-3xl tracking-tighter">02</p>
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-400" />
               </div>
            </div>

            <div className="flex items-center gap-4 pl-1">
               <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#71FEE2]">
                  <TrendingUp size={20} />
               </div>
               <p className="text-white/90 font-black text-sm tracking-tight leading-tight">
                  92% Compliance rate this<br className="hidden lg:block"/>week
               </p>
            </div>
          </div>

          {/* Hydration Tip */}
          <div className="bg-[#FFE5D2] rounded-[32px] p-8 lg:p-10 flex items-center gap-6 group hover:translate-y-[-4px] transition-transform shadow-sm">
             <div className="w-14 h-14 rounded-2xl bg-[#CC895B]/10 flex items-center justify-center text-[#845E47] shrink-0">
                <Droplets size={28} strokeWidth={2.5} />
             </div>
             <div>
                <h4 className="text-[#845E47]/40 font-black text-[9px] uppercase tracking-[0.2em] mb-2">Hydration Tip</h4>
                <p className="text-[#845E47] font-black text-[13px] lg:text-[14px] leading-snug tracking-tight">
                   Drink 250ml of water before this meal.
                </p>
             </div>
          </div>
        </div>
      </div>
      
      {/* Page Footer */}
      <div className="w-full text-center pb-20 mt-12">
         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
            Precision Wellness Protocol © 2024 Vitalist Pro System
         </p>
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

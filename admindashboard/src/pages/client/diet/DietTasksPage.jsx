import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CheckCircle2, PlayCircle, Upload, UtensilsCrossed } from "lucide-react";
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

const MEAL_LABELS = [
  "Morning",
  "Lunch",
  "Evening",
  "Dinner",
  "Post Dinner",
  "Extra Meal",
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
        name: MEAL_LABELS[index] || `Meal ${index + 1}`,
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
    <>
      <div className="w-full grid lg:grid-cols-[1.5fr_1fr] grid-cols-1 gap-6 p-4 lg:p-2 pb-24 lg:pb-2">
        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 border border-[#0A4F48]/10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-[#0A4F48] font-bold text-xl">Diet</h1>
              <p className="text-sm text-gray-500">Day {currentGlobalDay} meal tasks</p>
            </div>
            {selectedMealStatus !== "todo" && statusConfig[selectedMealStatus] && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${statusConfig[selectedMealStatus].pillClass}`}
              >
                {statusConfig[selectedMealStatus].label}
              </span>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={handleViewAssignedMealPdf}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#0A4F48]/20 text-[#0A4F48] hover:bg-[#E6EEED]"
              >
                View Meal PDF
              </button>
              <Link
                to="/client"
                className="text-xs font-bold text-[#0A4F48] hover:text-[#083b36]"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
            <img
              src={selectedIndex === 0 ? assets.breakfast : assets.MealPlaceholder}
              alt="Meal"
              className="w-full aspect-video object-cover"
            />
          </div>

          <div className="mt-4 bg-[#F8FAFC] rounded-xl p-3 border border-gray-100">
            <h2 className="text-[#0A4F48] font-bold text-sm">Current Meal Task</h2>
            <p className="text-gray-700 font-semibold text-sm mt-1">{selectedTask?.name || "No meal task"}</p>
            <p className="text-gray-500 text-xs mt-1">{selectedTask?.notes || "Upload your meal image for review."}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 border border-[#0A4F48]/10 h-fit">
          <h2 className="text-[#0A4F48] font-bold text-base mb-3">Diet Tasks</h2>
          <p className="text-xs text-gray-500 mb-4">Select a meal task and upload image proof. Video is not used for diet tasks.</p>

          <div className="space-y-2">
            {dietTasks.length ? (
              dietTasks.map((task, idx) => {
                const active = idx === selectedIndex;
                const taskStatus = task.status || "todo";
                const taskStatusStyles =
                  taskStatus === "verified"
                    ? "bg-green-100 text-green-700"
                    : taskStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : taskStatus === "skipped"
                        ? "bg-orange-100 text-orange-800"
                      : taskStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600";

                return (
                  <button
                    key={`${task.name}-${idx}`}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${
                      active
                        ? "border-[#0A4F48] bg-[#E6EEED]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#0A4F48] truncate">{task.name}</p>
                        <span className={`inline-block text-[10px] font-bold uppercase mt-1 px-2 py-0.5 rounded-full ${taskStatusStyles}`}>
                          {taskStatus}
                        </span>
                      </div>
                      <PlayCircle size={16} className="text-[#0A4F48] shrink-0" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                No diet tasks available for today.
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-[#F4DBC7]/50 p-3 border border-[#F4DBC7]">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={15} className="text-[#0A4F48]" />
              <p className="text-xs font-semibold text-[#0A4F48]">Diet Summary</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {dietTasks.length} meals assigned for today.
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Skipped meals: <span className="font-semibold">{totalSkippedMeals}</span>
            </p>
          </div>
        </div>
      </div>

      {shouldShowSubmissionForm && (
        <div className="mx-4 lg:mx-2 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#0A4F48]/10 p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E6EEED] flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-[#0A4F48]" />
              </div>
              <div>
                <h2 className="text-[#0A4F48] font-bold text-base">Submit Diet Proof</h2>
                <p className="text-xs text-gray-500">Upload meal photo and optional notes.</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-[#0A4F48] mb-2">Notes (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Any details about your meal choices..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-[#0A4F48] mb-2">Upload Meal Photo (Image Only)</label>
              <button
                type="button"
                onClick={handleOpenFilePicker}
                className="flex items-center gap-3 w-full rounded-xl border-2 border-dashed border-[#0A4F48]/30 px-4 py-3 cursor-pointer hover:bg-[#E6EEED]/30 transition-colors"
              >
                <Upload size={18} className="text-[#0A4F48] shrink-0" />
                <span className="text-sm font-medium text-gray-600 truncate min-w-0">{fileName}</span>
              </button>
              <input
                ref={fileInputRef}
                id="diet-proof-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSubmit}
                disabled={uploading || skippingMeal}
                className="w-full bg-[#0A4F48] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-bold transition-colors"
              >
                {uploading ? "Submitting..." : "Submit Diet"}
              </button>
              <button
                onClick={() => setShowSkipConfirm(true)}
                disabled={uploading || skippingMeal}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 disabled:opacity-60"
              >
                {skippingMeal ? "Skipping..." : "Skip Meal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {(selectedMealStatus === "pending" || selectedMealStatus === "verified" || selectedMealStatus === "rejected" || selectedMealStatus === "skipped") && (
        <div className="mx-4 lg:mx-2 mb-4">
          <div className={`rounded-2xl border shadow-sm p-6 text-center ${statusConfig[selectedMealStatus].panelClass}`}>
            <CheckCircle2 size={40} className="text-[#0A4F48] mx-auto mb-3" />
            <h3 className="text-[#0A4F48] font-bold text-lg">
              {selectedTask?.name || "Meal"} Status: {statusConfig[selectedMealStatus].label}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {statusConfig[selectedMealStatus].message}
            </p>
          </div>
        </div>
      )}

      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 border border-gray-200 shadow-xl">
            <h3 className="text-base font-bold text-[#0A4F48]">Skip This Meal?</h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to skip <span className="font-semibold">{selectedTask?.name || "this meal"}</span>? This action marks the meal as skipped.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSkipConfirm(false)}
                disabled={skippingMeal}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSkipMeal}
                disabled={skippingMeal}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                {skippingMeal ? "Skipping..." : "Yes, Skip"}
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </>
  );
}

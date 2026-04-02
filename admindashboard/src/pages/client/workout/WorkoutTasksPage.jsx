import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Check,
  CheckCircle2,
  Clock3,
  Expand,
  ImagePlus,
  Lightbulb,
  ListChecks,
  Lock,
  Pause,
  PlayCircle,
  SendHorizontal,
  SkipBack,
  SkipForward,
  Volume2,
  Zap,
} from "lucide-react";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import { getClient } from "@/redux/features/client/client.thunk";
import { getProgramById } from "@/redux/features/program/program.thunk";
import {
  getUserTaskStatus,
  uploadMultipleWorkoutTasks,
} from "@/redux/features/tasks/task.thunk";
import MobileBottomNav from "../components/MobileBottomNav";
import { cn } from "@/lib/utils";

const rpeScale = Array.from({ length: 10 }, (_, index) => ({
  value: index + 1,
}));

const formatTaskTarget = (task) => {
  const sets = Number(task?.sets) || Number(task?.setCount) || 3;
  const rawReps = task?.reps ?? task?.targetReps ?? task?.target ?? 12;

  if (typeof rawReps === "number") {
    return `${sets} sets • ${rawReps} reps`;
  }

  const repsText = String(rawReps).trim();
  return `${sets} sets • ${repsText || "12 reps"}`;
};

export default function WorkoutTasksPage() {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const clientUser = useAppSelector(selectSelectedClient);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Upload File");
  const [comment, setComment] = useState("");
  const [effortRating, setEffortRating] = useState(null);
  const [uploading, setUploading] = useState(false);
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
          user?._id
            ? dispatch(getClient({ id: user._id })).unwrap()
            : Promise.resolve(),
          programId
            ? dispatch(getProgramById(programId)).unwrap()
            : Promise.resolve(null),
          dispatch(getUserTaskStatus()).unwrap(),
        ]);

        if (programData) setProgram(programData.data);
      } catch (error) {
        console.error("Failed to load workout page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [dispatch, user?._id, user?.programType]);

  const currentGlobalDay =
    clientUser?.currentGlobalDay || user?.currentGlobalDay || 1;

  const isProgramStarted = useMemo(() => {
    const startDate = clientUser?.programStartDate || user?.programStartDate;
    if (!startDate) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    return today >= start;
  }, [clientUser?.programStartDate, user?.programStartDate]);

  const workoutTasks = useMemo(() => {
    const days =
      program?.plan?.weeks?.flatMap((week, weekIndex) =>
        week.days.map((day, dayIndex) => ({
          ...day,
          weekIndex: weekIndex + 1,
          dayIndex: dayIndex + 1,
          globalIndex: weekIndex * 7 + dayIndex + 1,
        })),
      ) || [];

    const currentDayData = days[currentGlobalDay - 1];

    return (
      currentDayData?.exercises?.map((exercise, index) => {
        const submission = tasks?.find(
          (task) =>
            task.globalDayIndex === currentGlobalDay &&
            task.exerciseIndex === index &&
            task.taskType === "Workout",
        );

        return {
          ...exercise,
          index,
          exerciseIndex: index,
          status: submission?.status || "todo",
          programId: program?._id,
          weekIndex: currentDayData?.weekIndex,
          dayIndex: currentDayData?.dayIndex,
          globalDayIndex: currentGlobalDay,
        };
      }) || []
    );
  }, [currentGlobalDay, program?._id, program?.plan?.weeks, tasks]);

  const selectedTask = workoutTasks[selectedIndex] || null;

  const isUnlocked = (idx) => {
    if (idx === 0) return true;
    return watchedVideos.has(idx - 1);
  };

  const handleTaskClick = (idx) => {
    if (!isUnlocked(idx)) {
      toast.info("Please complete the previous exercise video first.");
      return;
    }
    setSelectedIndex(idx);
  };

  const allVideosWatched =
    workoutTasks.length > 0 &&
    workoutTasks.every((task, idx) => !task.url || watchedVideos.has(idx));

  const overallWorkoutStatus = useMemo(() => {
    if (!workoutTasks.length) return "todo";

    const statuses = workoutTasks.map((task) => task.status || "todo");
    const allVerified = statuses.every((status) => status === "verified");
    const anyPending = statuses.some((status) => status === "pending");
    const anyRejected = statuses.some((status) => status === "rejected");

    if (allVerified) return "verified";
    if (anyPending) return "pending";
    if (anyRejected) return "rejected";
    return "todo";
  }, [workoutTasks]);

  const shouldShowSubmissionForm =
    allVideosWatched &&
    overallWorkoutStatus !== "pending" &&
    overallWorkoutStatus !== "verified";

  const handleVideoEnd = () => {
    if (!selectedTask) return;

    setWatchedVideos((prev) => {
      const next = new Set(prev);
      next.add(selectedTask.index);
      return next;
    });

    const nextIndex = selectedTask.index + 1;
    if (nextIndex < workoutTasks.length) {
      setTimeout(() => {
        setSelectedIndex(nextIndex);
      }, 1500);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.info("Please explicitly upload a log photo/video.");
      return;
    }
    if (!effortRating) {
      toast.info("Please select your RPE effort level (1–10).");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", comment);
      formData.append(
        "effortRating",
        JSON.stringify({
          ratingNumber: effortRating,
          ratingLabel: effortRating > 6 ? "Hard" : "Easy",
        }),
      );

      const exerciseIndices = workoutTasks.map((t) => t.exerciseIndex);
      formData.append("exerciseIndices", JSON.stringify(exerciseIndices));
      formData.append("programId", workoutTasks[0]?.programId || "");
      formData.append("weekIndex", workoutTasks[0]?.weekIndex || 1);
      formData.append("dayIndex", workoutTasks[0]?.dayIndex || 1);
      formData.append("globalDayIndex", workoutTasks[0]?.globalDayIndex || 1);

      const result = await dispatch(uploadMultipleWorkoutTasks(formData));
      if (uploadMultipleWorkoutTasks.fulfilled.match(result)) {
        toast.success("Workout submitted successfully!");
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

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setFileName(selected.name);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const clientStatus = clientUser?.status || user?.status;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <SyncLoader color="#0A4F48" loading margin={2} size={16} />
      </div>
    );
  }

  if (!isProgramStarted) {
    return (
      <>
        <div className="mx-auto mt-20 max-w-lg rounded-[32px] border border-[#0A4F48]/10 bg-white p-8 text-center shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-black text-[#0A4F48]">Program Not Started</h2>
          <p className="mt-2 font-medium text-gray-500">
            Workout tasks will appear once your program begins.
          </p>
        </div>
        <MobileBottomNav />
      </>
    );
  }

  if (clientStatus === "Inactive") {
    return (
      <>
        <div className="mx-auto mt-20 max-w-lg rounded-[32px] border border-[#0A4F48]/10 bg-white p-8 text-center shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-black text-[#0A4F48]">Account Inactive</h2>
          <p className="mt-2 font-medium text-gray-500">
            Please contact admin to reactivate your account to perform workouts.
          </p>
        </div>
        <MobileBottomNav />
      </>
    );
  }

  const handlePlaySimulate = () => {
    const videoElement = document.querySelector("video");
    if (!videoElement) return;
    if (videoElement.paused) {
      void videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  const completionProgress = workoutTasks.length
    ? Math.round((watchedVideos.size / workoutTasks.length) * 100)
    : 0;
  const pendingTasksCount = Math.max(workoutTasks.length - watchedVideos.size, 0);
  const estimatedCalories = Math.max(workoutTasks.length * 120 + 2, 0);
  const avgHeartRate = effortRating ? 118 + effortRating * 3 : 142;

  return (
    <div className="min-h-screen bg-[#EEF3F0] pb-32">
      <div className="mx-auto max-w-[1380px] p-4 lg:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <section className="client-card rounded-[30px] p-4 sm:p-5">
              <div className="relative overflow-hidden rounded-[22px] bg-black">
                {selectedTask?.url ? (
                  <video
                    key={`video-${selectedIndex}`}
                    autoPlay
                    controlsList="nodownload noremoteplayback"
                    onEnded={handleVideoEnd}
                    className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[560px]"
                    src={selectedTask.url?.replace(/^http:\/\//i, "https://")}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex h-[320px] w-full flex-col items-center justify-center gap-3 bg-linear-to-br from-[#0A4F48] to-[#116D63] text-white sm:h-[420px] lg:h-[560px]">
                    <PlayCircle size={56} className="opacity-40" />
                    <p className="text-[14px] font-black opacity-80">
                      No video assigned for this exercise
                    </p>
                  </div>
                )}

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-[6px] w-full rounded-full bg-white/35">
                    <div
                      className="h-full rounded-full bg-[#0A7B4E] transition-all duration-500"
                      style={{ width: `${Math.max(completionProgress, 8)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF4F1] text-[#43564E]">
                    <SkipBack size={18} />
                  </button>
                  <button
                    onClick={handlePlaySimulate}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#087B44] text-white shadow-[0_14px_24px_rgba(8,123,68,0.34)]"
                  >
                    <Pause size={22} fill="currentColor" />
                  </button>
                  <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF4F1] text-[#43564E]">
                    <SkipForward size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 rounded-full bg-[#EFF4F1] px-4 py-3">
                    <Volume2 size={18} className="text-[#667971]" />
                    <div className="h-1.5 w-24 rounded-full bg-[#D7E2DC] sm:w-32">
                      <div className="h-full w-[70%] rounded-full bg-[#0A7B4E]" />
                    </div>
                  </div>
                  <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF4F1] text-[#43564E]">
                    <Expand size={18} />
                  </button>
                </div>
              </div>
            </section>

            {shouldShowSubmissionForm && (
              <>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <section className="client-card rounded-[28px] p-5 sm:p-6">
                    <h3 className="text-[22px] font-black text-[#24342D]">
                      Session Notes
                    </h3>
                    <textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Log your workout reflection for this session."
                      className="mt-4 h-[180px] w-full resize-none rounded-[18px] border border-[#E0E8E3] bg-[#F1F5F2] px-4 py-4 text-[16px] font-medium text-[#4A5D55] outline-none transition-all focus:border-[#0A7B4E]/45"
                    />
                  </section>

                  <section className="client-card rounded-[28px] p-5 sm:p-6">
                    <h3 className="text-[22px] font-black text-[#24342D]">
                      Log Visual Progress
                    </h3>
                    <button
                      onClick={handleOpenFilePicker}
                      className="mt-4 flex h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[18px] border-2 border-dashed border-[#D9E3DD] bg-[#F2F6F3] px-4 text-center transition-all hover:border-[#0A7B4E]/40 hover:bg-[#EEF5F0]"
                    >
                      {file ? (
                        <>
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E2F1E9] text-[#087B44]">
                            <Check size={24} strokeWidth={3} />
                          </span>
                          <p className="max-w-[220px] truncate text-[15px] font-black text-[#2A3A34]">
                            {fileName}
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#087B44] shadow-[0_8px_14px_rgba(17,38,29,0.12)]">
                            <ImagePlus size={24} />
                          </span>
                          <p className="text-[16px] font-semibold text-[#5F7168]">
                            Drop progress photo or click to upload
                          </p>
                        </>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </section>
                </div>

                <FinishStrongForm
                  effortRating={effortRating}
                  setEffortRating={setEffortRating}
                  shouldShowSubmissionForm={shouldShowSubmissionForm}
                />
              </>
            )}
          </div>

          <div className="space-y-6">
            <section className="client-card rounded-[30px] p-5 sm:p-6">
              <h3 className="inline-flex items-center gap-3 text-[26px] leading-none font-black text-[#25352E] sm:text-[28px] lg:text-[32px]">
                <ListChecks size={22} className="text-[#087B44]" />
                Workout Tasks
              </h3>

              <div className="mt-5 space-y-3">
                {workoutTasks.map((task, idx) => {
                  const isCompleted = watchedVideos.has(idx) || idx < selectedIndex;
                  const isActive = idx === selectedIndex;
                  const unlocked = isUnlocked(idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleTaskClick(idx)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[16px] border px-4 py-4 text-left transition-all",
                        isActive &&
                          "border-[#0A7B4E]/40 bg-[#ECF5EF] shadow-[inset_3px_0_0_#0A7B4E]",
                        isCompleted && "border-[#D8E6DE] bg-[#F3F8F5]",
                        !isActive && !isCompleted && "border-[#E3EAE6] bg-[#F6F8F7]",
                        !unlocked && "opacity-50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                          isCompleted && "bg-[#087B44] text-white",
                          isActive && "bg-white text-[#087B44]",
                          !isCompleted && !isActive && "bg-white text-[#8EA098]",
                        )}
                      >
                        {isCompleted ? (
                          <Check size={20} strokeWidth={3} />
                        ) : isActive ? (
                          <Zap size={20} fill="currentColor" />
                        ) : unlocked ? (
                          <Clock3 size={18} />
                        ) : (
                          <Lock size={16} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-[17px] font-black leading-none text-[#2B3B34] sm:text-[18px] lg:text-[20px]",
                            isCompleted && "line-through decoration-2 opacity-60",
                          )}
                        >
                          {task.name || `Exercise ${idx + 1}`}
                        </p>
                        <p className="mt-1 text-[11px] font-black uppercase tracking-[0.04em] text-[#0A7B4E] sm:text-[12px] lg:text-[13px]">
                          {formatTaskTarget(task)}
                        </p>
                      </div>

                      {isActive && (
                        <span className="rounded-full bg-[#E0E8E3] px-3 py-1 text-[10px] font-black text-[#6A7B73] sm:text-[11px] lg:text-[12px]">
                          SET {idx + 1}/{workoutTasks.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-[#DDE6E0] pt-5 text-[16px] font-black text-[#2B3B34] sm:text-[17px] lg:text-[20px]">
                <div className="flex items-end justify-between">
                  <span>Total Calories Burned</span>
                  <span className="text-[#087B44]">{estimatedCalories} kcal</span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <span>Heart Rate (Avg)</span>
                  <span className="text-[#087B44]">{avgHeartRate} bpm</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={uploading || !shouldShowSubmissionForm}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#087B44] py-3.5 text-[18px] font-black text-white shadow-[0_14px_25px_rgba(8,123,68,0.26)] transition-all hover:bg-[#076d3d] disabled:cursor-not-allowed disabled:bg-[#A9BDB3] sm:text-[19px] lg:text-[22px]"
              >
                {uploading ? "Submitting..." : "Complete My Workout"}
                {!uploading && <SendHorizontal size={18} />}
              </button>
              {!shouldShowSubmissionForm && (
                <p className="mt-3 text-center text-[13px] font-bold text-[#70827A] sm:text-[14px] lg:text-[17px]">
                  {pendingTasksCount > 0
                    ? `${pendingTasksCount} exercise video${pendingTasksCount === 1 ? "" : "s"} left to unlock submission`
                    : "Submission locked until all videos are completed"}
                </p>
              )}
            </section>

            <section className="client-card rounded-[30px] border border-[#CDE2D4] bg-[#F0F8F3] p-5 sm:p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[13px] font-black uppercase tracking-[0.08em] text-[#087B44]">
                <Lightbulb size={14} />
                Coach Insight
              </div>
              <p className="mt-4 text-[17px] font-semibold leading-relaxed text-[#4D6158]">
                Keep your core tight during every pressing movement and drive
                from your feet to maintain stable force output through the set.
              </p>
            </section>
          </div>
        </div>

        {overallWorkoutStatus !== "todo" && (
          <div className="mt-6">
            <div className="rounded-[24px] border border-[#DDE6E0] bg-white p-6 text-center">
              <CheckCircle2
                size={36}
                className={cn(
                  "mx-auto",
                  overallWorkoutStatus === "verified"
                    ? "text-[#0A7B4E]"
                    : "text-yellow-500",
                )}
              />
              <h3 className="mt-3 text-[26px] font-black text-[#24342D]">
                Workout {overallWorkoutStatus}
              </h3>
              <p className="mt-1 text-[16px] font-medium text-[#667871]">
                {overallWorkoutStatus === "verified"
                  ? "Great job, your form looked excellent on those reps!"
                  : "Awesome burn! Sent to your coach for review."}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="block h-10 w-full lg:hidden" />
      <MobileBottomNav />
    </div>
  );
}

function FinishStrongForm({
  effortRating,
  setEffortRating,
  shouldShowSubmissionForm,
}) {
  return (
    <section className="client-card rounded-[28px] p-5 sm:p-6">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-[28px] leading-none font-black text-[#25352E] sm:text-[34px] lg:text-[42px]">
            Effort Intensity (RPE)
          </h3>
          <p className="mt-1 text-[16px] font-medium text-[#6D7E76]">
            Rate your perceived exertion for this session
          </p>
        </div>
        <div className="text-right">
          <p className="text-[36px] leading-none font-black text-[#087B44] sm:text-[44px] lg:text-[50px]">
            {effortRating || 0}
            <span className="text-[24px] text-[#6D7E76]">/10</span>
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {rpeScale.map(({ value }) => {
          const active = effortRating === value;

          return (
            <button
              key={value}
              type="button"
              disabled={!shouldShowSubmissionForm}
              onClick={() => setEffortRating(value)}
              className={cn(
                "rounded-[12px] py-3 text-[16px] font-black transition-all",
                active
                  ? "bg-[#087B44] text-white shadow-[0_10px_16px_rgba(8,123,68,0.35)]"
                  : "bg-[#F0F4F1] text-[#5D7067]",
                !shouldShowSubmissionForm && "cursor-not-allowed opacity-70",
              )}
            >
              {value}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px] font-black uppercase tracking-[0.16em] text-[#889890]">
        <span>Minimal Effort</span>
        <span>Max Intensity</span>
      </div>
    </section>
  );
}

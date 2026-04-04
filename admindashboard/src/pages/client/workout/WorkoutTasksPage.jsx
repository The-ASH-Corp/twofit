import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CalendarDays,
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

const rpeScale = [
  {
    value: 1,
    title: "VERY LIGHT",
    description:
      "Minimal effort; no noticeable change in breathing or heart rate.",
  },
  {
    value: 2,
    title: "LIGHT",
    description: "Feels easy and relaxed; effortless conversation possible.",
  },
  {
    value: 3,
    title: "MODERATE",
    description:
      "Activity is easy to maintain; can converse with minimal effort.",
  },
  {
    value: 4,
    title: "SOMEWHAT HARD",
    description:
      "Moderate; a comfortable activity level that still feels like you're doing something.",
  },
  {
    value: 5,
    title: "HARD",
    description:
      "Noticeable increase in effort; breathing heavily but can maintain activity and short conversation.",
  },
  {
    value: 6,
    title: "MODERATELY HARD",
    description:
      "A step up in effort and intensity; speaking in full sentences is difficult.",
  },
  {
    value: 7,
    title: "VIGOROUS",
    description:
      "Strenuous activity; conversation is possible, but it's very labored.",
  },
  {
    value: 8,
    title: "VERY HARD",
    description:
      "Intense activity that you can sustain, but it's challenging to maintain conversation.",
  },
  {
    value: 9,
    title: "EXTREMELY HARD",
    description:
      "Very challenging; very short bouts only; conversation is impossible.",
  },
  {
    value: 10,
    title: "MAXIMUM EFFORT",
    description:
      "Activity is almost impossible to sustain; you are out of breath and unable to talk.",
  },
];

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
  const [isStarted, setIsStarted] = useState(false);
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
    setIsStarted(true); // Automatically engage session once a task is manually clicked
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
          ratingLabel:
            rpeScale.find((r) => r.value === effortRating)?.title ||
            String(effortRating),
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
          <h2 className="text-xl font-black text-[#0A4F48]">
            Program Not Started
          </h2>
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
          <h2 className="text-xl font-black text-[#0A4F48]">
            Account Inactive
          </h2>
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
  const pendingTasksCount = Math.max(
    workoutTasks.length - watchedVideos.size,
    0,
  );
  const estimatedCalories = Math.max(workoutTasks.length * 120 + 2, 0);
  const avgHeartRate = effortRating ? 118 + effortRating * 3 : 142;

  const todayDisplay = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="client-page-container">
      <div className="client-page-shell">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          {/* <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0A7B4E]">
              Current Module
            </p>
            <h1 className="mt-1 text-[36px] leading-none font-black tracking-tight text-[#1E2C26] sm:text-[48px] lg:text-[56px]">
              Day {currentGlobalDay} Workout Videos
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#DFE7E3] bg-[#F5F9F7] px-4 py-2 text-[13px] font-black text-[#5D6E66]">
            <CalendarDays size={16} className="text-[#0A7B4E]" />
            {todayDisplay}
          </div> */}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            {/* Focal Player Area */}
            <section className="client-card rounded-[32px] overflow-hidden p-0 bg-black border-0 shadow-2xl shadow-emerald-900/10 transition-all duration-700">
              <div className="relative group">
                {selectedTask?.url ? (
                  <div className="relative h-[280px] w-full sm:h-[340px] lg:h-[400px]">
                    <video
                      key={`video-main-${selectedIndex}`}
                      autoPlay={isStarted}
                      controls={isStarted}
                      controlsList="nodownload"
                      onEnded={handleVideoEnd}
                      className={cn(
                        "h-full w-full object-contain transition-all duration-700",
                        !isStarted && "blur-[8px] opacity-40 grayscale-[0.8]",
                      )}
                      src={selectedTask.url}
                    >
                      Your browser does not support the video tag.
                    </video>

                    {!isStarted && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-[2px]">
                        <div
                          className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-[#0A7B4E] text-white shadow-[0_0_50px_rgba(10,123,78,0.4)] animate-pulse hover:scale-110 transition-transform cursor-pointer group/start"
                          onClick={() => setIsStarted(true)}
                        >
                          <PlayCircle
                            size={48}
                            fill="currentColor"
                            className="ml-1"
                          />
                        </div>
                        <h3 className="mt-8 text-[32px] font-black text-white uppercase tracking-tight text-center drop-shadow-2xl">
                          Ready for your session?
                        </h3>
                        <p className="mt-2 text-[14px] font-bold text-emerald-100/70 uppercase tracking-[0.2em] text-center">
                          Day {currentGlobalDay} • {workoutTasks.length}{" "}
                          Handpicked Drills
                        </p>
                        <button
                          onClick={() => setIsStarted(true)}
                          className="mt-8 px-10 py-4 bg-white text-[#0A7B4E] text-[15px] font-black uppercase tracking-widest rounded-full shadow-2xl hover:bg-emerald-50 transition-colors shadow-emerald-900/40"
                        >
                          Start My Workout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[280px] w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-[#0F2D26] to-[#0A4F48] text-white/90 sm:h-[340px] lg:h-[400px]">
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10">
                      <PlayCircle size={32} className="opacity-40" />
                    </div>
                    <p className="text-[14px] font-black uppercase tracking-widest opacity-60">
                      No guide video assigned
                    </p>
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute top-0 left-0 right-0 p-6 bg-linear-to-b from-black/80 to-transparent flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A7B4E] drop-shadow-sm">
                      Now Performing
                    </p>
                    <h2 className="text-[20px] font-black text-white leading-tight drop-shadow-md">
                      {selectedTask?.name || "Ready to Start"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0A7B4E] animate-pulse" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                      {selectedIndex + 1}/{workoutTasks.length}
                    </span>
                  </div>
                </div>

                {/* Progress Bar At Bottom of Video */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
                  <div
                    className="h-full bg-linear-to-r from-[#0A7B4E] to-[#0D6B44] transition-all duration-500 shadow-[0_0_10px_rgba(10,123,78,0.5)]"
                    style={{ width: `${completionProgress}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Active Focal Module Detail */}
            <div className="client-card rounded-[24px] border border-[#E8EEEB] bg-[#FCFDFC] p-6 sm:p-7 shadow-[0_6px_24px_rgba(30,44,38,0.02)]">
              <div className="inline-flex items-center rounded-full border border-[#D1E0D7] bg-[#F5F9F7] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-[#0A7B4E]">
                Active Focal Module
              </div>
              <h2 className="mt-4 text-[22px] leading-tight font-black text-[#1A2621] sm:text-[26px] lg:text-[30px]">
                {selectedTask?.name || "Exercise Overview"}
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed font-medium text-[#5A6D63]">
                {selectedTask?.description ||
                  "Follow the guided video instructions carefully. Maintain proper form and controlled pacing throughout the movement for optimal engagement."}
              </p>
            </div>

            {/* Reflection Forms */}
            {shouldShowSubmissionForm && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <section className="client-card rounded-[32px] p-6 sm:p-8 bg-white border-[#E8EEEB]">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-xl bg-[#F0F5F2] flex items-center justify-center text-[#0A7B4E]">
                        <Zap size={20} />
                      </div>
                      <h3 className="text-[22px] font-black text-[#1E2C26]">
                        Session Reflection
                      </h3>
                    </div>
                    <textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Share your thoughts on today's intensity and focus..."
                      className="h-[180px] w-full resize-none rounded-[24px] border border-[#E8EEEB] bg-[#FBFDFB] px-5 py-5 text-[15px] font-medium text-[#4A5D55] outline-none transition-all focus:border-[#0A7B4E]/30 focus:shadow-sm"
                    />
                  </section>

                  <section className="client-card rounded-[32px] p-6 sm:p-8 bg-white border-[#E8EEEB]">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-10 w-10 rounded-xl bg-[#F0F5F2] flex items-center justify-center text-[#0A7B4E]">
                        <ImagePlus size={20} />
                      </div>
                      <h3 className="text-[22px] font-black text-[#1E2C26]">
                        Visual Proof
                      </h3>
                    </div>
                    <button
                      onClick={handleOpenFilePicker}
                      className="group flex h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-[#DCE7E1] bg-[#FBFDFB] px-6 text-center transition-all hover:border-[#0A7B4E]/40 hover:bg-[#F4FAF7]"
                    >
                      {file ? (
                        <>
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E2F1E9] text-[#087B44] shadow-lg shadow-emerald-900/10">
                            <Check size={24} strokeWidth={3} />
                          </div>
                          <p className="max-w-full truncate text-[15px] font-black text-[#2A3A34]">
                            {fileName}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#087B44] shadow-md group-hover:scale-110 transition-transform duration-500">
                            <ImagePlus size={24} />
                          </div>
                          <p className="text-[15px] font-bold text-[#5F7168]">
                            Upload workout snapshot or video
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

                <button
                  onClick={handleSubmit}
                  disabled={uploading || !shouldShowSubmissionForm}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0A4F48] py-4 text-[18px] font-black text-white shadow-[0_14px_25px_rgba(8,123,68,0.26)] transition-all hover:bg-[#083f3a] hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#A9BDB3] disabled:hover:scale-100 sm:text-[20px] lg:text-[24px]"
                >
                  {uploading ? "Submitting..." : "Complete My Workout"}
                  {!uploading && <SendHorizontal size={22} />}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="client-card rounded-[30px] p-5 sm:p-6">
              <h3 className="inline-flex items-center gap-3 text-[20px] leading-none font-black text-[#25352E] sm:text-[24px] lg:text-[28px]">
                <ListChecks size={22} className="text-[#087B44]" />
                Workout Tasks
              </h3>

              <div className="mt-5 space-y-4">
                {workoutTasks.map((task, idx) => {
                  const isCompleted =
                    watchedVideos.has(idx) || idx < selectedIndex;
                  const isActive = idx === selectedIndex;
                  const unlocked = isUnlocked(idx);

                  return (
                    <div
                      key={`gallery-item-${idx}`}
                      onClick={() => handleTaskClick(idx)}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-[22px] overflow-hidden border p-2 transition-all duration-500 cursor-pointer",
                        isActive
                          ? "bg-white border-[#0A7B4E] shadow-xl shadow-emerald-900/10 ring-2 ring-[#0A7B4E]/10"
                          : isCompleted
                            ? "bg-[#F3F8F5] border-[#DCE7E1]"
                            : "bg-white border-[#E8EEEB] hover:border-[#D6DED9]",
                      )}
                    >
                      {/* Compact Thumbnail */}
                      <div className="relative aspect-video h-16 w-24 shrink-0 overflow-hidden rounded-[14px] bg-[#1E2C26]">
                        {task.url ? (
                          <video
                            muted
                            playsInline
                            preload="metadata"
                            className={cn(
                              "h-full w-full object-cover transition-all duration-700",
                              !isActive &&
                                "opacity-60 grayscale group-hover:grayscale-0",
                              isActive && "scale-110",
                            )}
                            src={task.url}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center opacity-20">
                            <Zap size={16} />
                          </div>
                        )}

                        {/* Status Icon Overlay */}
                        <div
                          className={cn(
                            "absolute inset-0 flex items-center justify-center backdrop-blur-[0.5px] transition-all",
                            isActive
                              ? "bg-[#0A7B4E]/20"
                              : "bg-black/20 group-hover:bg-transparent",
                          )}
                        >
                          {isCompleted ? (
                            <div className="bg-[#0A7B4E] text-white p-1 rounded-full shadow-lg">
                              <Check size={14} strokeWidth={4} />
                            </div>
                          ) : !unlocked ? (
                            <Lock size={14} className="text-white/80" />
                          ) : (
                            <div
                              className={cn(
                                "p-1.5 rounded-full shadow-lg transition-transform",
                                isActive
                                  ? "bg-[#0A7B4E] text-white scale-110"
                                  : "bg-white/90 text-[#0A7B4E] opacity-0 group-hover:opacity-100",
                              )}
                            >
                              {isActive ? (
                                <Pause size={14} fill="currentColor" />
                              ) : (
                                <PlayCircle size={14} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1 pr-2">
                        <h4
                          className={cn(
                            "truncate text-[15px] font-black leading-tight",
                            isActive ? "text-[#0A7B4E]" : "text-[#1F2D26]",
                            isCompleted && "opacity-60",
                          )}
                        >
                          {task.name || `Exercise ${idx + 1}`}
                        </h4>
                        <p className="mt-1 text-[11px] font-bold text-[#8FA097] uppercase tracking-wider">
                          {formatTaskTarget(task)}
                        </p>
                      </div>

                      {isActive && (
                        <div className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A7B4E] animate-pulse shadow-[0_0_8px_#0A7B4E]" />
                      )}
                    </div>
                  );
                })}
              </div>

              {!shouldShowSubmissionForm && (
                <div className="mt-6 rounded-[20px] border border-dashed border-[#A9BDB3] bg-[#F3F8F5] p-5 text-center transition-all duration-500">
                  <Lock
                    size={24}
                    strokeWidth={2.5}
                    className="mx-auto mb-3 text-[#70827A] opacity-60"
                  />
                  <p className="text-[14px] font-bold text-[#70827A] sm:text-[15px] lg:text-[16px]">
                    {pendingTasksCount > 0
                      ? `${pendingTasksCount} exercise video${pendingTasksCount === 1 ? "" : "s"} left to unlock submission`
                      : "Submission locked until all videos are completed"}
                  </p>
                </div>
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
          <h3 className="text-[28px] leading-none font-black text-[#25352E] sm:text-[28px] lg:text-[30px]">
            Effort Intensity
          </h3>
          <p className="mt-1 text-[16px] font-medium text-[#6D7E76]">
            Rate your perceived exertion for this session
          </p>
        </div>
        <div className="text-right">
          <p className="text-[36px] leading-none font-black text-[#0A4F48] sm:text-[44px] lg:text-[50px]">
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
                  ? "bg-[#0A4F48] text-white shadow-[0_10px_16px_rgba(8,123,68,0.35)]"
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

      {effortRating && (
        <div className="mt-5 rounded-[16px] bg-[#F5F9F7] p-4 text-center border border-[#DFE7E3] animate-in fade-in zoom-in-95 duration-300">
          <h4 className="text-[15px] font-black uppercase tracking-widest text-[#0A4F48]">
            {rpeScale.find((r) => r.value === effortRating)?.title}
          </h4>
          <p className="mt-1.5 text-[14px] font-medium leading-relaxed text-[#5D7067]">
            {rpeScale.find((r) => r.value === effortRating)?.description}
          </p>
        </div>
      )}
    </section>
  );
}

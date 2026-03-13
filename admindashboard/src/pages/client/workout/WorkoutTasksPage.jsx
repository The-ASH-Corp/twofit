import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CheckCircle2, Dumbbell, Lock, PlayCircle, Upload } from "lucide-react";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectSelectedClient } from "@/redux/features/client/client.selectors";
import { getClient } from "@/redux/features/client/client.thunk";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { getUserTaskStatus, uploadMultipleWorkoutTasks } from "@/redux/features/tasks/task.thunk";
import MobileBottomNav from "../components/MobileBottomNav";

const rpeScale = [
  { value: 10, label: "Maximum Effort",    description: "Activity is almost impossible to sustain. You are out of breath and unable to talk." },
  { value: 9,  label: "Extremely Hard",    description: "Very challenging. Very short bouts only. Conversation is impossible." },
  { value: 8,  label: "Very Hard",         description: "Intensive activity that you can sustain, but it's challenging to maintain conversation." },
  { value: 7,  label: "Vigorous",          description: "Strenuous activity. Conversation is possible, but it's very labored." },
  { value: 6,  label: "Moderately Hard",   description: "A step up in effort. Speaking in full sentences is difficult." },
  { value: 5,  label: "Hard",              description: "Noticeable increase in effort. Breathing heavily but can maintain short conversation." },
  { value: 4,  label: "Somewhat Hard",     description: "Moderate — a comfortable activity level that still feels like you're doing something." },
  { value: 3,  label: "Moderate",          description: "Activity is easy to maintain. Can converse with minimal effort." },
  { value: 2,  label: "Light",             description: "Feels easy and relaxed. Effortless conversation is possible." },
  { value: 1,  label: "Very Light",        description: "Minimal effort. No noticeable change in breathing or heart rate." },
];

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
          weekIndex: currentDayData.weekIndex,
          dayIndex: currentDayData.dayIndex,
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

  const statusConfig = {
    pending: {
      label: "Pending",
      pillClass: "bg-yellow-100 text-yellow-700 border-yellow-300",
      panelClass: "bg-yellow-50 border-yellow-200",
      message: "Your workout is submitted and waiting for expert review.",
    },
    verified: {
      label: "Verified",
      pillClass: "bg-green-100 text-green-700 border-green-300",
      panelClass: "bg-green-50 border-green-200",
      message: "Great work. Your workout was verified by the expert.",
    },
    rejected: {
      label: "Rejected",
      pillClass: "bg-red-100 text-red-700 border-red-300",
      panelClass: "bg-red-50 border-red-200",
      message: "Submission was rejected. Please review and submit again.",
    },
  };

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
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.info("Please upload a photo or video proof.");
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
      formData.append("effortRating", JSON.stringify({
        ratingNumber:      effortRating.ratingNumber,
        ratingLabel:       effortRating.ratingLabel,
        ratingDescription: effortRating.ratingDescription,
      }));

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

  const openNextVideo = () => {
    const nextIndex = selectedIndex + 1;
    if (nextIndex < workoutTasks.length && isUnlocked(nextIndex)) {
      setSelectedIndex(nextIndex);
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
          <p className="text-gray-500 mt-2">Workout tasks will appear once your program starts.</p>
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
              <h1 className="text-[#0A4F48] font-bold text-xl">Workout</h1>
              <p className="text-sm text-gray-500">Day {currentGlobalDay} exercise videos</p>
            </div>
            {overallWorkoutStatus !== "todo" && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${statusConfig[overallWorkoutStatus].pillClass}`}
              >
                {statusConfig[overallWorkoutStatus].label}
              </span>
            )}
            <Link
              to="/client"
              className="text-xs font-bold text-[#0A4F48] hover:text-[#083b36]"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-100 bg-black">
            {selectedTask?.url ? (
              <video
                key={selectedIndex}
                controls
                onEnded={handleVideoEnd}
                className="w-full aspect-video"
                src={selectedTask.url}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="aspect-video w-full bg-linear-to-br from-[#0A4F48] to-[#116D63] text-white flex flex-col items-center justify-center gap-2">
                <PlayCircle size={36} />
                <p className="text-sm font-semibold">No video available for this task</p>
              </div>
            )}
          </div>

          <div className="mt-4 bg-[#F8FAFC] rounded-xl p-3 border border-gray-100">
            <h2 className="text-[#0A4F48] font-bold text-sm">Current Task</h2>
            <p className="text-gray-700 font-semibold text-sm mt-1">{selectedTask?.name || "No exercise"}</p>
            <p className="text-gray-500 text-xs mt-1">{selectedTask?.notes || "Follow the form and pace from the assigned video."}</p>
          </div>

          <button
            onClick={openNextVideo}
            disabled={selectedIndex >= workoutTasks.length - 1 || !watchedVideos.has(selectedIndex)}
            className="mt-4 bg-[#0A4F48] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Play Next Video
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 border border-[#0A4F48]/10 h-fit">
          <h2 className="text-[#0A4F48] font-bold text-base mb-3">Workout Tasks</h2>
          <p className="text-xs text-gray-500 mb-4">Videos unlock one by one after finishing the previous video.</p>

          <div className="space-y-2">
            {workoutTasks.length ? (
              workoutTasks.map((task, idx) => {
                const unlocked = isUnlocked(idx);
                const active = idx === selectedIndex;

                return (
                  <button
                    key={`${task.name}-${idx}`}
                    onClick={() => handleTaskClick(idx)}
                    className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${
                      active
                        ? "border-[#0A4F48] bg-[#E6EEED]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    } ${!unlocked ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#0A4F48] truncate">{task.name || `Exercise ${idx + 1}`}</p>
                        <p className="text-[11px] text-gray-500 uppercase mt-0.5">{task.status || "todo"}</p>
                      </div>

                      {!unlocked ? (
                        <Lock size={15} className="text-gray-400 shrink-0" />
                      ) : (
                        <PlayCircle size={16} className="text-[#0A4F48] shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                No workout tasks available for today.
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-[#F4DBC7]/50 p-3 border border-[#F4DBC7]">
            <div className="flex items-center gap-2">
              <Dumbbell size={15} className="text-[#0A4F48]" />
              <p className="text-xs font-semibold text-[#0A4F48]">Progress</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Watched {watchedVideos.size}/{workoutTasks.length} videos in sequence.
            </p>
          </div>
        </div>
      </div>

      {/* Submission section — visible once all videos are watched */}
      {shouldShowSubmissionForm && (
        <div className="mx-4 lg:mx-2 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#0A4F48]/10 p-4 lg:p-6">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E6EEED] flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="text-[#0A4F48]" />
              </div>
              <div>
                <h2 className="text-[#0A4F48] font-bold text-base">Submit Workout Proof</h2>
                <p className="text-xs text-gray-500">All videos watched — rate your effort, add notes, and upload your proof.</p>
              </div>
            </div>

            {/* RPE Scale */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#0A4F48] mb-2">
                Rate of Perceived Exertion (RPE 1–10)
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/30 p-3">
                {rpeScale.map(({ value, label, description }) => (
                  <label
                    key={value}
                    className="flex items-center justify-between gap-3 text-[12px] font-semibold text-gray-700 bg-white border border-gray-100 rounded-lg px-3 py-2 cursor-pointer hover:border-[#0A4F48]/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="radio"
                        name="workoutEffortRating"
                        value={value}
                        checked={effortRating?.ratingNumber === value}
                        onChange={() =>
                          setEffortRating({
                            ratingNumber:      value,
                            ratingLabel:       label,
                            ratingDescription: description,
                          })
                        }
                        className="accent-[#0A4F48]"
                      />
                      <span className="font-black text-[#0A4F48] text-sm w-4 text-center">{value}</span>
                    </div>
                    <span className="text-gray-700 font-semibold text-[12px] w-28 shrink-0">{label}</span>
                    <span className="text-gray-400 text-[11px] leading-tight">{description}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold px-1 mt-1">
                <span>1 = Very Light</span>
                <span>10 = Maximum Effort</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#0A4F48] mb-2">Notes (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="How did the workout feel? Any observations…"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20"
              />
            </div>

            {/* File upload */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#0A4F48] mb-2">Upload Proof (Photo / Video)</label>
              <label
                htmlFor="workout-proof-upload"
                className="flex items-center gap-3 w-full rounded-xl border-2 border-dashed border-[#0A4F48]/30 px-4 py-3 cursor-pointer hover:bg-[#E6EEED]/30 transition-colors"
              >
                <Upload size={18} className="text-[#0A4F48] shrink-0" />
                <span className="text-sm font-medium text-gray-600 truncate">{fileName}</span>
                <input
                  id="workout-proof-upload"
                  type="file"
                  accept="image/*,video/*"
                  className="sr-only"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) {
                      setFile(selected);
                      setFileName(selected.name);
                    }
                  }}
                />
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full bg-[#0A4F48] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-bold transition-colors"
            >
              {uploading ? "Submitting…" : "Submit Workout"}
            </button>
          </div>
        </div>
      )}

      {(overallWorkoutStatus === "pending" || overallWorkoutStatus === "verified" || overallWorkoutStatus === "rejected") && (
        <div className="mx-4 lg:mx-2 mb-4">
          <div className={`rounded-2xl border shadow-sm p-6 text-center ${statusConfig[overallWorkoutStatus].panelClass}`}>
            <CheckCircle2 size={40} className="text-[#0A4F48] mx-auto mb-3" />
            <h3 className="text-[#0A4F48] font-bold text-lg">
              Workout Status: {statusConfig[overallWorkoutStatus].label}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {statusConfig[overallWorkoutStatus].message}
            </p>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </>
  );
}

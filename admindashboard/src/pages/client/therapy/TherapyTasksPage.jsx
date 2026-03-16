import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Brain, CheckCircle2, Lock, PlayCircle, Upload } from "lucide-react";
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

export default function TherapyTasksPage() {
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
          user?._id ? dispatch(getClient({ id: user._id })).unwrap() : Promise.resolve(),
          programId ? dispatch(getProgramById(programId)).unwrap() : Promise.resolve(null),
          dispatch(getUserTaskStatus()).unwrap(),
        ]);

        if (programData) setProgram(programData.data);
      } catch (error) {
        console.error("Failed to load therapy page:", error);
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

  const therapyTasks = useMemo(() => {
    const therapyDays =
      clientUser?.therapyType?.weeks?.flatMap((week, weekIndex) =>
        week.days.map((day, dayIndex) => ({
          ...day,
          weekIndex: weekIndex + 1,
          dayIndex: dayIndex + 1,
          globalIndex: weekIndex * 7 + dayIndex + 1,
        })),
      ) || [];

    const todayTherapy = therapyDays.find(
      (day) => day.globalIndex === currentGlobalDay,
    );

    return (
      todayTherapy?.therapies?.map((therapy, index) => {
        const submission = tasks?.find(
          (task) =>
            task.globalDayIndex === currentGlobalDay &&
            task.exerciseIndex === index &&
            task.taskType === "Therapy",
        );

        return {
          name: therapy.type || `Therapy ${index + 1}`,
          notes: therapy.notes,
          mediaUrl: therapy.url,
          mediaName: therapy.mediaName,
          index,
          exerciseIndex: index,
          status: submission?.status || "todo",
          programId: program?._id,
          weekIndex: todayTherapy.weekIndex,
          dayIndex: todayTherapy.dayIndex,
          globalDayIndex: currentGlobalDay,
        };
      }) || []
    );
  }, [clientUser?.therapyType?.weeks, currentGlobalDay, program?._id, tasks]);

  const selectedTask = therapyTasks[selectedIndex] || null;

  const isUnlocked = (idx) => {
    if (idx === 0) return true;
    return watchedVideos.has(idx - 1);
  };

  const handleTaskClick = (idx) => {
    if (!isUnlocked(idx)) {
      toast.info("Please complete the previous therapy video first.");
      return;
    }
    setSelectedIndex(idx);
  };

  const allVideosWatched =
    therapyTasks.length > 0 &&
    therapyTasks.every((task, idx) => !task.mediaUrl || watchedVideos.has(idx));

  const overallTherapyStatus = useMemo(() => {
    if (!therapyTasks.length) return "todo";

    const statuses = therapyTasks.map((task) => task.status || "todo");
    const allVerified = statuses.every((status) => status === "verified");
    const anyPending = statuses.some((status) => status === "pending");
    const anyRejected = statuses.some((status) => status === "rejected");

    if (allVerified) return "verified";
    if (anyPending) return "pending";
    if (anyRejected) return "rejected";
    return "todo";
  }, [therapyTasks]);

  const statusConfig = {
    pending: {
      label: "Pending",
      pillClass: "bg-yellow-100 text-yellow-700 border-yellow-300",
      panelClass: "bg-yellow-50 border-yellow-200",
      message: "Your therapy submission is waiting for expert review.",
    },
    verified: {
      label: "Verified",
      pillClass: "bg-green-100 text-green-700 border-green-300",
      panelClass: "bg-green-50 border-green-200",
      message: "Great work. Your therapy submission was verified.",
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
    overallTherapyStatus !== "pending" &&
    overallTherapyStatus !== "verified";

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

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", comment);

      const exerciseIndices = therapyTasks.map((task) => task.exerciseIndex);
      formData.append("exerciseIndices", JSON.stringify(exerciseIndices));
      formData.append("programId", therapyTasks[0]?.programId || "");
      formData.append("weekIndex", therapyTasks[0]?.weekIndex || 1);
      formData.append("dayIndex", therapyTasks[0]?.dayIndex || 1);
      formData.append("globalDayIndex", therapyTasks[0]?.globalDayIndex || 1);
      formData.append("taskType", "Therapy");

      const result = await dispatch(uploadMultipleWorkoutTasks(formData));
      if (uploadMultipleWorkoutTasks.fulfilled.match(result)) {
        toast.success("Therapy submitted successfully!");
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

  const openNextVideo = () => {

    const nextIndex = selectedIndex + 1;
    if (nextIndex < therapyTasks.length && isUnlocked(nextIndex)) {
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
          <p className="text-gray-500 mt-2">Therapy tasks will appear once your program starts.</p>
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

  if (!therapyTasks.length) {
    return (
      <>
        <div className="p-4 lg:p-2 pb-24 lg:pb-2 ">
          <div className="bg-white rounded-2xl shadow-sm border border-[#0A4F48]/10 p-8 text-center">
            <h2 className="text-xl font-bold text-[#0A4F48]">No Therapy Assigned</h2>
            <p className="text-gray-500 mt-2">
              No therapy is assigned to you.
            </p>
            <Link
              to="/client"
              className="inline-block mt-4 text-sm font-bold text-[#0A4F48] hover:text-[#083b36]"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <div className="w-full grid lg:grid-cols-[1.5fr_1fr] grid-cols-1 gap-6 p-4 lg:p-2 pb-24 lg:pb-2">
        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 border border-[#0A4F48]/10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-[#0A4F48] font-bold text-xl">Therapy</h1>
              <p className="text-sm text-gray-500">Day {currentGlobalDay} therapy videos</p>
            </div>
            {overallTherapyStatus !== "todo" && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${statusConfig[overallTherapyStatus].pillClass}`}
              >
                {statusConfig[overallTherapyStatus].label}
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
            {selectedTask?.mediaUrl ? (
              <video
                key={selectedIndex}
                 controls
                 onEnded={handleVideoEnd}
                 className="w-full aspect-video"
                 src={selectedTask.mediaUrl?.replace(/^http:\/\//i, "https://")}
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
            <p className="text-gray-700 font-semibold text-sm mt-1">{selectedTask?.name || "No therapy task"}</p>
            <p className="text-gray-500 text-xs mt-1">{selectedTask?.notes || "Follow the therapist instructions from the assigned material."}</p>
          </div>

          <button
            onClick={openNextVideo}
            disabled={selectedIndex >= therapyTasks.length - 1 || !watchedVideos.has(selectedIndex)}
            className="mt-4 bg-[#0A4F48] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Play Next Video
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 border border-[#0A4F48]/10 h-fit">
          <h2 className="text-[#0A4F48] font-bold text-base mb-3">Therapy Tasks</h2>
          <p className="text-xs text-gray-500 mb-4">Videos unlock one by one after finishing the previous video.</p>

          <div className="space-y-2">
            {therapyTasks.length ? (
              therapyTasks.map((task, idx) => {
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
                        <p className="font-semibold text-sm text-[#0A4F48] truncate">{task.name || `Therapy ${idx + 1}`}</p>
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
                No therapy tasks available for today.
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-[#F4DBC7]/50 p-3 border border-[#F4DBC7]">
            <div className="flex items-center gap-2">
              <Brain size={15} className="text-[#0A4F48]" />
              <p className="text-xs font-semibold text-[#0A4F48]">Progress</p>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Watched {watchedVideos.size}/{therapyTasks.length} videos in sequence.
            </p>
          </div>
        </div>
      </div>

 
       {shouldShowSubmissionForm && (
        <div className="mx-4 lg:mx-2 mb-8">
          <div className="bg-white rounded-4xl shadow-xl shadow-[#0A4F48]/5 border border-[#0A4F48]/10 overflow-hidden">
            <div className="bg-[#0A4F48] p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Therapy Complete</h2>
                  <p className="text-white/70 text-sm">Review your session and upload your completion proof</p>
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-sm font-bold text-[#0A4F48] mb-2 flex items-center gap-2">
                    Notes <span className="text-[10px] font-normal text-gray-400 uppercase tracking-wider">(Optional)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="How did the therapy session feel? Any breakthrough or observations?"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/30 px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-[#0A4F48]/30 focus:bg-white transition-all outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0A4F48] mb-2">Upload Proof</label>
                  <div 
                    onClick={handleOpenFilePicker}
                    className="group relative h-[116px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#0A4F48]/40 hover:bg-[#E6EEED]/20 transition-all cursor-pointer overflow-hidden"
                  >
                    {file ? (
                      <div className="flex flex-col items-center gap-1 p-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 size={18} className="text-green-600" />
                        </div>
                        <span className="text-xs font-bold text-[#0A4F48] truncate max-w-full text-center">{fileName}</span>
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setFileName("Upload File");
                          }}
                          className="text-[10px] text-red-500 font-bold uppercase hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload size={20} className="text-gray-400 group-hover:text-[#0A4F48]" />
                        </div>
                        <p className="text-xs font-bold text-gray-500 group-hover:text-[#0A4F48]">Drop photo/video proof</p>
                        <p className="text-[10px] text-gray-400">or click to browse</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    id="therapy-proof-upload"
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="w-full bg-[#0A4F48] hover:bg-[#083b36] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl py-4 text-base font-black transition-all shadow-lg shadow-[#0A4F48]/20 flex items-center justify-center gap-2 group"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <>
                    <span>Submit Therapy Result</span>
                    <Brain size={18} className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {(overallTherapyStatus === "pending" || overallTherapyStatus === "verified" || overallTherapyStatus === "rejected") && (
        <div className="mx-4 lg:mx-2 mb-4">
          <div className={`rounded-2xl border shadow-sm p-6 text-center ${statusConfig[overallTherapyStatus].panelClass}`}>
            <CheckCircle2 size={40} className="text-[#0A4F48] mx-auto mb-3" />
            <h3 className="text-[#0A4F48] font-bold text-lg">
              Therapy Status: {statusConfig[overallTherapyStatus].label}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {statusConfig[overallTherapyStatus].message}
            </p>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </>
  );
}

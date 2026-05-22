import {
  Brain,
  CheckCircle2,
  Lock,
  PlayCircle,
  Upload,
  Wind,
  Accessibility,
  PenLine,
  Check,
  Pause,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import bgimage from "/src/assets/therapy-bg.jpg";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import sandyloading from "../../../assets/Sandy Loading.json";
import { GiMeditation } from "react-icons/gi";
import { FaSpa, FaHeart } from "react-icons/fa";

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
        console.error("Failed to load therapy page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [dispatch, user?._id, user?.programType]);

  const therapyLogos = [<GiMeditation />, <FaSpa />, <FaHeart />];
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

        // Helper for icons based on therapy name/type
        const getIcon = (name) => {
          const n = name?.toLowerCase() || "";
          if (n.includes("breath")) return Wind;
          if (n.includes("stretch")) return Accessibility;
          if (n.includes("journal")) return PenLine;
          return Brain;
        };

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
          icon: getIcon(therapy.type),
          focus: therapy.focus || "Section focus note", // Mocked or from DB
          technique: therapy.technique || "Cognitive Reframing",
          impact: therapy.impact || "High Precision",
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
    setIsStarted(true); // Automatically engage session once a task is manually clicked
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

    // Auto-progression logic (same as Workout page)
    const nextIndex = selectedTask.index + 1;
    if (nextIndex < therapyTasks.length) {
      setTimeout(() => {
        setSelectedIndex(nextIndex);
      }, 1500);
    }
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
        <div className="mx-auto mt-20 max-w-lg rounded-[32px] border border-[#0A4F48]/10 bg-white p-8 text-center shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <Lottie
            animationData={sandyloading}
            loop
            autoplay
            className="w-40 h-40 m-auto"
          />

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
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#0A4F48]/10">
        <h2 className="text-xl font-bold text-[#0A4F48]">Account Inactive</h2>
        <p className="text-gray-500 mt-2">
          Please contact admin to reactivate your account.
        </p>
      </div>
    );
  }

  if (!therapyTasks.length) {
    return (
      <>
        <div className="p-4 lg:p-2 pb-24 lg:pb-2 ">
          <div className="bg-white rounded-2xl shadow-sm border border-[#0A4F48]/10 p-8 text-center">
            <h2 className="text-xl font-bold text-[#0A4F48]">
              No Therapy Assigned
            </h2>
            <p className="text-gray-500 mt-2">No therapy is assigned to you.</p>
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
    <div className="client-page-container p-5 sm:p-6">
      <div className="client-page-shell">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.9fr_1fr]">
          <div className="space-y-6">
            <section className="client-card rounded-[32px] overflow-hidden p-0 bg-[#0F1A17] border-0 shadow-2xl shadow-emerald-900/10 group">
              <div className="relative">
                {selectedTask?.mediaUrl ? (
                  <div className="relative h-[260px] w-full sm:h-[340px] lg:h-[420px]">
                    <video
                      key={`therapy-video-${selectedIndex}`}
                      autoPlay={isStarted}
                      controls={isStarted}
                      controlsList="nodownload"
                      onEnded={handleVideoEnd}
                      className={cn(
                        "h-full w-full object-contain transition-all duration-700",
                        !isStarted && "blur-sm opacity-40 grayscale-[0.8]",
                      )}
                      src={selectedTask.mediaUrl}
                    >
                      Your browser does not support the video tag.
                    </video>

                    {!isStarted && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-[2px]"
                        style={{
                          backgroundImage: `url(${bgimage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <h3 className="mt-8 text-[32px] font-black text-white uppercase tracking-tight text-center drop-shadow-2xl">
                          Ready for your therapy?
                        </h3>
                        <p className="mt-2 text-[14px] font-bold text-emerald-100/70 uppercase tracking-[0.2em] text-center">
                          Day {currentGlobalDay} • {therapyTasks.length}{" "}
                          Handpicked Sessions
                        </p>
                        <button
                          onClick={() => setIsStarted(true)}
                          className="mt-8 px-10 py-4 bg-white text-[#0A7B4E] text-[15px] font-black uppercase tracking-widest rounded-full shadow-2xl hover:bg-[#0A7B4E] hover:text-white transition-colors shadow-emerald-900/40"
                        >
                          Start My Therapy
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[260px] w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-[#0F1A17] to-[#142621] text-white/90 sm:h-[340px] lg:h-[420px]">
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10">
                      <PlayCircle size={32} className="opacity-30" />
                    </div>
                    <p className="text-[14px] font-black uppercase tracking-widest opacity-50">
                      No instruction video assigned
                    </p>
                  </div>
                )}

                {/* Header Info Over Video */}
                <div className="absolute top-0 left-0 right-0 p-6 bg-linear-to-b from-black/80 to-transparent flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A7B4E] drop-shadow-sm">
                      Therapy Guide
                    </p>
                    <h2 className="text-[20px] font-black text-white leading-tight drop-shadow-md">
                      {selectedTask?.name || "Recovery Session"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#0A7B4E] animate-pulse" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                      {selectedIndex + 1}/{therapyTasks.length}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="client-card rounded-[32px] p-6 sm:p-8 bg-white border-[#E8EEEB] shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-[720px]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#F0F5F2] text-[#0A7B4E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#DCE7E3]">
                      Active Focal Module
                    </span>
                  </div>
                  <h2 className="text-[28px] leading-tight font-black text-[#1F2D27] sm:text-[34px]">
                    {selectedTask?.name}
                  </h2>
                  <p className="mt-4 text-[16px] font-medium leading-relaxed text-[#50635A]">
                    {selectedTask?.notes ||
                      "In this session, we explore the foundations of neuroplasticity and how to identify automatic negative thoughts (ANTs) during high-pressure performance moments."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="client-card rounded-[24px] p-5 sm:p-6">
              <h3 className="mb-4 inline-flex items-center gap-2 text-[24px] leading-none font-black text-[#1F2D27] sm:text-[28px] lg:text-[30px]">
                <CheckCircle2 size={18} className="text-[#0A7B4E]" />
                Today&apos;s Protocol
              </h3>

              <div className="mt-5 space-y-4">
                {therapyTasks.map((task, idx) => {
                  const isCompleted =
                    watchedVideos.has(idx) || idx < selectedIndex;
                  const isActive = idx === selectedIndex;
                  const unlocked = isUnlocked(idx);
                  const IconComp = task.icon;

                  return (
                    <div
                      key={`therapy-gallery-${idx}`}
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
                        {task.mediaUrl ? (
                          <>
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
                              src={task.mediaUrl}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-[#0A7B4E] backdrop-blur-sm">
                              {" "}
                              <div className="text-white text-5xl opacity-80">
                                {therapyLogos[idx % therapyLogos.length]}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center opacity-20">
                            <IconComp size={16} />
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
                          {task.name}
                        </h4>
                        <p className="mt-1 text-[11px] font-bold text-[#8FA097] uppercase tracking-wider">
                          {task.notes}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "mr-2 p-1.5 rounded-lg shrink-0 transition-colors duration-500",
                          isActive
                            ? "bg-[#0A7B4E]/10 text-[#0A7B4E]"
                            : "bg-[#F0F5F2] text-[#667771]",
                        )}
                      >
                        <IconComp size={14} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {shouldShowSubmissionForm && (
              <section className="rounded-[24px] border border-[#CFE0D6] bg-[#E8F2ED] p-5 sm:p-6">
                <h3 className="text-[24px] leading-none font-black text-[#0A4F48] sm:text-[28px] lg:text-[30px]">
                  Therapy Complete?
                </h3>
                <p className="mt-3 text-[16px] font-medium leading-relaxed text-[#64756D]">
                  Briefly summarize your primary takeaway from today&apos;s
                  session to lock in your progress.
                </p>

                <div className="mt-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7A8A83]">
                    Your Takeaway
                  </p>

                  <button
                    onClick={handleOpenFilePicker}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#BCD4C8] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#0A7B4E]"
                  >
                    <Upload size={13} />
                    {file ? fileName : "Upload Proof"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your thoughts here..."
                    className="mt-3 h-32 w-full resize-none rounded-[14px] border border-[#D6E3DC] bg-white px-4 py-3 text-[14px] font-semibold text-[#31423B] placeholder:text-[#95A39D] outline-none focus:border-[#0A7B4E]/40"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="mt-5 w-full rounded-full bg-[#0A4F48] py-3.5 text-[15px] font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_22px_rgba(8,123,68,0.28)] transition-all hover:bg-[#073d2d] disabled:cursor-not-allowed disabled:bg-[#9FB4A9]"
                >
                  {uploading ? "Submitting..." : "Submit Therapy Result"}
                </button>
              </section>
            )}

            {(overallTherapyStatus === "pending" ||
              overallTherapyStatus === "verified" ||
              overallTherapyStatus === "rejected") && (
              <section
                className={cn(
                  "rounded-[24px] border p-5 text-center",
                  statusConfig[overallTherapyStatus].panelClass,
                )}
              >
                <CheckCircle2 size={34} className="mx-auto text-[#0A7B4E]" />
                <h3 className="mt-3 text-[22px] font-black text-[#1F2D27]">
                  Session {statusConfig[overallTherapyStatus].label}
                </h3>
                <p className="mt-2 text-[14px] font-medium text-[#5D6F66]">
                  {statusConfig[overallTherapyStatus].message}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

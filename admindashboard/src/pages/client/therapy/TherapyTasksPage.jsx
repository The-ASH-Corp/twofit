import { 
  Brain, 
  CalendarDays,
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Upload, 
  Wind, 
  Accessibility, 
  PenLine, 
  Play, 
  Check, 
  ChevronRight
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
import { Link } from "react-router-dom";

function MetricItem({ label, value }) {
  return (
    <div className="rounded-[14px]  p-3 sm:p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#82938B]">
        {label}
      </p>
      <p className="mt-1 text-[21px] font-black leading-none text-[#087B44]">
        {value}
      </p>
    </div>
  );
}

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
          impact: therapy.impact || "High Precision"
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

  const todayDisplay = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const canPlayNext =
    selectedIndex < therapyTasks.length - 1 && watchedVideos.has(selectedIndex);

  const rewardXp = Math.max(therapyTasks.length * 10, 50);

  return (
    <div className="min-h-screen bg-[#EDF2EF] pb-32">
      <div className="mx-auto max-w-[1380px] p-4 lg:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#0A7B4E]">
              Current Module
            </p>
            <h1 className="mt-1 text-[36px] leading-none font-black tracking-tight text-[#1E2C26] sm:text-[48px] lg:text-[56px]">
              Day {currentGlobalDay} Therapy Videos
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#DFE7E3] bg-[#F5F9F7] px-4 py-2 text-[13px] font-black text-[#5D6E66]">
            <CalendarDays size={16} className="text-[#0A7B4E]" />
            {todayDisplay}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.9fr_1fr]">
          <div className="space-y-6">
            <section className="client-card rounded-[24px] p-4">
              <div className="relative overflow-hidden rounded-[18px] border border-[#D9E3DD] bg-[#243A35]">
                {selectedTask?.mediaUrl ? (
                  <video
                    key={selectedIndex}
                    onEnded={handleVideoEnd}
                    className="h-[260px] w-full object-cover sm:h-[360px] lg:h-[460px]"
                    src={selectedTask.mediaUrl?.replace(/^http:\/\//i, "https://")}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex h-[260px] w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-[#0A4F48] to-[#135E56] text-white sm:h-[360px] lg:h-[460px]">
                    <PlayCircle size={62} className="opacity-40" />
                    <p className="text-[16px] font-black opacity-75">
                      No video assigned for this task
                    </p>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#087B44] text-white shadow-[0_16px_28px_rgba(8,123,68,0.38)]">
                    <Play size={30} fill="currentColor" />
                  </div>
                </div>
              </div>
            </section>

            <section className="client-card rounded-[24px] p-6 sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-[720px]">
                  <h2 className="text-[34px] leading-[1.08] font-black text-[#1F2D27] sm:text-[42px] lg:text-[50px]">
                    Current Task: {selectedTask?.name || "Main Therapy Video"}
                  </h2>
                  <p className="mt-3 text-[17px] font-medium leading-relaxed text-[#66776F]">
                    {selectedTask?.notes ||
                      "In this session, we explore the foundations of neuroplasticity and how to identify automatic negative thoughts (ANTs) during high-pressure performance moments."}
                  </p>
                </div>

                <button
                  onClick={openNextVideo}
                  disabled={!canPlayNext}
                  className="inline-flex h-[112px] w-[112px] shrink-0 flex-col items-center justify-center rounded-3xl bg-[#087B44] text-center text-white shadow-[0_16px_28px_rgba(8,123,68,0.35)] transition-all hover:bg-[#076d3d] disabled:cursor-not-allowed disabled:bg-[#C9D4CE] disabled:text-[#87958E] sm:h-[84px] sm:w-[154px]"
                >
                  <span className="text-[24px] font-black leading-none">
                    Play Next
                  </span>
                 
                  <span className="mt-1 inline-flex items-center gap-1 text-[14px] font-black">
                    Video <ChevronRight size={15} />
                  </span>
                </button>
              </div>

              
            </section>
          </div>

          <div className="space-y-6">
            <section className="client-card rounded-[24px] p-5 sm:p-6">
              <h3 className="mb-4 inline-flex items-center gap-2 text-[30px] leading-none font-black text-[#1F2D27] sm:text-[36px] lg:text-[42px]">
                <CheckCircle2 size={18} className="text-[#0A7B4E]" />
                Today&apos;s Protocol
              </h3>

              <div className="space-y-3">
                {therapyTasks.map((task, idx) => {
                  const isCompleted = watchedVideos.has(idx) || idx < selectedIndex;
                  const isActive = idx === selectedIndex;
                  const unlocked = isUnlocked(idx);
                  const IconComp = task.icon;

                  if (isActive) {
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTaskClick(idx)}
                        className="flex w-full items-center gap-3 rounded-[14px] border border-[#A9DCC2] bg-[#EFF8F3] p-3 text-left transition-all"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[#0A7B4E] shadow-[0_6px_12px_rgba(17,38,29,0.1)]">
                          <IconComp size={18} />
                        </div>
                        <p className="text-[16px] font-black text-[#0A7B4E]">
                          {task.name}
                        </p>
                      </button>
                    );
                  }

                  if (isCompleted) {
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTaskClick(idx)}
                        className="flex w-full items-center gap-3 rounded-[14px] bg-[#F4F8F6] p-3 text-left transition-all hover:bg-[#EDF5F1]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#087B44] text-white">
                          <Check size={16} strokeWidth={3} />
                        </div>
                        <p className="text-[16px] font-black text-[#3D4F47]">
                          {task.name}
                        </p>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleTaskClick(idx)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[14px] bg-[#F6F8F7] p-3 text-left transition-all",
                        !unlocked && "opacity-45",
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white text-[#AAB7B1]">
                        {unlocked ? <IconComp size={18} /> : <Lock size={16} />}
                      </div>
                      <p className="text-[16px] font-black text-[#8A9992]">
                        {task.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {shouldShowSubmissionForm && (
              <section className="rounded-[24px] border border-[#CFE0D6] bg-[#E8F2ED] p-5 sm:p-6">
                <h3 className="text-[30px] leading-none font-black text-[#087B44] sm:text-[36px] lg:text-[42px]">
                  Therapy Complete?
                </h3>
                <p className="mt-3 text-[16px] font-medium leading-relaxed text-[#64756D]">
                  Briefly summarize your primary takeaway from today&apos;s session
                  to lock in your progress.
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
                  className="mt-5 w-full rounded-full bg-[#087B44] py-3.5 text-[15px] font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_22px_rgba(8,123,68,0.28)] transition-all hover:bg-[#076f3d] disabled:cursor-not-allowed disabled:bg-[#9FB4A9]"
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

import { 
  Brain, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Upload, 
  Wind, 
  Accessibility, 
  PenLine, 
  Settings, 
  Maximize, 
  Play, 
  Check, 
  Circle, 
  Camera, 
  Lightbulb, 
  Timer,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Volume2
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
          duration: therapy.duration || "15 mins", // Mocked or from DB
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

  return (
    <div className="bg-[#F8FBFA] min-h-screen pb-32">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-[#0A4F48] font-black text-3xl lg:text-4xl tracking-tight">
              Day {currentGlobalDay} Therapy Videos
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-[#0A4F48] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <Sparkles size={16} className="text-[#71FEE2]" />
              <span className="text-[11px] font-black tracking-widest uppercase">
                {watchedVideos.size}/{therapyTasks.length} Tasks
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Video + Current Task Detail */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Custom Video Player UI */}
            <div className="relative w-full aspect-video rounded-[40px] overflow-hidden bg-black shadow-2xl group">
              {selectedTask?.mediaUrl ? (
                <video
                  key={selectedIndex}
                  onEnded={handleVideoEnd}
                  className="w-full h-full object-cover"
                  src={selectedTask.mediaUrl?.replace(/^http:\/\//i, "https://")}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#0A4F48] to-[#116D63] text-white flex flex-col items-center justify-center gap-4">
                  <PlayCircle size={60} className="opacity-40 animate-pulse" />
                  <p className="text-lg font-black tracking-tight opacity-70">No video assigned for this task</p>
                </div>
              )}

              {/* Custom Controls Overlay (Simulation) */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center gap-4 group-hover:opacity-100 transition-opacity">
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Play size={16} fill="white" />
                </button>
                <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-[#10B981] rounded-full w-[40%]" />
                </div>
                <div className="flex items-center gap-4 text-white font-bold text-[11px] font-mono">
                  <span>04:20 / 12:00</span>
                  <Volume2 size={16} />
                  <Maximize size={16} />
                </div>
              </div>
            </div>

            {/* Current Task Detail Card */}
            <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8 relative z-10">
                <div className="flex-1">
                  <h2 className="text-[#0A4F48] font-black text-2xl lg:text-3xl tracking-tighter mb-4">
                    Current Task: {selectedTask?.name}
                  </h2>
                  <p className="text-gray-500 font-bold leading-relaxed text-sm lg:text-base max-w-2xl">
                    {selectedTask?.notes || "In this session, we reflect on the physical sensations experienced during the breathing exercises. Document any shifts in heart rate or clarity. Focus on the \"flow state\" triggers identified in yesterday's module."}
                  </p>
                </div>
                
                <button 
                  onClick={openNextVideo}
                  disabled={selectedIndex >= therapyTasks.length - 1 || !watchedVideos.has(selectedIndex)}
                  className="bg-[#0A4F48] text-white hover:bg-[#083b36] disabled:bg-gray-200 disabled:text-gray-400 rounded-full px-8 py-4 flex items-center gap-3 transition-all hover:scale-105 shadow-xl hover:shadow-[#0A4F48]/30 group"
                >
                  <span className="text-[11px] font-black tracking-widest uppercase">Play Next Video</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Protocol + Submission */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Today's Protocol List */}
            <div className="bg-[#E6EEED] rounded-[48px] p-8 lg:p-10">
              <h3 className="text-[10px] font-black text-[#0A4F48]/40 uppercase tracking-[0.3em] mb-8">
                Today's Protocol
              </h3>
              <div className="flex flex-col gap-5">
                {therapyTasks.map((task, idx) => {
                  const isCompleted = watchedVideos.has(idx) || idx < selectedIndex;
                  const isActive = idx === selectedIndex;
                  const unlocked = isUnlocked(idx);
                  const IconComp = task.icon;

                  if (isActive) {
                    return (
                      <div key={idx} className="bg-[#0A4F48] rounded-[32px] p-6 shadow-2xl shadow-[#0A4F48]/30 relative overflow-hidden group">
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                            <IconComp size={22} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-black text-sm lg:text-[15px] leading-tight flex items-center gap-2">
                              {task.name}
                            </h4>
                            <p className="text-white/60 font-bold text-[10px] mt-1 lg:mt-2">
                              {task.duration} • {task.focus}
                            </p>
                          </div>
                          <div className="w-7 h-7 rounded-full border-[3px] border-white/20 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (isCompleted) {
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTaskClick(idx)}
                        className="bg-white rounded-[32px] p-6 flex items-center gap-5 shadow-sm border border-transparent hover:border-[#0A4F48]/10 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[#EAF1F0] flex items-center justify-center text-[#10B981]">
                          <IconComp size={22} />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-gray-800 font-black text-sm lg:text-[15px] leading-tight group-hover:text-[#0A4F48] transition-colors">
                            {task.name}
                          </h4>
                          <p className="text-gray-400 font-bold text-[10px] mt-1 lg:mt-2">
                            {task.duration} • Completed
                          </p>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-[#0A4F48] flex items-center justify-center text-white">
                          <Check size={14} strokeWidth={4} />
                        </div>
                      </button>
                    );
                  }

                  return (
                    <div 
                      key={idx} 
                      className={cn(
                        "rounded-[32px] border-2 border-dashed border-[#0A4F48]/10 p-6 flex items-center gap-5",
                        !unlocked && "opacity-40"
                      )}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                        {unlocked ? <IconComp size={22} /> : <Lock size={18} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-300 font-black text-sm lg:text-base leading-tight">
                          {task.name}
                        </h4>
                        <p className="text-gray-300 font-bold text-[10px] mt-2 italic">
                          Locked • Complete previous
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-full border-2 border-gray-100" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission Section */}
            {shouldShowSubmissionForm && (
              <div className="bg-[#DDE5E4] rounded-[48px] p-8 lg:p-10 flex flex-col gap-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-[#0A4F48] font-black text-2xl tracking-tighter mb-2">
                    Therapy Complete?
                  </h3>
                  <p className="text-gray-500 font-bold text-xs leading-relaxed">
                    Finalize your session by logging your notes and data insights.
                  </p>
                </div>

                <div 
                  onClick={handleOpenFilePicker}
                  className="bg-white rounded-[32px] p-8 border-2 border-dashed border-[#0A4F48]/20 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/80 cursor-pointer transition-all group lg:min-h-[140px]"
                >
                  {file ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-[#E6FFFA] flex items-center justify-center text-[#10B981]">
                        <CheckCircle2 size={32} />
                      </div>
                      <div className="min-w-0 px-2 w-full">
                        <p className="text-[#0A4F48] font-black text-xs truncate max-w-full text-center">{fileName}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFile(null); setFileName("Upload File"); }}
                          className="text-red-500 font-black text-[9px] uppercase tracking-widest mt-2 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform shadow-inner">
                        <Upload size={24} />
                      </div>
                      <div>
                        <h5 className="text-[#0A4F48] font-black text-sm">Tap to upload proof</h5>
                        <p className="text-gray-400 font-bold text-[9px] mt-1">Journal photos or session notes (PDF/JPG)</p>
                      </div>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

                <div>
                  <h5 className="text-[10px] font-black text-[#0A4F48]/40 uppercase tracking-[0.2em] mb-4 pl-1">
                    Optional Notes
                  </h5>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How did you feel during today's session?"
                    className="w-full h-28 bg-white/40 rounded-[28px] border-none px-6 py-5 text-sm font-bold text-[#0A4F48] placeholder-[#0A4F48]/30 focus:ring-0 resize-none transition-all shadow-inner"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="w-full bg-[#0A4F48] text-white disabled:bg-gray-400 rounded-full py-5 flex items-center justify-center gap-3 shadow-2xl shadow-[#0A4F48]/40 hover:scale-[1.02] transition-transform group"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-[12px] font-black tracking-widest uppercase">Submit Therapy Result</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Status Feedback */}
            {(overallTherapyStatus === "pending" || overallTherapyStatus === "verified" || overallTherapyStatus === "rejected") && (
              <div className={cn(
                "rounded-[48px] p-8 text-center border-2",
                overallTherapyStatus === "verified" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              )}>
                <CheckCircle2 size={48} className="mx-auto mb-4 text-[#0A4F48]" />
                <h3 className="text-[#0A4F48] font-black text-xl tracking-tighter uppercase mb-2">
                  Session {overallTherapyStatus}
                </h3>
                <p className="text-gray-500 font-bold text-sm">
                  {statusConfig[overallTherapyStatus].message}
                </p>
              </div>
            )}
            
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Dumbbell, 
  Lock, 
  PlayCircle, 
  Upload, 
  Settings, 
  Maximize, 
  Play, 
  Check, 
  Circle, 
  Camera, 
  Lightbulb, 
  Timer,
  Info
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
  { value: 1, label: "Easy" },
  { value: 2, label: "" },
  { value: 3, label: "" },
  { value: 4, label: "" },
  { value: 5, label: "" },
  { value: 6, label: "" },
  { value: 7, label: "Hard" }, // Matched perfectly with UI image
  { value: 8, label: "" },
  { value: 9, label: "" },
  { value: 10, label: "" },
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
  const [effortRating, setEffortRating] = useState(null); // Just storing the number 1-10
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

  // Determine if we show Finish Strong form right now
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
    
    // Auto-advance
    const nextIndex = selectedTask.index + 1;
    if (nextIndex < workoutTasks.length) {
      setTimeout(() => {
        setSelectedIndex(nextIndex);
      }, 1500); // Wait 1.5s then jump to next to simulate flow feeling
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
      <div className="flex justify-center items-center h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={16} />
      </div>
    );
  }

  if (!isProgramStarted) {
    return (
      <>
        <div className="bg-white rounded-[32px] p-8 text-center shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#0A4F48]/10 max-w-lg mx-auto mt-20">
          <h2 className="text-xl font-black text-[#0A4F48]">
            Program Not Started
          </h2>
          <p className="text-gray-500 mt-2 font-medium">
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
        <div className="bg-white rounded-[32px] p-8 text-center shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#0A4F48]/10 max-w-lg mx-auto mt-20">
          <h2 className="text-xl font-black text-[#0A4F48]">Account Inactive</h2>
          <p className="text-gray-500 mt-2 font-medium">
            Please contact admin to reactivate your account to perform workouts.
          </p>
        </div>
        <MobileBottomNav />
      </>
    );
  }
  
  // Custom Video Player Playhead logic simulated
  const handlePlaySimulate = () => {
    // Finds the first video element inside the container and attempts to play it if it were paused
    const vid = document.querySelector('video');
    if (vid) {
      if (vid.paused) { vid.play(); } else { vid.pause(); }
    }
  };

  return (
    <div className="bg-[#F8FBFA] lg:bg-[#F9FAFA] min-h-screen pb-32">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* =========================================
            LEFT COLUMN (Video + Finish Strong) 
            ========================================= */}
        <div className="w-full lg:col-span-7 flex flex-col gap-6 order-1">
           {/* Custom Video Player Wrapper */}
           <div className="relative w-full aspect-video lg:rounded-[40px] rounded-[32px] overflow-hidden bg-black shadow-xl shrink-0 group">
              {/* Top Tags */}
              <div className="absolute top-4 left-4 lg:top-8 lg:left-8 bg-[#00A195] text-[#013531] text-[9px] lg:text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full z-10 w-fit shrink-0 shadow-lg">
                 Live Session
              </div>
              
              <div className="absolute top-4 right-4 lg:top-8 lg:right-8 flex gap-2 z-10">
                 <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-colors">
                    <Settings size={18} />
                 </button>
                 <button className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-colors">
                    <Maximize size={18} />
                 </button>
              </div>

              {/* Video Element */}
              {selectedTask?.url ? (
                <video
                  key={`video-${selectedIndex}`}
                  autoPlay
                  controlsList="nodownload pwa"
                  onEnded={handleVideoEnd}
                  className="w-full h-full object-cover"
                  src={selectedTask.url?.replace(/^http:\/\//i, "https://")}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#0A4F48] to-[#116D63] text-white flex flex-col items-center justify-center gap-2">
                  <PlayCircle size={48} className="opacity-50" />
                  <p className="text-sm font-semibold opacity-70">
                    No actual video bound exactly to this task in DB
                  </p>
                </div>
              )}

              {/* Custom Track Wrapper Overlay (Bottom) */}
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8 z-10 hidden group-hover:block transition-all duration-300 pointer-events-none">
                 {/* Play Button intersecting track */}
                 <div className="flex gap-4 items-end pointer-events-auto">
                    <button onClick={handlePlaySimulate} className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-[#00A195] text-white flex justify-center items-center shrink-0 hover:scale-105 transition-transform shadow-lg z-20 translate-y-2">
                       <Play size={20} fill="currentColor" className="ml-1" />
                    </button>
                    {/* Track line mapping to fake progress */}
                    <div className="flex-1 pb-1 lg:pb-3 relative">
                       <div className="w-full h-1 lg:h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm cursor-pointer hover:h-2 transition-all">
                          <div className="h-full bg-[#00A195] rounded-full" style={{ width: '40%' }} />
                       </div>
                       <div className="flex justify-between text-white/90 text-[10px] lg:text-[11px] font-bold mt-2 font-mono">
                          <span>04:20</span>
                          <span>12:00</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Mobile Header (Hidden on Desktop) */}
           <div className="block lg:hidden mt-2 mb-2">
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-[#0A4F48] font-black text-2xl tracking-tighter">Upper Body Burn</h2>
                    <p className="text-gray-600 text-[11px] font-bold mt-1">Focus: Deltoids, Triceps & Pectorals</p>
                 </div>
                 <div className="bg-[#E6FFFA] text-[#0A4F48] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm mt-1">
                    <Timer size={14} />
                    <span className="text-[10px] font-black tracking-widest uppercase">12 Min</span>
                 </div>
              </div>
           </div>

           {/* Finish Strong Block (Order flows naturally down here on Desktop) */}
           {/* On mobile, we want this to show exactly at the bottom of the page AFTER tasks. Order-3 puts it there. */}
           {shouldShowSubmissionForm && (
             <div className="bg-[#F4F7F6] lg:bg-[#F8FAFC] rounded-[40px] p-6 lg:p-10 order-3 shadow-none lg:shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#0A4F48]/5 w-full hidden lg:block">
                <FinishStrongForm 
                   effortRating={effortRating}
                   setEffortRating={setEffortRating}
                   comment={comment}
                   setComment={setComment}
                   file={file}
                   fileName={fileName}
                   handleOpenFilePicker={handleOpenFilePicker}
                   handleFileChange={handleFileChange}
                   fileInputRef={fileInputRef}
                   handleSubmit={handleSubmit}
                   uploading={uploading}
                />
             </div>
           )}
        </div>

        {/* =========================================
            RIGHT COLUMN (Tasks List + Expert Tip) 
            ========================================= */}
        <div className="w-full lg:col-span-5 flex flex-col gap-6 order-2">
           <div className="flex justify-between items-end mb-4 lg:mb-6">
              <h3 className="font-black text-[22px] lg:text-[26px] text-gray-900 tracking-tight leading-[1.1]">Workout<br className="hidden lg:block"/>Tasks</h3>
              <div className="bg-[#EAF5F4] text-[#0A4F48] px-4 py-2 rounded-full hidden lg:block">
                 <span className="text-[10px] font-black tracking-widest flex items-center gap-2">
                    {workoutTasks.filter((_, idx) => !watchedVideos.has(idx)).length} EXERCISES REMAINING
                 </span>
              </div>
              <span className="text-[9px] font-black tracking-widest text-gray-500 uppercase block lg:hidden">
                 WORKOUT TASKS
              </span>
           </div>

           <div className="flex flex-col gap-4">
              {workoutTasks.map((task, idx) => {
                 const isCompleted = watchedVideos.has(idx) || idx < selectedIndex;
                 const isActive = idx === selectedIndex;
                 const isUpcoming = idx > selectedIndex;
                 const unlocked = isUnlocked(idx);

                 // Mock expanded UI specifically for the Active task to match the mockup completely
                 if (isActive) {
                    return (
                      <div key={idx} className="bg-white rounded-[32px] border-[3px] border-[#0A4F48] p-5 lg:p-6 shadow-[0_10px_20px_rgba(10,79,72,0.1)] relative">
                         <div className="w-5 h-5 rounded-full bg-[#E6FFFA] absolute top-5 right-5 lg:top-6 lg:right-6 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#0A4F48]" />
                         </div>

                         <div className="pr-8">
                            <h4 className="font-black text-gray-900 text-lg leading-tight lg:text-xl">{task.name || `Exercise ${idx + 1}`}</h4>
                            <p className="text-gray-600 text-[11px] font-bold mt-1 lg:mt-2 tracking-wide">In Progress • Set 2 of 3</p>
                         </div>

                         {/* Mock Set Layout exactly matching image */}
                         <div className="mt-8 flex flex-col gap-5 border-t border-gray-100 pt-5">
                            {/* Set 1 Completed */}
                            <div className="flex items-center justify-between">
                               <span className="text-gray-400 font-bold text-[12px] w-12 text-left">Set 1</span>
                               <span className="text-gray-800 font-bold text-[12px] flex-1 text-center pr-4">10 Reps @ 15kg</span>
                               <div className="w-5 h-5 flex items-center justify-center rounded-full">
                                  <Check size={16} strokeWidth={4} className="text-[#00A195]" />
                               </div>
                            </div>

                            {/* Set 2 Active Input */}
                            <div className="flex items-center justify-between bg-[#EAF1F0] -mx-4 px-4 py-3 rounded-[16px] relative left-0 right-0">
                               <span className="text-[#0A4F48] font-bold text-[12px] w-12 text-left">Set 2</span>
                               <div className="flex items-center justify-center flex-1 gap-2">
                                  <div className="w-14 h-8 bg-white border border-[#DCE4E3] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-center overflow-hidden">
                                    <span className="font-black text-[#0A4F48] text-[14px]">1</span>
                                  </div>
                                  <span className="text-[#0A4F48] font-bold text-[12px]">Reps</span>
                               </div>
                               <button className="w-7 h-7 bg-[#0A4F48] rounded-[8px] flex items-center justify-center text-[#71FEE2] hover:scale-105 transition-transform shadow-[0_4px_12px_rgba(10,79,72,0.3)]">
                                  <Play size={13} fill="currentColor" className="ml-0.5" />
                               </button>
                            </div>

                            {/* Set 3 Upcoming */}
                            <div className="flex items-center justify-between">
                               <span className="text-gray-300 font-bold text-[12px] w-12 text-left">Set 3</span>
                               <span className="text-gray-300 font-bold text-[12px] flex-1 text-center pr-4">-- Reps</span>
                               <div className="w-5 h-5 flex items-center justify-center">
                                  <Circle size={16} strokeWidth={2.5} className="text-gray-200" />
                               </div>
                            </div>
                         </div>
                      </div>
                    )
                 }

                 // Completed
                 if (isCompleted) {
                    return (
                      <div key={idx} className="bg-white rounded-[32px] border-[3px] border-[#0A4F48] p-5 lg:p-6 shadow-sm flex flex-col gap-3 relative cursor-pointer" onClick={() => handleTaskClick(idx)}>
                         <div className="flex justify-between items-start">
                            <div className="pr-10">
                               <h4 className="font-black text-gray-800 text-lg leading-tight group-hover:text-[#0A4F48] transition-colors">{task.name || `Exercise ${idx + 1}`}</h4>
                               <p className="text-gray-400 text-[11px] font-bold mt-1">Triceps & Chest Focus</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-[#0A4F48] text-white flex justify-center items-center shrink-0 absolute top-5 right-5 lg:top-6 lg:right-6">
                               <Check size={14} strokeWidth={4} />
                            </div>
                         </div>
                         <div className="flex gap-2 mt-1">
                            <span className="bg-[#EAF5F4] text-[#0A4F48] text-[10px] font-black px-4 py-1.5 rounded-full tracking-wide">3 Sets</span>
                            <span className="bg-[#EAF5F4] text-[#0A4F48] text-[10px] font-black px-4 py-1.5 rounded-full tracking-wide">12 Reps</span>
                         </div>
                      </div>
                    )
                 }

                 // Pending Down the list
                 return (
                    <div key={idx} className={`bg-transparent ${!unlocked ? "opacity-50" : ""} rounded-[32px] border-2 border-dashed border-gray-200 p-5 lg:p-6 flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-1 transition-all cursor-pointer hover:border-gray-300`} onClick={() => handleTaskClick(idx)}>
                       <h4 className="font-black text-gray-400 text-lg leading-tight lg:text-md tracking-wide">{task.name || `Exercise ${idx + 1}`}</h4>
                       <p className="text-gray-400 text-[11px] font-bold">3 Sets • 8 Reps</p>
                    </div>
                 )
              })}
           </div>

           {/* Mobile Finish Strong form needs to sit exactly here (order-3 Mobile) */}
           {shouldShowSubmissionForm && (
             <div className="bg-[#F4F7F6] lg:bg-[#F8FAFC] rounded-[40px] p-6 lg:p-10 order-3 shadow-none lg:shadow-[0_4px_30px_rgba(0,0,0,0.02)] w-full block lg:hidden mt-6">
                <FinishStrongForm 
                   effortRating={effortRating}
                   setEffortRating={setEffortRating}
                   comment={comment}
                   setComment={setComment}
                   file={file}
                   fileName={fileName}
                   handleOpenFilePicker={handleOpenFilePicker}
                   handleFileChange={handleFileChange}
                   fileInputRef={fileInputRef}
                   handleSubmit={handleSubmit}
                   uploading={uploading}
                />
             </div>
           )}

           {/* Expert Tip (Desktop Only) */}
           <div className="hidden lg:block mt-auto bg-[#FDE9DD] rounded-[32px] p-8 relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-3 z-10 relative">
                 <div className="w-5 h-5 flex items-center justify-center">
                    <Lightbulb size={20} className="text-[#3A2A20]" strokeWidth={2.5} />
                 </div>
                 <h4 className="text-[#3A2A20] font-black text-[12px] tracking-widest uppercase">Expert Tip</h4>
              </div>
              <p className="text-[#845E47] text-[13px] font-bold leading-relaxed pr-8 z-10 relative">
                 Keep your core tight during the overhead press to protect your lower back and maximize power output.
              </p>
              {/* Decorative faint icon back right */}
              <Dumbbell size={100} className="text-[#845E47] absolute -bottom-6 -right-6 opacity-[0.08] transform -rotate-45" />
           </div>

        </div>
      </div>

      {overallWorkoutStatus !== "todo" && (
         <div className="max-w-[1400px] mx-auto p-4 lg:p-8">
            <div className="bg-white rounded-[32px] p-8 text-center border-2 border-[#0A4F48] shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
               <CheckCircle2 size={40} className={`mx-auto mb-3 \${overallWorkoutStatus === "verified" ? "text-[#0A4F48]" : "text-yellow-500"}`} />
               <h3 className="font-black text-xl text-[#0A4F48] tracking-tighter uppercase mb-2">Workout {overallWorkoutStatus}</h3>
               <p className="text-gray-500 font-bold text-sm">
                 {overallWorkoutStatus === "verified" ? "Great job, your form looked excellent on those reps!" : "Awesome burn! Sent to your coach for review."}
               </p>
            </div>
         </div>
      )}

      <div className="lg:hidden block h-10 w-full" />
      <MobileBottomNav />
    </div>
  );
}

// Extracted FinishStrong component since we need it in two places conditionally based on breakpoint order flow
function FinishStrongForm({ effortRating, setEffortRating, comment, setComment, file, fileName, handleOpenFilePicker, handleFileChange, fileInputRef, handleSubmit, uploading }) {
  return (
    <>
      <div className="flex justify-between items-start mb-8 lg:mb-12">
        <div>
          <h2 className="text-[#0A4F48] font-black text-[24px] lg:text-[28px] tracking-tighter leading-tight drop-shadow-xs">Finish Strong</h2>
          <p className="text-gray-500 text-[13px] lg:text-[14px] font-bold mt-1 lg:mt-2">Reflect on your effort today.</p>
        </div>
        <div className="shrink-0 mt-1">
          <CheckCircle2 size={32} strokeWidth={2} className="text-[#0A4F48]" />
        </div>
      </div>

      <div className="mb-8 lg:mb-10">
        <label className="block text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-gray-500 mb-4 lg:mb-6 pl-1">
          Rate of Perceived Exertion (RPE)
        </label>
        
        <div className="flex justify-between items-center gap-1.5 lg:gap-3 w-full max-w-[500px] overflow-x-auto pb-2 scrollbar-hide">
          {rpeScale.map(({ value, label }) => {
             const isActive = effortRating === value;
             return (
                <div key={value} className={`relative shrink-0 flex items-center justify-center transition-all ${isActive ? "p-1.5 rounded-full bg-[#D2EFEC]" : "p-1.5"} mx-0.5`}>
                   <button
                      type="button"
                      onClick={() => setEffortRating(value)}
                      className={`relative flex flex-col items-center gap-1 transition-all rounded-full h-16 w-10 lg:h-20 lg:w-12 pt-3 outline-none ${isActive ? "bg-[#0A4F48] shadow-lg transform -translate-y-0.5" : "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-gray-50"}`}
                   >
                      <span className={`font-black text-[16px] lg:text-[20px] tracking-tight ${isActive ? "text-[#71FEE2]" : "text-gray-800"}`}>{value}</span>
                      {label && (
                         <span className={`text-[7px] lg:text-[8px] font-black uppercase tracking-widest mt-auto mb-3 absolute bottom-0 ${isActive ? "text-white" : "text-gray-400"}`}>{label}</span>
                      )}
                   </button>
                </div>
             )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <div className="flex flex-col h-full">
          <label className="block text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3 pl-1">
            Session Notes
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How did it feel? Any personal bests?"
            className="w-full flex-1 min-h-[120px] rounded-[24px] lg:rounded-[32px] border-none bg-[#E7EBEB] lg:bg-[#EAEFEF] px-6 py-5 text-sm lg:text-[15px] font-medium text-gray-700 resize-none hover:bg-gray-200 focus:outline-none focus:ring-0 placeholder-gray-400/80 transition-all outline-hidden shadow-inner"
          />
        </div>

        <div className="flex flex-col h-full">
          <label className="block text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-gray-500 mb-3 pl-1">
            Log Visual Progress
          </label>
          <div
            onClick={handleOpenFilePicker}
            className="w-full flex-1 min-h-[120px] flex flex-col items-center justify-center gap-3 lg:gap-4 rounded-[24px] lg:rounded-[32px] border-2 border-dashed border-gray-300 lg:border-white bg-transparent lg:bg-white hover:border-[#0A4F48]/40 hover:bg-white/50 transition-all cursor-pointer overflow-hidden p-6"
          >
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#E6FFFA] flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={24} className="text-[#0A4F48]" />
                </div>
                <span className="text-xs font-black text-[#0A4F48] truncate max-w-[150px] lg:max-w-full text-center tracking-wide">
                  {fileName}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileChange({ target: { files: [] } }); // reset
                  }}
                  className="text-[9px] text-[#0A4F48] bg-transparent opacity-80 font-black uppercase tracking-widest hover:underline mt-1"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#EAEFEF] flex items-center justify-center">
                  <Camera size={20} className="text-[#0A4F48]" strokeWidth={2.5} />
                </div>
                <p className="text-[12px] font-bold text-gray-500 tracking-tight text-center">
                  Drop photo or video here
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="workout-proof-upload"
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
        className="w-full bg-[#0A4F48] text-white disabled:bg-[#D4E4E0] disabled:text-gray-400 disabled:cursor-not-allowed rounded-[32px] py-4 lg:py-5 text-[15px] lg:text-[16px] font-black tracking-wide transition-all shadow-[0_10px_30px_rgba(10,79,72,0.3)] hover:shadow-lg hover:scale-[1.01] active:scale-95 flex items-center justify-center mt-2 group"
      >
        {uploading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Submitting Block...</span>
          </div>
        ) : (
          <span>Complete My Workout</span>
        )}
      </button>
    </>
  );
}

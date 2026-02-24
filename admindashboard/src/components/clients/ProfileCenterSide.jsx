/* eslint-disable react-hooks/preserve-manual-memoization */
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserSubmissions } from "@/redux/features/tasks/task.thunk";
import { 
  Activity, 
  Scale, 
  Files, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  Utensils,
  BicepsFlexed,
  HeartPulse,
  BookMarked
} from "lucide-react";

const statusConfig = {
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
  Verified: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
  Skipped: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: AlertCircle },
  Missed: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle },
  Pending: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: Clock },
};

const ProfileCenterSide = ({ client }) => {
  const dispatch = useDispatch();
  const { selectedUserTasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (client?._id) {
      dispatch(getAllUserSubmissions(client?._id));
    }
  }, [client?._id, dispatch]);

  const todaysTasks = useMemo(() => {
    if (!selectedUserTasks || !client) return [];

    // Filter for current global day
    const currentDayTasks = selectedUserTasks.filter(
      (task) => task.globalDayIndex === client.currentGlobalDay,
    );

    return currentDayTasks.map((task) => {
      let status = "Pending";
      if (task.status === "verified") status = "Completed";
      else if (task.status === "skipped") status = "Skipped";
      else if (task.status === "rejected") status = "Missed"; 
      else if (task.status === "missed") status = "Missed";

      return {
        heading: task.taskType || "Task",
        contend:
          task.notes ||
          (task.exerciseIndex !== undefined
            ? `Exercise ${task.exerciseIndex + 1}`
            : "No details"),
        status: status,
      };
    });
  }, [selectedUserTasks, client?.currentGlobalDay]);

  const healthDetails = [
    {
      heading: "Medical Conditions",
      data: client?.medicalConditions,
      icon: Activity,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      heading: "Allergies",
      data: client?.allergies,
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      heading: "Food Preference",
      data: [client?.foodPreferences],
      icon: Utensils,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      heading: "Fitness Goal",
      data: [client?.goals || client?.programType?.title],
      icon: BicepsFlexed,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      heading: "Current Weight",
      data: [`${client?.currentWeight} kg`],
      icon: Scale,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      heading: "Target Weight",
      data: [`${client?.targetWeight} kg`],
      icon: Scale,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  // Calculate progress percentage safely
  const progressPercent = useMemo(() => {
     if (!client?.programType?.plan?.duration) return 0;
     const totalDays = parseInt(client.programType.plan.duration.split(" ")[0]);
     if (!totalDays) return 0;
     return Math.min(100, Math.max(0, (client.currentGlobalDay / totalDays) * 100));
  }, [client]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Health Stats Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <HeartPulse size={18} />
            </div>
            <h2 className="font-bold text-[#1E293B] text-lg">
              Health Snapshot
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {healthDetails.map((item, i) => {
            const Icon = item.icon || Activity;
            return (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all hover:shadow-md ${item.bg ? item.bg : "bg-slate-50"} border-transparent`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={item.color || "text-slate-500"} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {item.heading}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#1E293B] leading-tight wrap-break-words">
                  {item.data && item.data.length > 0 && item.data[0]
                    ? item.data.join(", ")
                    : "N/A"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Current Program Progress */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <BookMarked size={18} />
            </div>
            <h2 className="font-bold text-[#1E293B] text-lg">Current Plan</h2>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Info */}
          <div className="flex flex-wrap gap-4 justify-between items-center p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                Program
              </span>
              <span className="text-sm font-bold text-[#1E293B]">
                {client?.programType?.title || "No Program"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#64748B] block mb-1">
                Duration
              </span>
              <span className="text-sm font-bold text-[#1E293B]">
                {client?.programType?.plan?.duration || "N/A"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-[#334155]">
                Overall Progress
              </span>
              <span className="text-xl font-black text-[#0A4F48]">
                {progressPercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#0A4F48] to-[#116D63] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 text-right">
              <span className="text-[10px] font-medium text-[#64748B]">
                Day {client?.currentGlobalDay || 0} of{" "}
                {parseInt(
                  client?.programType?.plan?.duration?.split(" ")[0] || 0,
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's Tasks */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Files size={18} />
            </div>
            <h2 className="font-bold text-[#1E293B] text-lg">Today's Tasks</h2>
          </div>
          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold">
            {todaysTasks.length}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {todaysTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3 border-2 border-dashed border-slate-100 rounded-2xl">
              <Files size={32} strokeWidth={1.5} />
              <span className="text-sm font-medium">
                No tasks scheduled for today
              </span>
            </div>
          ) : (
            todaysTasks.map((task, i) => {
              const style = statusConfig[task.status] || statusConfig.Pending;
              const StatusIcon = style.icon;

              return (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-[#F1F5F9] bg-white hover:border-[#E2E8F0] transition-colors group"
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${style.bg} ${style.text}`}
                  >
                    <StatusIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="text-sm font-bold text-[#1E293B] truncate mb-0.5">
                      {task.heading}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-2">
                      {task.contend}
                    </p>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-lg border ${style.bg} ${style.border} ${style.text} shrink-0`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {task.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};


export default ProfileCenterSide;

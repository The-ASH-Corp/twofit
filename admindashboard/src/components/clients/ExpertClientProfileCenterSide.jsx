import { assets } from "@/assets/asset";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyTask, rejectTask } from "@/redux/features/tasks/task.thunk";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import {
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Activity,
  AlertCircle,
  Utensils,
  BicepsFlexed,
  Scale,
  BookMarked,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { selectUser } from "@/redux/features/auth/auth.selectores";

const ExpertClientProfileCenterSide = ({ client, pendingTasks }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(null); // stores task ID being processed
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [concerns, setConcerns] = useState([]);
  const [concernsLoading, setConcernsLoading] = useState(false);
  const [concernSubmitting, setConcernSubmitting] = useState(false);
  const [deletingConcernId, setDeletingConcernId] = useState(null);
  const [editingConcernId, setEditingConcernId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    percentage: "",
    status: "Improved",
  });

  // Group tasks for THIS client by day
  const groupedTasks = useMemo(() => {
    if (!pendingTasks || !client?._id) return [];

    let clientTasks = pendingTasks.filter(
      (task) => task.userId?._id === client?._id,
    );

    // Filter based on Expert Role
    if (user?.role) {
      const lowerRole = user.role.toLowerCase();
      if (lowerRole.includes("trainer")) {
        clientTasks = clientTasks.filter((t) => t.taskType === "Workout");
      } else if (
        lowerRole.includes("dietician") ||
        lowerRole.includes("dietitian")
      ) {
        clientTasks = clientTasks.filter((t) => t.taskType === "Meal");
      } else if (lowerRole.includes("therapist")) {
        clientTasks = clientTasks.filter((t) => t.taskType === "Therapy");
      }
    }

    if (clientTasks.length === 0) return [];

    const groups = {};
    clientTasks.forEach((task) => {
      const key = task.globalDayIndex;
      if (!groups[key]) {
        groups[key] = {
          globalDayIndex: task.globalDayIndex,
          weekIndex: task.weekIndex,
          dayIndex: task.dayIndex,
          tasks: [],
          createdAt: task.createdAt,
        };
      }
      groups[key].tasks.push(task);
    });

    return Object.values(groups).sort(
      (a, b) => b.globalDayIndex - a.globalDayIndex,
    );
  }, [pendingTasks, client?._id, user?.role]);

  const resetConcernForm = () => {
    setForm({ name: "", percentage: "", status: "Improved" });
    setEditingConcernId(null);
  };

  const closeConcernDrawer = () => {
    setOpen(false);
    resetConcernForm();
  };

  useEffect(() => {
    let isMounted = true;

    const loadConcerns = async () => {
      if (!client?._id) {
        setConcerns([]);
        return;
      }

      setConcernsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/health-concern?userId=${client._id}`,
        );
        if (isMounted) {
          setConcerns(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error.response?.data?.message || "Failed to load health concerns",
          );
        }
      } finally {
        if (isMounted) setConcernsLoading(false);
      }
    };

    loadConcerns();

    return () => {
      isMounted = false;
    };
  }, [client?._id]);

  const handleConcernInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditConcern = (concern) => {
    setEditingConcernId(concern._id);
    setForm({
      name: concern.name || "",
      percentage: concern.percentage ?? "",
      status: concern.status === "Reversed" ? "Improved" : concern.status || "Improved",
    });
    setOpen(true);
  };

  const handleSaveConcern = async () => {
    const percentage = Number(form.percentage);

    if (!client?._id) {
      toast.error("Client details are still loading");
      return;
    }

    if (!form.name.trim()) {
      toast.info("Please enter a health concern");
      return;
    }

    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      toast.info("Progress must be between 0 and 100");
      return;
    }

    setConcernSubmitting(true);
    try {
      const payload = {
        userId: client._id,
        name: form.name.trim(),
        percentage,
        status: form.status,
      };

      const response = editingConcernId
        ? await axiosInstance.put(`/health-concern/${editingConcernId}`, payload)
        : await axiosInstance.post("/health-concern", payload);

      const savedConcern = response?.data;
      setConcerns((prev) => {
        if (editingConcernId) {
          return prev.map((item) =>
            item._id === editingConcernId ? savedConcern : item,
          );
        }
        return [savedConcern, ...prev];
      });
      toast.success(
        editingConcernId
          ? "Health concern updated"
          : "Health concern added",
      );
      closeConcernDrawer();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save health concern",
      );
    } finally {
      setConcernSubmitting(false);
    }
  };

  const handleDeleteConcern = async (concernId) => {
    setDeletingConcernId(concernId);
    try {
      await axiosInstance.delete(`/health-concern/${concernId}`);
      setConcerns((prev) => prev.filter((item) => item._id !== concernId));
      toast.success("Health concern deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete health concern",
      );
    } finally {
      setDeletingConcernId(null);
    }
  };

  const toggleTask = (index) => {
    setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "verified":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: CheckCircle2,
        };
      case "rejected":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: XCircle,
        };
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: Clock,
        };
      case "skipped":
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          icon: AlertCircle,
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-500",
          border: "border-slate-200",
          icon: Activity,
        };
    }
  };

  const normalizeEffortRating = (item) => {
    const raw = item?.effortRating;
    if (!raw) return null;
    if (typeof raw === "number")
      return { ratingNumber: raw, ratingLabel: "", ratingDescription: "" };
    return {
      ratingNumber: Number(raw?.ratingNumber) || 0,
      ratingLabel: raw?.ratingLabel || "",
      ratingDescription: raw?.ratingDescription || "",
    };
  };

  const handleApprove = async (taskGroup) => {
    setProcessing(`approve-${taskGroup.globalDayIndex}`);
    try {
      const pendingTasksToVerify = taskGroup.tasks.filter(
        (t) => t.status === "pending",
      );
      for (const task of pendingTasksToVerify) {
        await dispatch(verifyTask(task?._id)).unwrap();
      }
      toast.success("Tasks approved successfully");
    } catch (error) {
      toast.error(error || "Failed to approve tasks");
    } finally {
      setProcessing(null);
    }
  };

  const handleImprove = async (taskGroup) => {
    if (!comment) {
      toast.info("Please provide a comment for improvement");
      return;
    }
    setProcessing(`reject-${taskGroup.globalDayIndex}`);
    try {
      const pendingTasksToReject = taskGroup.tasks.filter(
        (t) => t.status === "pending",
      );
      for (const task of pendingTasksToReject) {
        await dispatch(rejectTask({ id: task?._id, comment })).unwrap();
      }
      toast.success("Feedback sent to client");
      setComment("");
    } catch (error) {
      toast.error(error || "Failed to send feedback");
    } finally {
      setProcessing(null);
    }
  };

  const healthDetails = [
    {
      heading: "Medical Conditions",
      data: client?.medicalConditions?.length
        ? client.medicalConditions.join(", ")
        : "None",
      icon: Activity,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      heading: "Allergies",
      data: client?.allergies?.length ? client.allergies.join(", ") : "None",
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      heading: "Food Preference",
      data: [client?.foodPreferences || "Veg"],
      icon: Utensils,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      heading: "Fitness Goal",
      data: [client?.goals || client?.programType?.title || "N/A"],
      icon: BicepsFlexed,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      heading: "Current Weight",
      data: [`${client?.currentWeight || "N/A"} kg`],
      icon: Scale,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      heading: "Target Weight",
      data: [`${client?.targetWeight || "N/A"} kg`],
      icon: Scale,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const progressPercent = useMemo(() => {
    if (!client?.programType?.plan?.duration) return 0;
    const totalDays = parseInt(client.programType.plan.duration.split(" ")[0]);
    if (!totalDays) return 0;
    return Math.min(
      100,
      Math.max(0, (client.currentGlobalDay / totalDays) * 100),
    );
  }, [client]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Health Stats Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <HeartPulse size={18} />
          </div>
          <h2 className="font-bold text-[#1E293B] text-lg">Health Snapshot</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthDetails.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all hover:shadow-md ${item.bg} border-transparent`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={item.color} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {item.heading}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#1E293B] leading-tight wrap-break-word">
                  {Array.isArray(item.data) ? item.data.join(", ") : item.data}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center gap-4">
          <h2 className="font-bold text-[#1E293B] text-lg">Health Concerns</h2>
          <button
            onClick={() => {
              resetConcernForm();
              setOpen(true);
            }}
            className="bg-[#0A4F48] text-white text-sm font-bold rounded-xl px-4 py-2 hover:bg-[#083d37] transition-all disabled:opacity-50"
            disabled={!client?._id}
          >
            + Add Concern
          </button>
        </div>
        {open && (
          <div className="fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl border-l border-gray-200 z-50 transition-transform duration-300">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-[#0A4F48]">
                {editingConcernId ? "Edit Health Concern" : "Add Health Concern"}
              </h2>
              <button
                className="w-9 h-9 rounded-lg text-gray-500 hover:text-black hover:bg-slate-100 flex items-center justify-center"
                onClick={closeConcernDrawer}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Concern
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleConcernInputChange}
                  placeholder="e.g. PCOD"
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 focus:border-[#0A4F48]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Progress (%)
                </label>
                <input
                  name="percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={form.percentage}
                  onChange={handleConcernInputChange}
                  placeholder="0 - 100"
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 focus:border-[#0A4F48]"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleConcernInputChange}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 focus:border-[#0A4F48]"
                >
                  <option value="Improved">Improved</option>
                  <option value="Decreased">Decreased</option>
                </select>
              </div>
            </div>

            <div className="absolute bottom-0 w-full p-5 bg-white border-t border-slate-100">
              <button
                onClick={handleSaveConcern}
                disabled={concernSubmitting}
                className="w-full text-white py-2.5 rounded-lg hover:bg-[#083d37] transition bg-[#0A4F48] font-bold disabled:opacity-50"
              >
                {concernSubmitting ? "Saving..." : "Save Concern"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {concernsLoading ? (
            <div className="text-sm font-medium text-slate-400 py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              Loading health concerns...
            </div>
          ) : concerns.length === 0 ? (
            <div className="text-sm font-medium text-slate-400 py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              No health concerns added yet
            </div>
          ) : (
            concerns.map((item) => (
              <div
                key={item._id}
                className="p-4 border border-slate-100 rounded-2xl bg-slate-50/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-sm font-bold text-[#1E293B] truncate">
                      {item.name}
                    </span>
                    <span
                      className={`inline-flex mt-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "Decreased"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-lg font-black text-[#0A4F48]">
                      {item.percentage}%
                    </span>
                    <button
                      onClick={() => handleEditConcern(item)}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#0A4F48] hover:border-[#0A4F48]/30 flex items-center justify-center"
                      title="Edit concern"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteConcern(item._id)}
                      disabled={deletingConcernId === item._id}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center disabled:opacity-50"
                      title="Delete concern"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      item.status === "Decreased"
                        ? "bg-rose-400"
                        : "bg-[#0A4F48]"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, item.percentage || 0),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Program Progress */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <BookMarked size={18} />
          </div>
          <h2 className="font-bold text-[#1E293B] text-lg">Current Program</h2>
        </div>
        <div className="flex flex-col gap-6">
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
          </div>
        </div>
      </div>

      {/* 3. Task History */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF2F6] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <History size={18} />
            </div>
            <h2 className="font-bold text-[#1E293B] text-lg">
              Task History & Review
            </h2>
          </div>
          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold">
            {groupedTasks.length} Days Logged
          </span>
        </div>

        {groupedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3 border-2 border-dashed border-slate-100 rounded-2xl">
            <History size={32} strokeWidth={1.5} />
            <span className="text-sm font-medium">
              No submissions found for review
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {groupedTasks.map((group, gIndex) => {
              const hasPending = group.tasks.some(
                (t) => t.status === "pending",
              );
              const isExpanded = expandedTaskIndex === gIndex;
              return (
                <div
                  key={gIndex}
                  className={`rounded-2xl border transition-all ${hasPending ? "border-amber-200 bg-amber-50/20" : "border-slate-100 bg-white"}`}
                >
                  <button
                    onClick={() => toggleTask(gIndex)}
                    className="w-full flex items-center justify-between p-4 focus:outline-none"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${hasPending ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        <span className="text-[10px] uppercase leading-none mb-1 opacity-70">
                          Day
                        </span>
                        <span className="text-lg leading-none">
                          {group.globalDayIndex}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1E293B]">
                          Submissions for Day {group.globalDayIndex}
                        </span>
                        <span className="text-xs text-[#64748B] font-medium">
                          {new Date(group.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${hasPending ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        {group.tasks.length}{" "}
                        {group.tasks.length === 1 ? "Task" : "Tasks"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={20} className="text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="h-px bg-slate-100 w-full mb-2"></div>
                      {group.tasks.map((task) => {
                        const style = getStatusStyle(task.status);
                        const Icon = style.icon;
                        const effort = normalizeEffortRating(task);
                        return (
                          <div
                            key={task?._id}
                            className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg ${style.bg} ${style.text}`}
                                >
                                  <Icon size={18} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-[#1E293B]">
                                    {task.taskType}
                                  </span>
                                  {task.exerciseIndex !== undefined && (
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                      Exercise {task.exerciseIndex + 1}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div
                                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.border} ${style.text}`}
                              >
                                {task.status}
                              </div>
                            </div>

                            {task.notes && (
                              <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 mb-3 border border-slate-100/50 italic flex items-start gap-2">
                                <MessageSquare
                                  size={14}
                                  className="shrink-0 mt-0.5 opacity-50"
                                />
                                "{task.notes}"
                              </div>
                            )}

                            {effort && (
                              <div className="flex items-center gap-3 mb-3 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                                <div className="bg-[#0A4F48] text-white text-[10px] font-black w-6 h-6 rounded flex items-center justify-center shrink-0">
                                  {effort.ratingNumber}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-emerald-800/60 uppercase">
                                    Effort Rating (RPE)
                                  </span>
                                  <span className="text-[11px] font-bold text-[#0A4F48]">
                                    {effort.ratingLabel || "N/A"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {task.file && (
                              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 mb-3 group/media relative">
                                {task.file.match(/\.(mp4|webm|ogg)$/i) ? (
                                  <video
                                    src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${task.file}`}
                                    controls
                                    className="w-full max-h-[350px] object-contain"
                                  />
                                ) : (
                                  <img
                                    src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${task.file}`}
                                    alt="Proof"
                                    className="w-full max-h-[400px] object-contain"
                                  />
                                )}
                              </div>
                            )}

                            {task.adminComment && (
                              <div className="mt-2 text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg border border-rose-100">
                                Feedback: "{task.adminComment}"
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {hasPending && (
                        <div className="mt-4 p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-4 shadow-sm">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                              Review Feedback
                            </label>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="What would you like to tell the client? (Required for revision)"
                              className="w-full h-24 text-sm border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-[#0A4F48]/10 focus:border-[#0A4F48] transition-all bg-slate-50/50"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleImprove(group)}
                              disabled={!!processing}
                              className="flex-1 px-4 py-3 border border-rose-200 text-rose-500 rounded-xl hover:bg-rose-50 transition-all font-bold text-sm disabled:opacity-50"
                            >
                              {processing === `reject-${group.globalDayIndex}`
                                ? "Sending..."
                                : "Request Revision"}
                            </button>
                            <button
                              onClick={() => handleApprove(group)}
                              disabled={!!processing}
                              className="flex-1 px-4 py-3 bg-[#0A4F48] text-white rounded-xl hover:bg-[#083d37] transition-all font-bold text-sm shadow-lg shadow-emerald-900/10 disabled:opacity-50"
                            >
                              {processing === `approve-${group.globalDayIndex}`
                                ? "Approving..."
                                : "Approve Day"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertClientProfileCenterSide;

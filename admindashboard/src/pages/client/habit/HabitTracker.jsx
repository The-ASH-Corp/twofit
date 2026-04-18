import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHabitReflectionThunk,
  getClientHabitsThunk,
  updateHabitReflectionThunk,
  updateHabitStatusThunk,
} from "@/redux/features/habit/habit.thunk";
import { fetchClientAdherenceStreaks } from "@/redux/features/client/client.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import {
  ArrowRight,
  Check,
  Droplets,
  Dumbbell,
  Footprints,
  Moon,
  PencilLine,
  Play,
  Target,
  Zap,
} from "lucide-react";
import { SyncLoader } from "react-spinners";
import { addDays, format, startOfWeek } from "date-fns";
import MobileBottomNav from "../components/MobileBottomNav";

export const dualEdgeDepthShadow = {
  boxShadow:
    "-9px 10px 18px rgba(14, 29, 23, 0.24), -3px 4px 8px rgba(14, 29, 23, 0.16), 9px -9px 16px rgba(255, 255, 255, 0.92), 4px -3px 8px rgba(255, 255, 255, 0.78)",
};

export const reflectionFieldDepthShadow = {
  boxShadow:
    "inset 7px 7px 14px rgba(196, 207, 201, 0.72), inset -7px -7px 14px rgba(255, 255, 255, 0.92), -4px 6px 12px rgba(14, 29, 23, 0.12), 3px -3px 8px rgba(255, 255, 255, 0.72)",
};

export const protocolIconDepthShadow = {
  boxShadow:
    "-5px 7px 12px rgba(14, 29, 23, 0.2), 5px -5px 10px rgba(255, 255, 255, 0.86), inset 1px 1px 2px rgba(255, 255, 255, 0.52)",
};

export default function HabitTracker() {
  const dispatch = useDispatch();
  const [reflectionNotes, setReflectionNotes] = useState("");
  const user = useSelector(selectUser);
  const clientId = user?._id;
  const { habits, loading, reflectionSaving } = useSelector(
    (state) => state.habit,
  );
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (clientId) {
      dispatch(getClientHabitsThunk(clientId));
      dispatch(getHabitReflectionThunk(clientId))
        .unwrap()
        .then((res) => {
          setReflectionNotes(res?.note || "");
        });
      dispatch(fetchClientAdherenceStreaks(clientId))
        .unwrap()
        .then((res) => {
          if (res?.habit) {
            setStreak(res.habit.activeStreak || 0);
          }
        });
    }
  }, [clientId, dispatch]);

  const todayStr = format(new Date(), "EEEE, MMMM dd");
  const todayKey = new Date().toDateString();

  const processedHabits = useMemo(() => {
    if (!habits?.habits) return [];
    return habits.habits.map((habit) => {
      const todayLog = (habit.logs || []).find(
        (log) => new Date(log.date).toDateString() === todayKey,
      );
      return { ...habit, todayStatus: todayLog?.status || "missed" };
    });
  }, [habits, todayKey]);

  const doneCount = processedHabits.filter(
    (habit) => habit.todayStatus === "done",
  ).length;
  const missedCount = processedHabits.filter(
    (habit) => habit.todayStatus === "missed",
  ).length;
  const totalHabits = processedHabits.length;
  const completionPercent =
    totalHabits > 0 ? Math.round((doneCount / totalHabits) * 100) : 0;

  const weeklyStatus = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, index) =>
      addDays(weekStart, index),
    );

    const dayMetrics = days.map((date) => {
      const dayKey = date.toDateString();
      const dayDone = processedHabits.reduce((count, habit) => {
        const dayLog = (habit.logs || []).find(
          (log) => new Date(log.date).toDateString() === dayKey,
        );
        return count + (dayLog?.status === "done" ? 1 : 0);
      }, 0);

      const completion = totalHabits > 0 ? dayDone / totalHabits : 0;

      return {
        date,
        completion,
        isToday: dayKey === todayKey,
      };
    });

    const average =
      dayMetrics.length > 0
        ? Math.round(
            (dayMetrics.reduce((sum, day) => sum + day.completion, 0) /
              dayMetrics.length) *
              100,
          )
        : 0;

    return { dayMetrics, average };
  }, [processedHabits, totalHabits, todayKey]);

  const handleChecklistToggle = (habitId, currentStatus) => {
    let nextStatus = "done";
    if (currentStatus === "done") nextStatus = "missed";
    else if (currentStatus === "missed") nextStatus = "done";

    dispatch(updateHabitStatusThunk({ clientId, habitId, status: nextStatus }));
  };

  const handleSaveReflection = () => {
    if (!clientId) return;
    dispatch(updateHabitReflectionThunk({ clientId, note: reflectionNotes }));
  };

  const getHabitIcon = (name = "") => {
    const lowered = name.toLowerCase();
    if (lowered.includes("water")) return Droplets;
    if (lowered.includes("walk") || lowered.includes("step")) return Footprints;
    if (
      lowered.includes("exercise") ||
      lowered.includes("gym") ||
      lowered.includes("workout")
    ) {
      return Dumbbell;
    }
    if (lowered.includes("sleep") || lowered.includes("bed")) return Moon;
    return Target;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );
  }

  if (!habits || !habits.habits?.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh] text-center p-8 bg-white rounded-[32px] shadow-sm">
        <Target size={48} className="text-gray-200 mb-4" />
        <h3 className="text-lg font-bold text-gray-800">No habits assigned yet</h3>
        <p className="text-sm text-gray-500 max-w-xs mt-1">
          Visit the admin panel to set up your daily rituals.
        </p>
      </div>
    );
  }

  return (
    <div className="client-page-container p-5 sm:p-6 lg:p-7">
      <div className="client-page-shell ">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.85fr_1fr] mt-2.5">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MetricCard
                title="Done Today"
                value={doneCount}
                suffix={`/ ${totalHabits}`}
                accent="text-[#1F2E27]"
                subtitle={`${completionPercent}% complete`}
                progress={completionPercent}
              />
              <MetricCard
                title="Missed"
                value={missedCount}
                suffix="tasks"
                accent="text-[#C31414]"
                subtitle="Catch up to stay on track"
              />
              <MetricCard
                title="Current Streak"
                value={streak}
                suffix="days"
                accent="text-[#0A7B4E]"
                subtitle="New record approaching"
                icon={Zap}
              />
            </div>

            <section className="rounded-[32px]  bg-[#F3F7F5] p-4 sm:p-6 shadow-[0_10px_30px_rgba(15,41,29,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[24px] sm:text-[28px] leading-none font-black text-[#1F2D26]">
                    Today&apos;s Protocol
                  </h2>
                  <p className="mt-2 text-[15px] font-semibold text-[#7B8C83]">
                    Mandatory habits for peak performance
                  </p>
                </div>
                
              </div>

              <div className="mt-5 space-y-3.5">
                {processedHabits.map((habit) => {
                  const Icon = getHabitIcon(habit.name);
                  const status = habit.todayStatus;
                  const statusUI = getStatusUI(status);
                  const ActionIcon = statusUI.icon;

                  return (
                    <div
                      key={habit._id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleChecklistToggle(habit._id, status)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleChecklistToggle(habit._id, status);
                        }
                      }}
                      className="flex items-center justify-between gap-3 rounded-[26px] border border-[#E0E8E4] bg-white px-3.5 py-3.5 sm:px-4 sm:py-4 cursor-pointer transition-all hover:shadow-[0_8px_24px_rgba(15,41,29,0.08)]"
                      style={dualEdgeDepthShadow}
                    >
                      <div className=" flex min-w-0 items-center gap-3">
                        <div
                          className="bg-[#0A7B4E] text-white flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D8E4DE]  "
                          style={protocolIconDepthShadow}
                        >
                          <Icon size={20}/>
                        </div>
                        <div className="min-w-0 ">
                          <p className="truncate text-[14px] sm:text-[16px] leading-none font-black text-[#1F2D26]">
                            {habit.name}
                          </p>
                          <p className="mt-1 text-[10px] sm:text-[12px] font-semibold text-[#7F9087]">
                            {status === "done"
                              ? "Target met for today"
                              : "Target: Complete this habit today"}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                        <div className="hidden sm:block text-right">
                          <p
                            className={`text-[10px] font-black tracking-[0.18em] ${statusUI.labelColor}`}
                          >
                            {statusUI.label}
                          </p>
                          <p className="mt-1 text-[12px] sm:text-[14px] leading-none font-black text-[#34463E]">
                            {statusUI.meta}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleChecklistToggle(habit._id, status);
                          }}
                          className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${statusUI.buttonClass}`}
                          style={protocolIconDepthShadow}
                        >
                          <ActionIcon size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[30px] border border-[#DCE7E1] bg-[linear-gradient(135deg,#F2EAD8_0%,#E4ECE6_40%,#D9E2DD_100%)] p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-xl">
                  <span className="inline-flex rounded-full bg-[#D9EEDC] px-3 py-1 text-[10px] font-black tracking-[0.08em] text-[#0A7B4E]">
                    DAILY INSIGHT
                  </span>
                  <h3 className="mt-3 text-[24px] sm:text-[30px] leading-[1.1] font-black text-[#24342C]">
                    Consistency is the bridge between goals and accomplishment.
                  </h3>
                  <p className="mt-2 text-[18px] sm:text-[20px] font-bold text-[#5D6D65]">- Jim Rohn</p>
                </div>
                
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-[30px] border border-[#DCE7E1] bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,41,29,0.04)]" style={dualEdgeDepthShadow}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3F0E8] text-[#0A7B4E]">
                  <PencilLine size={20} />
                </div>
                <h2 className="text-[24px] sm:text-[22px] leading-none font-black text-[#22322B]">
                  Daily Reflection
                </h2>
              </div>

              <div
                className="rounded-[24px] border border-[#E1E9E4] bg-[#F4F7F5] p-4"
              >
                <textarea
                  value={reflectionNotes}
                  onChange={(event) =>
                    setReflectionNotes(event.target.value.slice(0, 500))
                  }
                  placeholder="What is on your mind today? Reflect on your energy levels, focus, and emotional state."
                  className="h-[180px] w-full resize-none bg-transparent text-[14px] font-medium leading-relaxed text-[#384A42] placeholder:text-[#9CABA3] focus:outline-none"
                />
                <p className="mt-1 text-right text-[11px] font-bold text-[#A2B2A9]">
                  {reflectionNotes.length}/500 characters
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveReflection}
                disabled={reflectionSaving}
                className="mt-3 w-full rounded-full bg-[#D7DEDB]  py-3.5 text-[16px] sm:text-[22px] font-black text-[#0A7B4E] transition-all hover:bg-[#0A7B4E] hover:text-white disabled:opacity-60"
              >
                {reflectionSaving ? "Saving..." : "Log Entry"}
              </button>
            </section>

            <section className="rounded-[30px] border border-[#DCE7E1] bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,41,29,0.04)]" style={dualEdgeDepthShadow}>
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] sm:text-[22px] leading-none font-black text-[#22322B]">
                  Weekly Streak
                </h3>
                <p className="text-[16px] font-black text-[#0A7B4E]">
                  {weeklyStatus.average}% Avg.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-2">
                {weeklyStatus.dayMetrics.map((day) => {
                  const dayLabel = format(day.date, "EEEEE");
                  const isDone = day.completion >= 1;
                  const isPartial = day.completion > 0 && day.completion < 1;

                  return (
                    <div key={day.date.toISOString()} className="text-center">
                      <p
                        className={`text-[12px] font-black ${day.isToday ? "text-[#0A7B4E]" : "text-[#8B9A92]"}`}
                      >
                        {dayLabel}
                      </p>
                      <div
                        className={`mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-black ${
                          isDone
                            ? "border-[#0A7B4E] bg-[#0A7B4E] text-white"
                            : isPartial
                              ? "border-[#A9D6BF] bg-[#E9F6EE] text-[#0A7B4E]"
                              : "border-[#D9E2DD] bg-[#F3F6F4] text-[#9FB0A7]"
                        }`}
                      >
                        {isDone ? <Check size={14} strokeWidth={3} /> : Math.round(day.completion * 100) || "0"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-[#E5ECE8] pt-4">
                <p className="text-[13px] font-semibold text-[#6F8078]">
                  Strong rhythm this week. Keep stacking daily wins to extend
                  your streak.
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#CFE0D6] bg-[#E9F3ED] p-5">
              <p className="text-[16px] leading-relaxed font-semibold italic text-[#2E6D52]">
                &quot;Optimal hydration improves cognitive function by up to 20%.
                Keep your water bottle visible.&quot;
              </p>
            </section>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function MetricCard({ title, value, suffix, accent, subtitle, progress, icon: Icon }) {
  const hasProgress = typeof progress === "number";

  return (
    <div
      className="rounded-[30px] border border-[#DCE7E1] bg-white p-5"
      style={dualEdgeDepthShadow}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-black tracking-[0.12em] text-[#7F8F87] uppercase">
          {title}
        </p>
        {Icon && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E3F0E8] text-[#0A7B4E]">
            <Icon size={16} />
          </div>
        )}
      </div>

      <p className={`mt-2 text-[40px] leading-none font-black ${accent}`}>
        {value}
        {suffix && (
          <span className="ml-1 text-[20px] font-bold text-[#7F8F87]">
            {suffix}
          </span>
        )}
      </p>

      {subtitle && (
        <p className="mt-1 text-[14px] font-semibold text-[#7A8A82]">
          {subtitle}
        </p>
      )}

      {hasProgress && (
        <div className="mt-4 h-2 rounded-full bg-[#E5ECE8]">
          <div
            className="h-full rounded-full bg-[#0A7B4E] transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
          />
        </div>
      )}
    </div>
  );
}

function getStatusUI(status) {
  if (status === "done") {
    return {
      label: "COMPLETED",
      meta: "DONE TODAY",
      labelColor: "text-[#0A7B4E]",
      buttonClass:
        "border-[#0A7B4E] bg-[#0A7B4E] text-white shadow-[0_8px_18px_rgba(10,123,78,0.35)]",
      icon: Check,
    };
  }

  if (status === "missed") {
    return {
      label: "PENDING",
      meta: "MARK NOW",
      labelColor: "text-[#8A9A92]",
      buttonClass: "border-[#A9D6BF] bg-[#F4FAF6] text-[#0A7B4E]",
      icon: Play,
    };
  }

  return {
    label: "IN PROGRESS",
    meta: "KEEP GOING",
    labelColor: "text-[#8A9A92]",
    buttonClass: "border-[#A9D6BF] bg-[#F4FAF6] text-[#0A7B4E]",
    icon: Play,
  };
}

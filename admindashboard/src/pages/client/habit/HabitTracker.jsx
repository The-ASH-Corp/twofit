import { useEffect, useState, useMemo } from "react";
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
  Check, 
  X, 
  Droplets, 
  Footprints, 
  Dumbbell, 
  Moon, 
  Target,
  CheckCircle2,
  Zap,
  Quote,
} from "lucide-react";
import { SyncLoader } from "react-spinners";
import { format } from "date-fns";

export default function HabitTracker() {
  const dispatch = useDispatch();
  const [reflectionNotes, setReflectionNotes] = useState("");
  const user = useSelector(selectUser);
  const clientId = user?._id;
  const { habits, loading, reflectionNote, reflectionSaving } = useSelector((state) => state.habit);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (clientId) {
      dispatch(getClientHabitsThunk(clientId));
      dispatch(getHabitReflectionThunk(clientId));
      dispatch(fetchClientAdherenceStreaks(clientId)).unwrap().then(res => {
        if (res?.habit) {
          setStreak(res.habit.activeStreak || 0);
        }
      });
    }
  }, [clientId, dispatch]);

  useEffect(() => {
    setReflectionNotes(reflectionNote || "");
  }, [reflectionNote]);

  const todayStr = useMemo(() => format(new Date(), "EEEE, MMMM dd"), []);
  const todayKey = new Date().toDateString();

  const processedHabits = useMemo(() => {
    if (!habits?.habits) return [];
    return habits.habits.map((habit) => {
      const todayLog = habit.logs.find(
        (log) => new Date(log.date).toDateString() === todayKey,
      );
      // Changed default from 'in-progress' to 'missed' as requested
      return { ...habit, todayStatus: todayLog?.status || "missed" };
    });
  }, [habits, todayKey]);

  const doneCount = processedHabits.filter(h => h.todayStatus === "done").length;
  const missedCount = processedHabits.filter(h => h.todayStatus === "missed").length;

  const handleChecklistToggle = (habitId, currentStatus) => {
    // Toggles between 'missed' and 'done' as primary states, or cycle missed -> done -> in-progress
    let nextStatus = "done";
    if (currentStatus === "done") nextStatus = "missed";
    else if (currentStatus === "missed") nextStatus = "done"; // Toggle directly for better UX if they are 'missed' by default

    dispatch(updateHabitStatusThunk({ clientId, habitId, status: nextStatus }));
  };

  const handleSaveReflection = () => {
    if (!clientId) return;
    dispatch(updateHabitReflectionThunk({ clientId, note: reflectionNotes }));
  };

  const getHabitIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("water")) return Droplets;
    if (n.includes("walk") || n.includes("step")) return Footprints;
    if (n.includes("exercise") || n.includes("gym") || n.includes("workout")) return Dumbbell;
    if (n.includes("sleep") || n.includes("bed")) return Moon;
    return Target;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );

  if (!habits || !habits.habits?.length) return (
     <div className="flex flex-col items-center justify-center w-full h-[60vh] text-center p-8 bg-white rounded-[32px] shadow-sm">
        <Target size={48} className="text-gray-200 mb-4" />
        <h3 className="text-lg font-bold text-gray-800">No habits assigned yet</h3>
        <p className="text-sm text-gray-500 max-w-xs mt-1">Visit the admin panel to set up your daily rituals.</p>
     </div>
  );

  return (
    <>
      {/* MOBILE VERSION: Matching the specific "Daily Habits" image style */}
      <div className="block md:hidden max-w-md mx-auto space-y-8 px-4 pb-24 pt-6 bg-[#F8FAFA] min-h-screen">
        <div className="flex justify-between items-center px-2">
          <h1 className="text-[24px] font-black text-gray-800 leading-none">Daily Habits</h1>
          <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Today</span>
        </div>

        <div className="space-y-4">
          {processedHabits.map((habit) => {
            const Icon = getHabitIcon(habit.name);
            const status = habit.todayStatus;
            return (
              <div 
                key={habit._id}
                className="flex items-center justify-between bg-white px-5 py-4 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 active:scale-95 transition-all"
                onClick={() => handleChecklistToggle(habit._id, status)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#EBF3F2] flex items-center justify-center text-[#0A4F48]">
                    <Icon size={22} className={status === "done" ? "fill-current" : ""} />
                  </div>
                  <h3 className="text-[17px] font-bold text-gray-800 tracking-tight">{habit.name}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  status === "done" ? "bg-[#0A4F48] border-[#0A4F48] text-white" : 
                  status === "missed" ? "bg-rose-100 border-rose-200 text-rose-500" : 
                  "border-gray-100 bg-white"
                }`}>
                  {status === "done" && <Check size={20} strokeWidth={4} />}
                  {status === "missed" && <X size={20} strokeWidth={4} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#EBFDFC] rounded-[24px] p-4 flex items-center gap-3 border border-[#DFF9F7]">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"><Check size={12} strokeWidth={4} /></div>
            <div>
              <p className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest leading-none mb-1">Done</p>
              <p className="text-[20px] font-black text-gray-800 leading-none">{doneCount}</p>
            </div>
          </div>
          <div className="bg-[#FEF2F2] rounded-[24px] p-4 flex items-center gap-3 border border-[#FEE2E2]">
            <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0"><X size={12} strokeWidth={4} /></div>
            <div>
              <p className="text-[10px] font-black text-rose-700/60 uppercase tracking-widest leading-none mb-1">Missed</p>
              <p className="text-[20px] font-black text-gray-800 leading-none">{missedCount}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[20px] font-black text-gray-800 tracking-tight px-1">Daily Reflection</h2>
          <div className="bg-white p-6 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] space-y-6">
            <div className="bg-[#F1F4F4]/60 rounded-[30px] p-6 min-h-[180px]">
              <textarea
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value.slice(0, 500))}
                placeholder="Write your daily reflection..."
                className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] text-gray-700 placeholder:text-gray-400 font-medium resize-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-gray-300">{reflectionNotes.length}/500</span>
              <button 
                onClick={handleSaveReflection}
                disabled={reflectionSaving}
                className="bg-[#005F54] text-white px-8 py-3.5 rounded-full text-[14px] font-black shadow-lg shadow-[#005F54]/30 active:scale-95 disabled:opacity-50"
              >
                {reflectionSaving ? "SAVING..." : "SAVE NOTES"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VERSION: High-fidelity Dashboard layout with Sidebar */}
      <div className="hidden md:block max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex md:items-end justify-between gap-4 px-2">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">Daily Habit Tracker</h1>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <p className="text-[14px] font-black text-gray-800 leading-none">{todayStr}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-2">
          <StatCard label="Done Today" value={doneCount} color="bg-emerald-50 text-emerald-600 border-emerald-100" icon={Check} />
          <StatCard label="Missed" value={missedCount} color="bg-rose-50 text-rose-500 border-rose-100" icon={X} />
          <StatCard label="Current Streak" value={`${streak} Days`} color="bg-teal-50 text-[#0A4F48] border-teal-100" icon={Zap} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-black text-gray-800 leading-none">Today's Protocol</h2>
            </div>
            <div className="space-y-4">
              {processedHabits.map((habit) => {
                const Icon = getHabitIcon(habit.name);
                const status = habit.todayStatus;
                return (
                  <div key={habit._id} className="group flex items-center justify-between bg-[#F8FAFA] hover:bg-white hover:shadow-lg rounded-[28px] p-2 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center text-[#0A4F48]/60 group-hover:scale-105 transition-transform">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-black text-gray-800 leading-tight">{habit.name}</h3>
                        <p className="text-[11px] font-bold text-gray-400 mt-0.5">Target: {habit.target || "Daily Goal"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pr-4">
                      {status === "in-progress" && (
                        <div className="hidden sm:flex items-center gap-1.5 bg-[#0A4F48]/10 text-[#0A4F48] px-3 py-1.5 rounded-full">
                          <SyncLoader color="currentColor" margin={1} size={2} />
                          <span className="text-[9px] font-black uppercase tracking-widest">In Progress</span>
                        </div>
                      )}
                      <button onClick={() => handleChecklistToggle(habit._id, status)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${status === "done" ? "bg-emerald-400 text-white" : status === "missed" ? "bg-rose-400 text-white" : "bg-white text-gray-200"}`}>
                        {status === "done" ? <Check size={20} strokeWidth={4} /> : status === "missed" ? <X size={20} strokeWidth={4} /> : <CheckCircle2 size={24} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#EBF3F2] rounded-2xl flex items-center justify-center"><Quote size={18} className="text-[#0A4F48]" /></div>
                <h2 className="text-[18px] font-black text-gray-800">Daily Reflection</h2>
              </div>
              <textarea value={reflectionNotes} onChange={(e) => setReflectionNotes(e.target.value.slice(0, 500))} placeholder="Type your thoughts here..." className="w-full min-h-[160px] bg-[#F8FAFA] rounded-[28px] p-6 text-[13px] text-gray-700 outline-none resize-none" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{reflectionNotes.length} / 500</span>
                <button onClick={handleSaveReflection} disabled={reflectionSaving} className="bg-[#0A4F48] text-white px-8 py-3 rounded-full text-[13px] font-black hover:bg-[#0c5c54] active:scale-95 shadow-lg shadow-[#0A4F48]/20">{reflectionSaving ? "Saving..." : "Save Notes"}</button>
              </div>
            </div>


            <div className="bg-[#F4F1ED] p-8 rounded-[32px] shadow-sm relative overflow-hidden group">
              <Quote size={40} className="absolute -top-2 -left-2 text-black/3 rotate-12" />
              <div className="space-y-4">
                <Quote size={20} className="text-[#0A4F48] opacity-20" />
                <p className="text-[14px] font-bold text-[#0A4F48] leading-relaxed italic pr-4">"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</p>
                <div className="flex items-center gap-2"><div className="w-4 h-[2px] bg-[#0A4F48]/20" /><span className="text-[10px] font-black text-[#0A4F48] uppercase tracking-[0.2em]">Aristotle</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className={`bg-white border ${color.split(" ")[2]} p-6 rounded-[32px] shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 group`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${color.split(" ")[0]} ${color.split(" ")[1]} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}><Icon size={18} /></div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
          <p className="text-[20px] font-black text-gray-800 leading-none mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}


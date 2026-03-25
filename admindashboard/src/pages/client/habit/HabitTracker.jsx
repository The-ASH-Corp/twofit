
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getHabitReflectionThunk,
  getClientHabitsThunk,
  updateHabitReflectionThunk,
  updateHabitStatusThunk,
} from "@/redux/features/habit/habit.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { IoClose } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { SyncLoader } from "react-spinners";

export default function HabitTracker() {
  const dispatch = useDispatch();
  const [reflectionNotes, setReflectionNotes] = useState("");

  const user = useSelector(selectUser);
  const clientId = user?._id;

  const { habits, loading } = useSelector((state) => state.habit);

  useEffect(() => {
    if (clientId) {
      dispatch(getClientHabitsThunk(clientId));
      dispatch(getHabitReflectionThunk(clientId));
    }
  }, [clientId, dispatch]);

  const { reflectionNote, reflectionSaving } = useSelector((state) => state.habit);

  useEffect(() => {
    setReflectionNotes(reflectionNote || "");
  }, [reflectionNote]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );

  if (!habits || !habits.habits?.length) return <p className="flex justify-center items-center w-full h-full text-lg">No habits assigned</p>;

  const today = new Date().toDateString();

  const doneCount = habits.habits.filter((habit) => {
    const todayLog = habit.logs.find(
      (log) => new Date(log.date).toDateString() === today,
    );
    return todayLog?.status === "done";
  }).length;

  const missedCount = habits.habits.length - doneCount;

  const handleChecklistToggle = (habit) => {
    const todayLog = habit.logs.find(
      (log) => new Date(log.date).toDateString() === today,
    );
    const currentStatus = todayLog?.status;
    const newStatus = currentStatus === "done" ? "missed" : "done";

    dispatch(
      updateHabitStatusThunk({
        clientId,
        habitId: habit._id,
        status: newStatus,
      }),
    );
  };

  const handleSaveReflection = () => {
    if (!clientId) return;
    dispatch(
      updateHabitReflectionThunk({
        clientId,
        note: reflectionNotes,
      }),
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-[#0A4F48]">Daily Habit Tracker</h2>

      <div className="border border-gray-200 rounded-xl p-4">
        <h3 className="text-[15px] font-semibold text-[#0A4F48]">Habit Checklist</h3>
        <p className="text-xs text-gray-500 mt-1">
          Toggle each habit to mark it done or missed for today.
        </p>

        <div className="mt-3 space-y-2">
          {habits.habits.map((habit) => {
            const todayLog = habit.logs.find(
              (log) => new Date(log.date).toDateString() === today,
            );
            const isDone = todayLog?.status === "done";

            return (
              <button
                key={habit._id}
                onClick={() => handleChecklistToggle(habit)}
                className="w-full flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800 capitalize">
                  {habit.name}
                </span>

                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-2xl ${
                    isDone
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {isDone ? <TiTick /> : <IoClose />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between bg-gray-100 p-3 rounded">
        <p className="text-green-600 font-semibold flex">
          <TiTick className="text-2xl" /> Done: {doneCount}
        </p>

        <p className="text-red-500 font-semibold flex ">
          <IoClose className="text-2xl" /> Missed: {missedCount}
        </p>
      </div>

      <div className="border border-gray-200 rounded-xl p-4">
        <label className="block text-[15px] font-semibold text-[#0A4F48] mb-2">
          Reflection Notes
        </label>
        <textarea
          value={reflectionNotes}
          onChange={(e) => setReflectionNotes(e.target.value.slice(0, 500))}
          placeholder="Write your daily reflection..."
          className="w-full min-h-[130px] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">
          {reflectionNotes.length}/500 characters
        </p>
        <button
          onClick={handleSaveReflection}
          disabled={reflectionSaving}
          className="mt-3 px-4 py-2 rounded-lg bg-[#0A4F48] text-white text-sm font-medium disabled:opacity-60"
        >
          {reflectionSaving ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClientHabitsThunk } from "@/redux/features/habit/habit.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import HabitRow from "./HabitRow";

export default function HabitTracker() {
  const dispatch = useDispatch();

 
  const user = useSelector(selectUser);
   const clientId = user?._id;
   console.log("Client ID:", clientId);
  const { habits, loading } = useSelector(
    (state) => state.habit
  );

  useEffect(() => {
    if (clientId) {
      dispatch(getClientHabitsThunk(clientId));
    }
  }, [clientId]);

  if (loading) return <p>Loading habits...</p>;
  if (!habits) return <p>No habits assigned</p>;

  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-[#0A4F48]">
        Daily Habit Tracker
      </h2>

      <table className="w-full border-gray-200 border rounded-xl">
        <thead>
          <tr className="bg-gray-100 rounded-xl">
            <th className="text-left p-2 text-[#0A4F48]">Habit</th>
            <th className="text-center p-2">Today</th>
          </tr>
        </thead>
        <tbody>
          {habits.habits.map((habit) => (
            <HabitRow
              key={habit.name}
              habit={habit}
              clientId={clientId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

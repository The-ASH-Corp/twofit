import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectSopError, selectSopStatus, selectSopTodayTasks } from "@/redux/features/sop/sop.selector";
import { completeSOP, todaySop } from "@/redux/features/sop/sop.thunk";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Mock data (matches the defaults created in admin side)
const initialTasks = [
  {
    taskId: 1,
    title: "Morning Review",
    description: "Review breakfast downloads, approve or correct mistakes, clear doubts, mark 'Breakfast Checked'.",
    timeOfDay: "Morning",
    requiresInput: false,
    status: "Pending",
    notes: ""
  },
  {
    taskId: 2,
    title: "Lunch Review",
    description: "Review lunch meals, portion corrections, compliance check, mark 'Lunch Checked'.",
    timeOfDay: "Lunch",
    requiresInput: false,
    status: "Pending",
    notes: ""
  },
  {
    taskId: 3,
    title: "Evening Guidance",
    description: "Snack/Dinner guidance, structured doubt clarification, light motivation support.",
    timeOfDay: "Evening",
    requiresInput: false,
    status: "Pending",
    notes: ""
  },
  {
    taskId: 4,
    title: "Night Final Review",
    description: "Full day compliance check, add daily follow-up note, progress observation.",
    timeOfDay: "Night",
    requiresInput: true,
    inputType: "status_select",
    status: "Pending", // This tracks "Checked" state in UI usually, but for this specific task, the "Output" is a status
    outcome: "Completed", // Default outcome
    notes: ""
  },
  {
    taskId: 5,
    title: "Daily Follow-up Tracking",
    description: "Track: Meals, water intake, cravings, energy levels.",
    timeOfDay: "Night",
    requiresInput: true,
    status: "Pending",
    notes: ""
  }
];

const DailyTasks = () => {

     const dispatch = useDispatch();
     const user = useSelector(selectUser);

     useEffect(() => {
       dispatch(todaySop({ coachId: user?._id }));
     }, [dispatch, user]);

     const tasks = useSelector(selectSopTodayTasks);
     const status = useSelector(selectSopStatus);
     const error = useSelector(selectSopError);

    //  console.log(tasks)


    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // In a real app, we'd fetch from backend here based on `date`
    // useEffect(() => { fetchTasks(date); }, [date]);

    const handleToggleComplete = (SOPId) => {
        dispatch(completeSOP({ SOPId, coachId: user?._id }));
        window.location.reload();
    };


    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Daily Duties</h1>
        <p className="text-gray-600 mb-6">
          High priority items for: <strong>{date}</strong>
        </p>

        {tasks?.map(
          (task, i) =>
            tasks?.length > 0 && (
              <div
                key={i}
                className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                <div
                  className={
                    "px-4 py-3 border-b border-gray-100 flex items-center bg-green-50"
                  }
                >
                  <h2 className={"font-semibold text-lg text-green-800"}>
                    {task?.timeSlot}
                  </h2>
                </div>
                <div className="p-4 space-y-6">
                  <div
                    key={i}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={task?.completed}
                          onChange={() => handleToggleComplete(task?.sopId)}
                          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <label
                            className={`font-medium text-gray-900 ${task?.completed ? "line-through text-gray-400" : ""}`}
                          >
                            {task?.title}
                          </label>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${task?.completed ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                          >
                            {task?.completed ? "completed" : "pending"}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 mb-2">
                          {task?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
        )}
      </div>
    );
};

export default DailyTasks;

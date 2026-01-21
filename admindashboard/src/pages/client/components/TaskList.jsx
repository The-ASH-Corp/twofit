import React, { useState } from "react";
import TaskModal from "./TaskModal";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getUserTaskStatus } from "@/redux/features/tasks/task.thunk";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { selectToken } from "@/redux/features/auth/auth.selectores";

export default function TaskList({ plans }) {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const currentGlobalDay = user?.currentGlobalDay || 1;

  useEffect(() => {
    dispatch(getUserTaskStatus());

    if (user?._id && token) {
      // Socket.IO Setup
      socket.auth = { userId: user._id, token: token };
      socket.connect();

      socket.on("connect", () => {
        console.log("Client task socket connected");
      });

      socket.on("task_status_updated", (data) => {
        console.log("Task status updated via socket:", data);
        dispatch(getUserTaskStatus()); // Refresh list
      });

      return () => {
        socket.off("connect");
        socket.off("task_status_updated");
        socket.disconnect();
      };
    }
  }, [dispatch, user?._id, token]);

  const days =
    plans?.weeks?.flatMap((week, weekIndex) =>
      week.days.map((day, dayIndex) => ({
        ...day,
        weekIndex: weekIndex + 1,
        dayIndex: dayIndex + 1,
        globalIndex: weekIndex * 7 + dayIndex + 1,
        exercises: day.exercises,
      })),
    ) || [];

  const currentDayData = days[currentGlobalDay - 1];
  const workoutExercises =
    currentDayData?.exercises?.map((ex, index) => {
      const submission = tasks?.find(
        (t) =>
          t.globalDayIndex === currentGlobalDay &&
          t.exerciseIndex === index &&
          t.taskType === "Workout",
      );
      return {
        ...ex,
        type: "Workout",
        programId: plans.program,
        weekIndex: currentDayData.weekIndex,
        dayIndex: currentDayData.dayIndex,
        globalDayIndex: currentGlobalDay,
        exerciseIndex: index,
        status: submission?.status || "todo",
        submission,
      };
    }) || [];

  const mealTasks = ["Meal 1", "Meal 2", "Meal 3", "Meal 4"].map(
    (mealName, index) => {
      const mealIndex = 100 + index; // Use a high index range for static meals to avoid collisions
      const submission = tasks?.find(
        (t) =>
          t.globalDayIndex === currentGlobalDay &&
          t.exerciseIndex === mealIndex &&
          t.taskType === "Meal",
      );
      return {
        name: mealName,
        type: "Meal",
        notes: "Log your meal photo/video for review.",
        programId: plans?.program,
        weekIndex: currentDayData?.weekIndex || 1,
        dayIndex: currentDayData?.dayIndex || 1,
        globalDayIndex: currentGlobalDay,
        exerciseIndex: mealIndex,
        status: submission?.status || "todo",
        submission,
      };
    },
  );

  const todayExercises = [...workoutExercises, ...mealTasks];

  return (
    <div className="space-y-3 mt-4">
      {todayExercises?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={"src/assets/Workout.png"}
              alt={item.type}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#0A4F48] text-[15px]">
              {item.name || "Workout"}
            </h3>
            <p className="text-[12px] text-gray-500 font-medium truncate">
              {item.notes}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {item.submission && (
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  item.submission.status === "verified"
                    ? "bg-green-100 text-green-700"
                    : item.submission.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.submission.status.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button className="bg-gray-50 px-6 py-2 rounded-lg text-[13px] font-bold text-gray-400 hover:bg-gray-100 transition-colors">
              Skip
            </button>
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setSelectedTask(item);
              }}
              className="bg-[#0A4F48] text-[13px] font-bold px-6 py-2 text-white rounded-lg hover:bg-[#083d38] transition-colors"
            >
              View
            </button>
          </div>
        </div>
      ))}

      {isOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsOpen(!isOpen)}
          onSuccess={() => dispatch(getUserTaskStatus())}
        />
      )}
    </div>
  );
}

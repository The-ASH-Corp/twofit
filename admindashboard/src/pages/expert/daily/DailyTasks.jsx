import KpiCard from "@/components/cards/KpiCard";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import {
  selectSopError,
  selectSopStatus,
  selectSopTodayTasks,
} from "@/redux/features/sop/sop.selector";
import { completeSOP, todaySop } from "@/redux/features/sop/sop.thunk";
import { ClipboardCheck, ClipboardList, SquarePercent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";

const DailyTasks = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?._id) {
      dispatch(todaySop({ coachId: user._id }));
    }
  }, [dispatch, user]);

  const tasks = useSelector(selectSopTodayTasks);
  const status = useSelector(selectSopStatus);
  const error = useSelector(selectSopError);

  const [date] = useState(new Date().toISOString().split("T")[0]);

  const handleToggleComplete = (SOPId, completed) => {
    dispatch(
      completeSOP({
        SOPId,
        coachId: user?._id,
        completed: !completed,
      }),
    ).then(() => {
      dispatch(todaySop({ coachId: user?._id }));
    });
  };

  const completedToday = tasks.filter((t) => t.completed).length;
  const totalToday = tasks.length;

  const percentage = totalToday
    ? Math.round((completedToday / totalToday) * 100)
    : 0;

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Daily Duties</h1>

      <p className="text-gray-600 mb-6">
        Date: <strong>{date}</strong>
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard
          title="Today's Tasks"
          value={totalToday}
          icon={
            <ClipboardList size={20} className="text-white md:w-6 md:h-6" />
          }
          bg="#0A4F48"
        />

        <KpiCard
          title="Completed"
          value={completedToday}
          icon={
            <ClipboardCheck size={20} className="text-white md:w-6 md:h-6" />
          }
          bg="#0A4F48"
        />

        <KpiCard
          title="Completion Rate"
          value={`${percentage}%`}
          icon={
            <SquarePercent size={20} className="text-white md:w-6 md:h-6" />
          }
          bg="#0A4F48"
        />
      </div>

      {/* Tasks */}
      <div className="p-4 flex flex-col gap-4 bg-white shadow rounded-2xl">
        <h1 className="text-lg font-semibold">Today Tasks</h1>

        {tasks.length === 0 ? (
          <div className="text-center shadow py-12 bg-white rounded-lg border border-gray-100">
            <p className="text-gray-500 text-lg font-medium">
              No tasks assigned
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.sopId}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden md:w-[70%]"
            >
              {/* Time Slot */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center bg-green-50">
                <h2 className="font-semibold text-lg text-green-800">
                  {task?.timeSlot}
                </h2>
              </div>

              {/* Task Content */}
              <div className="p-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={task?.completed}
                    onChange={() =>
                      handleToggleComplete(task?.sopId, task?.completed)
                    }
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer mt-1"
                  />

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <label
                        className={`font-medium text-gray-900 wrap-break-words ${
                          task?.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task?.title}
                      </label>

                      <span
                        className={`text-xs px-2 py-1 rounded-full border w-fit ${
                          task?.completed
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {task?.completed ? "Completed" : "Pending"}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mt-1 leading-relaxed wrap-break-words">
                      {task?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyTasks;

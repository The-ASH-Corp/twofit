import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectSopError, selectSopStatus, selectSopTodayTasks } from "@/redux/features/sop/sop.selector";
import { completeSOP, todaySop } from "@/redux/features/sop/sop.thunk";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";


const DailyTasks = () => {

     const dispatch = useDispatch();
     const user = useSelector(selectUser);

     useEffect(() => {
       dispatch(todaySop({ coachId: user?._id }));
     }, [dispatch, user]);

     const tasks = useSelector(selectSopTodayTasks);
     const status = useSelector(selectSopStatus);
     const error = useSelector(selectSopError);

    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const handleToggleComplete = (SOPId, completed) => {
        dispatch(
          completeSOP({ SOPId, coachId: user?._id, completed: !completed }),
        );
        window.location.reload();
    };

    if (status === "loading")
      return (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <SyncLoader color="#0A4F48" loading margin={2} size={20} />
        </div>
      );
    if (error) return <p className="text-red-500">{error}</p>;

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
                          onChange={() =>
                            handleToggleComplete(task?.sopId, task?.completed)
                          }
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

import { selectSopError, selectSopStatus, selectSopTodayTasks } from '@/redux/features/sop/sop.selector';
import { todaySop } from '@/redux/features/sop/sop.thunk';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';

const ExpertHistory = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
          dispatch(todaySop({ coachId: id }));
        }, [dispatch, id]);

        const tasks = useSelector(selectSopTodayTasks);
        const status = useSelector(selectSopStatus);
        const error = useSelector(selectSopError);

    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    if (status === "loading")
      return (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <SyncLoader color="#0A4F48" loading margin={2} size={20} />
        </div>
      );
    if (error) return <p className="text-red-500">{error}</p>;
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between w-full items-start flex-col md:flex-row py-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">Daily Duties History</h1>
          <p>
            Date: <strong>{date}</strong>
          </p>
          <div className="flex items-start gap-2">
            <label className="text-gray-600 mb-6 ">Select Date:</label>
            <input
              type="date"
              className="border border-black rounded-lg px-1 py-0.5 text-sm"
            />
            <label>TO</label>
            <input
              type="date"
              className="border border-black rounded-lg px-1 py-0.5 text-sm"
            />
          </div>
        </div>
      </div>

      {tasks.map((task, i) => (
        <div
          key={i}
          className=" mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-green-100 ">
            <h2 className="font-semibold text-lg text-[#0A4F48]">
              {task?.timeSlot}
            </h2>
          </div>
          <div className="px-1 py-4 space-y-6">
            <div
              key={task?.taskId}
              className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <label
                      className={`font-medium text-gray-900 ${task?.status === "Completed" ? "line-through text-gray-400" : ""}`}
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
      ))}
    </div>
  );
}

export default ExpertHistory
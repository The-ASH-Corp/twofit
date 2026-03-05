import { selectSopError, selectSopStatus, selectSopTasks } from "@/redux/features/sop/sop.selector";
import { todaySop } from "@/redux/features/sop/sop.thunk";
import { SquarePen, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const ExpertTasks = () => {

  const {id} = useParams()
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(todaySop({ coachId: id}));
    }, [dispatch, id]);

      const navigate = useNavigate();

      const tasks = useSelector(selectSopTasks);
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
          <h1 className="text-3xl font-bold mb-2">Daily Duties</h1>
          <p className="text-gray-600 mb-6 ">
            Date: <strong>{date}</strong>
          </p>
        </div>
        <button
          onClick={() => navigate(`/admin/experts/tasks/add/${id}`)}
          className="h-[46px] px-6 bg-[#0A4F48] hover:bg-[#084039] text-white rounded-2xl text-sm font-bold flex items-center gap-2"
        >
          <BiPlus className="w-5 h-5 stroke-2" />
          <span>Add Task</span>
        </button>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  navigate(`/admin/experts/tasks/edit/${task?.sopId}`)
                }
                className="bg-[#0A4F48] text-white p-1 rounded-md"
              >
                <SquarePen size={17} />
              </button>
              <button className="bg-red-400 text-white p-1 rounded-md">
                <Trash size={17} />
              </button>
            </div>
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
};

export default ExpertTasks;

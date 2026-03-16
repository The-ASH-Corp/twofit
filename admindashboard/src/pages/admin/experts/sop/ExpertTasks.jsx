import { selectSopError, selectSopStatus, selectSopTasks } from "@/redux/features/sop/sop.selector";
import { getSOPByCoach } from "@/redux/features/sop/sop.thunk";
import { FileChartColumn, SquarePen, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";

const ExpertTasks = () => {

  const {id} = useParams()
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getSOPByCoach({ coachId: id }));
    }, [dispatch, id]);

      const navigate = useNavigate();

      const tasks = useSelector(selectSopTasks);
      const status = useSelector(selectSopStatus);
      const error = useSelector(selectSopError);

      const handleOverview = () => {
        if (tasks?.length > 0) {
          navigate(`/admin/experts/tasks/history/${id}`);
        } else {
          toast.error("Please add a task first");
        }
      };

      if (status === "loading")
        return (
          <div className="flex justify-center items-center h-[calc(100vh-120px)]">
            <SyncLoader color="#0A4F48" loading margin={2} size={20} />
          </div>
        );
      if (error) return <p className="text-red-500">{error}</p>;
  
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-1 md:gap-4">
      <div className="flex justify-between gap-4 w-full items-start flex-col md:flex-row py-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">Daily Duties</h1>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleOverview()}
            className="h-[46px] px-6 bg-[#0A4F48] hover:bg-[#084039] text-white rounded-2xl text-sm font-bold flex items-center gap-2"
          >
            <FileChartColumn />
            <span>overview</span>
          </button>
          <button
            onClick={() => navigate(`/admin/experts/tasks/add/${id}`)}
            className="h-[46px] px-6 bg-[#0A4F48] hover:bg-[#084039] text-white rounded-2xl text-sm font-bold flex items-center gap-2"
          >
            <BiPlus className="w-5 h-5 stroke-2" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {tasks?.length === 0 ? (
        <div className="text-center shadow py-12 bg-white rounded-lg border border-gray-100">
          <p className="text-gray-500 text-lg font-medium">No tasks assigned</p>
          <p className="text-gray-400 text-sm mt-1">
            Click "Add Task" to assign duties to this expert.
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden lg:w-[70%]"
          >
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-green-100">
              <h2 className="font-semibold text-lg text-[#0A4F48]">
                {task?.timeSlot}
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    navigate(`/admin/experts/tasks/edit/${task?._id}`)
                  }
                  className="bg-[#0A4F48] text-white p-1 rounded-md"
                >
                  <SquarePen size={17} />
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/experts/tasks/delete/${task?._id}`)
                  }
                  className="bg-red-400 text-white p-1 rounded-md"
                >
                  <Trash size={17} />
                </button>
              </div>
            </div>

            <div className="px-1 py-4 space-y-6">
              <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start">
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between">
                      <label className="font-medium text-gray-900 wrap-break-words">
                        {task?.title}
                      </label>
                    </div>

                    <p className="text-gray-500 text-sm mt-1 mb-2 leading-relaxed wrap-break-words">
                      {task?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpertTasks;

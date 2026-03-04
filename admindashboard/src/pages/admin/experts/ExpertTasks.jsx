import ActionMenu from "@/components/actionMenu/ActionMenu";
import BaseTable from "@/components/table/BaseTable";
import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";



const initialTasks = [
  {
    id: 1,
    title: "Morning Review",
    description:
      "Review breakfast uploads, approve or correct mistakes, clear doubts, mark 'Breakfast Checked'.",
    timeOfDay: "Morning",
    status: "Completed",
    requiresInput: false,
  },
  {
    id: 2,
    title: "Lunch Review",
    description:
      "Review lunch meals, portion corrections, compliance check, mark 'Lunch Checked'.",
    timeOfDay: "Lunch",
    status: "Completed",
    requiresInput: false,
  },
  {
    id: 3,
    title: "Evening Guidance",
    description:
      "Snack/Dinner guidance, structured doubt clarification, light motivation support.",
    timeOfDay: "Evening",
    status: "Pending",
    requiresInput: false,
  },
  {
    id: 4,
    title: "Night Final Review",
    description:
      "Full day compliance check, add daily follow-up note, progress observation, mark status.",
    timeOfDay: "Night",
    status: "Pending",
    requiresInput: true,
    inputType: "status_select",
    options: ["Completed", "Needs Improvement", "Non-Compliant"],
  },
  {
    id: 5,
    title: "Daily Follow-up Tracking",
    description: "Track: Meals, water intake, cravings, energy levels.",
    timeOfDay: "Night",
    status: "Pending",
    requiresInput: true,
    inputType: "text_area",
  },
];

const ExpertTasks = () => {
  
      const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
      // In a real app, we'd fetch from backend here based on `date`
      // useEffect(() => { fetchTasks(date); }, [date]);
  
      // const handleToggleComplete = (taskId) => {
      //     setTasks(prev => prev.map(t => {
      //         if (t.taskId === taskId) {
      //             const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
      //             return { ...t, status: newStatus };
      //         }
      //         return t;
      //     }));
      // };
  
      // const handleNoteChange = (taskId, note) => {
      //     setTasks(prev => prev.map(t => 
      //         t.taskId === taskId ? { ...t, notes: note } : t
      //     ));
      // };
  
      // const handleOutcomeChange = (taskId, outcome) => {
      //     setTasks(prev => prev.map(t => 
      //         t.taskId === taskId ? { ...t, outcome: outcome } : t
      //     ));
      // };
  
      // const groupTasks = (tasksList) => {
      //     const groups = {
      //         Morning: [],
      //         Lunch: [],
      //         Evening: [],
      //         Night: [],
      //         Anytime: []
      //     };
      //     tasksList.forEach(t => {
      //         if (groups[t.timeOfDay]) {
      //             groups[t.timeOfDay].push(t);
      //         } else {
      //             groups['Anytime'].push(t);
      //         }
      //     });
      //     return groups;
      // };
  
      // const groupedTasks = groupTasks(tasks);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between w-full items-start flex-col md:flex-row py-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">Daily Duties</h1>
          <p className="text-gray-600 mb-6 ">
            Date: <strong>{date}</strong>
          </p>
        </div>
        <button className="h-[46px] px-6 bg-[#0A4F48] hover:bg-[#084039] text-white rounded-2xl text-sm font-bold flex items-center gap-2">
          <BiPlus className="w-5 h-5 stroke-2" />
          <span>Add Task</span>
        </button>
      </div>

      {initialTasks.map((task, i) => (
        <div
          key={i}
          className=" mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-green-100 ">
            <h2 className="font-semibold text-lg text-[#0A4F48]">{task.timeOfDay}</h2>
            <div className="flex items-center gap-2">
              <button className="bg-[#0A4F48] text-white p-1 rounded-md">
                <SquarePen size={17} />
              </button>
              <button className="bg-red-400 text-white p-1 rounded-md">
                <Trash size={17} />
              </button>
            </div>
          </div>
          <div className="px-1 py-4 space-y-6">
            <div
                key={task.taskId}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start">
                  {/* <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={task.status === "Completed"}
                          onChange={() => handleToggleComplete(task.taskId)}
                          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </div> */}
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <label
                        className={`font-medium text-gray-900 ${task.status === "Completed" ? "line-through text-gray-400" : ""}`}
                      >
                        {task.title}
                      </label>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${task.status === "Completed" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 mb-2">
                      {task.description}
                    </p>

                    {/* Special handling for Night Final Review Status Selection */}
                    {/* {task.title === "Night Final Review" && (
                          <div className="mt-2 mb-3">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">
                              FINAL DAY STATUS:
                            </label>
                            <select
                              value={task.outcome}
                              onChange={(e) =>
                                handleOutcomeChange(task.taskId, e.target.value)
                              }
                              className="block w-full text-sm p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              disabled={task.status === "Completed"}
                            >
                              <option value="Completed">Completed</option>
                              <option value="Needs Improvement">
                                Needs Improvement
                              </option>
                              <option value="Non-Compliant">
                                Non-Compliant
                              </option>
                            </select>
                          </div>
                        )} */}

                    {/* Notes Area */}
                    {/* {task.requiresInput && (
                          <div className="mt-2">
                            <textarea
                              placeholder="Add observations / notes..."
                              value={task.notes || ""}
                              onChange={(e) =>
                                handleNoteChange(task.taskId, e.target.value)
                              }
                              className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-300 focus:ring focus:ring-blue-100 transition bg-gray-50"
                              rows="2"
                              disabled={task.status === "Completed"}
                            />
                          </div>
                        )} */}
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

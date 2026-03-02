import React, { useState, useEffect } from "react";

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
    const [tasks, setTasks] = useState(initialTasks);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // In a real app, we'd fetch from backend here based on `date`
    // useEffect(() => { fetchTasks(date); }, [date]);

    const handleToggleComplete = (taskId) => {
        setTasks(prev => prev.map(t => {
            if (t.taskId === taskId) {
                const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
                return { ...t, status: newStatus };
            }
            return t;
        }));
    };

    const handleNoteChange = (taskId, note) => {
        setTasks(prev => prev.map(t => 
            t.taskId === taskId ? { ...t, notes: note } : t
        ));
    };

    const handleOutcomeChange = (taskId, outcome) => {
        setTasks(prev => prev.map(t => 
            t.taskId === taskId ? { ...t, outcome: outcome } : t
        ));
    };

    const groupTasks = (tasksList) => {
        const groups = {
            Morning: [],
            Lunch: [],
            Evening: [],
            Night: [],
            Anytime: []
        };
        tasksList.forEach(t => {
            if (groups[t.timeOfDay]) {
                groups[t.timeOfDay].push(t);
            } else {
                groups['Anytime'].push(t);
            }
        });
        return groups;
    };

    const groupedTasks = groupTasks(tasks);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Daily Duties</h1>
            <p className="text-gray-600 mb-6">High priority items for: <strong>{date}</strong></p>

            {Object.entries(groupedTasks).map(([time, taskList]) => (
                taskList.length > 0 && (
                    <div key={time} className="mb-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className={`px-4 py-3 border-b border-gray-100 flex items-center
                            ${time === 'Morning' ? 'bg-orange-50' : 
                              time === 'Lunch' ? 'bg-green-50' :
                              time === 'Evening' ? 'bg-blue-50' : 
                              'bg-purple-50'}`}>
                            <h2 className={`font-semibold text-lg 
                                ${time === 'Morning' ? 'text-orange-800' : 
                                  time === 'Lunch' ? 'text-green-800' :
                                  time === 'Evening' ? 'text-blue-800' : 
                                  'text-purple-800'}`}>{time}</h2>
                        </div>
                        <div className="p-4 space-y-6">
                            {taskList.map(task => (
                                <div key={task.taskId} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                checked={task.status === 'Completed'}
                                                onChange={() => handleToggleComplete(task.taskId)}
                                                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                            />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="flex justify-between">
                                                <label className={`font-medium text-gray-900 ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>
                                                    {task.title}
                                                </label>
                                                <span className={`text-xs px-2 py-1 rounded-full border ${task.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1 mb-2">{task.description}</p>
                                            
                                            {/* Special handling for Night Final Review Status Selection */}
                                            {task.title === "Night Final Review" && (
                                                <div className="mt-2 mb-3">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">FINAL DAY STATUS:</label>
                                                    <select 
                                                        value={task.outcome} 
                                                        onChange={(e) => handleOutcomeChange(task.taskId, e.target.value)}
                                                        className="block w-full text-sm p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        disabled={task.status === 'Completed'}
                                                    >
                                                        <option value="Completed">Completed</option>
                                                        <option value="Needs Improvement">Needs Improvement</option>
                                                        <option value="Non-Compliant">Non-Compliant</option>
                                                    </select>
                                                </div>
                                            )}

                                            {/* Notes Area */}
                                            {task.requiresInput && (
                                                <div className="mt-2">
                                                    <textarea
                                                        placeholder="Add observations / notes..."
                                                        value={task.notes || ""}
                                                        onChange={(e) => handleNoteChange(task.taskId, e.target.value)}
                                                        className="w-full p-2 text-sm border border-gray-200 rounded focus:border-blue-300 focus:ring focus:ring-blue-100 transition bg-gray-50"
                                                        rows="2"
                                                        disabled={task.status === 'Completed'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default DailyTasks;

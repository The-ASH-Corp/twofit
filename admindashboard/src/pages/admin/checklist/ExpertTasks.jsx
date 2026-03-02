import React, { useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Morning Review",
    description: "Review breakfast uploads, approve or correct mistakes, clear doubts, mark 'Breakfast Checked'.",
    timeOfDay: "Morning",
    requiresInput: false,
  },
  {
    id: 2,
    title: "Lunch Review",
    description: "Review lunch meals, portion corrections, compliance check, mark 'Lunch Checked'.",
    timeOfDay: "Lunch",
    requiresInput: false,
  },
  {
    id: 3,
    title: "Evening Guidance",
    description: "Snack/Dinner guidance, structured doubt clarification, light motivation support.",
    timeOfDay: "Evening",
    requiresInput: false,
  },
  {
    id: 4,
    title: "Night Final Review",
    description: "Full day compliance check, add daily follow-up note, progress observation, mark status.",
    timeOfDay: "Night",
    requiresInput: true,
    inputType: "status_select", 
    options: ["Completed", "Needs Improvement", "Non-Compliant"]
  },
  {
    id: 5,
    title: "Daily Follow-up Tracking",
    description: "Track: Meals, water intake, cravings, energy levels.",
    timeOfDay: "Night",
    requiresInput: true,
    inputType: "text_area"
  }
];

const ExpertTasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeOfDay: "Morning",
    requiresInput: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      ...formData,
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    setFormData({ title: "", description: "", timeOfDay: "Morning", requiresInput: false });
  };

  const handleDelete = (id) => {
    if(!window.confirm("Are you sure?")) return;
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expert Daily Duties (Admin Configuration)</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requires Input</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{task.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${task.timeOfDay === 'Morning' ? 'bg-yellow-100 text-yellow-800' : 
                      task.timeOfDay === 'Lunch' ? 'bg-green-100 text-green-800' :
                      task.timeOfDay === 'Evening' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-purple-100 text-purple-800'}`}>
                    {task.timeOfDay}
                  </span>
                </td>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task.requiresInput ? "Yes" : "No"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No tasks defined. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-96 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-4 text-gray-600 text-2xl">&times;</button>
             <h2 className="text-xl font-bold mb-4">Add Daily Task</h2>
             
             <form onSubmit={handleSubmit}>
               <div className="mb-4">
                 <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                 <input 
                   type="text" 
                   name="title" 
                   value={formData.title} 
                   onChange={handleChange} 
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   required
                 />
               </div>
               
               <div className="mb-4">
                 <label className="block text-gray-700 text-sm font-bold mb-2">Time of Day</label>
                 <select 
                   name="timeOfDay" 
                   value={formData.timeOfDay} 
                   onChange={handleChange} 
                   className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 >
                   <option value="Morning">Morning</option>
                   <option value="Lunch">Lunch</option>
                   <option value="Evening">Evening</option>
                   <option value="Night">Night</option>
                   <option value="Anytime">Anytime</option>
                 </select>
               </div>
               
               <div className="mb-4">
                 <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                 <textarea 
                   name="description" 
                   value={formData.description} 
                   onChange={handleChange} 
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   rows="3"
                 ></textarea>
               </div>
               
               <div className="mb-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="requiresInput" 
                      checked={formData.requiresInput} 
                      onChange={handleChange} 
                      className="mr-2 leading-tight" 
                    />
                    <span className="text-sm">Require additional note/input?</span>
                  </label>
               </div>
               
               <div className="flex items-center justify-end">
                 <button 
                   type="button" 
                   onClick={() => setIsModalOpen(false)} 
                   className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                 >
                   Save
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertTasks;

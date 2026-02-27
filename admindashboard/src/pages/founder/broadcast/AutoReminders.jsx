import React, { useState } from "react";
import {
  Bell,
  Clock,
  Utensils,
  Dumbbell,
  HeartPulse,
  Send,
  Edit3,
} from "lucide-react";

const ReminderCard = ({
  title,
  isActive,
  onToggle,
  settings,
  message,
  type,
}) => {
  const getIcon = () => {
    switch (type) {
      case "meal":
        return <Utensils size={18} />;
      case "workout":
        return <Dumbbell size={18} />;
      case "therapy":
        return <HeartPulse size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const getIconColorClass = () => {
    switch (type) {
      case "meal":
        return "text-orange-600 bg-orange-100/50";
      case "workout":
        return "text-blue-600 bg-blue-100/50";
      case "therapy":
        return "text-purple-600 bg-purple-100/50";
      default:
        return "text-[#0A4F48] bg-emerald-100/50";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-300 hover:shadow-lg group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl transition-colors duration-300 ${getIconColorClass()}`}
          >
            {getIcon()}
          </div>
          <h3 className="text-gray-800 font-bold text-base">{title}</h3>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={onToggle}
          />
          <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-[#0A4F48]"></div>
        </label>
      </div>

      <div className="space-y-4 flex-1">
        <div className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-gray-400" />
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">
              Schedule
            </span>
          </div>
          <div className="space-y-3">
            {settings.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-medium">
                  {item.label}
                </span>
                <span className="text-gray-900 font-semibold text-sm bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-100 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={14} className="text-gray-400" />
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">
              Reminder Template
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed truncate italic overflow-hidden">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
          <Edit3 size={14} />
          Edit Settings
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0A4F48] text-white rounded-xl text-xs font-bold hover:bg-[#073a35] transition-all shadow-sm">
          <Send size={14} />
          Send Test
        </button>
      </div>
    </div>
  );
};

const AutoReminders = () => {
  const [mealActive, setMealActive] = useState(true);
  const [workoutActive, setWorkoutActive] = useState(true);
  const [therapyActive, setTherapyActive] = useState(true);

  const mealSettings = [
    { label: "Breakfast", time: "08:30 AM" },
    { label: "Lunch", time: "01:00 PM" },
    { label: "Dinner", time: "07:00 PM" },
  ];

  const workoutSettings = [
    { label: "Morning", time: "06:30 AM" },
    { label: "Evening", time: "07:00 PM" },
  ];

  const therapySettings = [{ label: "Daily Session", time: "08:00 PM" }];

  return (
    <div className="flex-1 flex flex-col gap-6 bg-[#F0F4F8] pb-8 overflow-auto no-scrollbar h-[calc(100vh-130px)] pr-2">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Automatic Reminders
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Configure scheduled notifications for the community
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-[#0A4F48] rounded-xl border border-emerald-100">
          <div className="w-1.5 h-1.5 bg-[#0A4F48] rounded-full animate-pulse" />
          <span className="text-xs font-bold">Automation Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
        <ReminderCard
          title="Meal Plan"
          type="meal"
          isActive={mealActive}
          onToggle={() => setMealActive(!mealActive)}
          settings={mealSettings}
          message="Hi! Don't forget to log your nutritious meal 🍽️"
        />
        <ReminderCard
          title="Workout Routine"
          type="workout"
          isActive={workoutActive}
          onToggle={() => setWorkoutActive(!workoutActive)}
          settings={workoutSettings}
          message="Time for your workout! 💪 Let's smash those goals."
        />
        <ReminderCard
          title="Therapy Sessions"
          type="therapy"
          isActive={therapyActive}
          onToggle={() => setTherapyActive(!therapyActive)}
          settings={therapySettings}
          message="Take a deep breath 🧘 Your therapy session is ready."
        />
      </div>
    </div>
  );
};

export default AutoReminders;

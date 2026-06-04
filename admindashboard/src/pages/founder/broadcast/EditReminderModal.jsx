import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getReminders,
  updateReminder,
} from "@/redux/features/autoReminder/reminder.thunk";

const EditReminderModal = ({ isOpen, onClose, reminder }) => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    if (isOpen && reminder) {
      setMessage(reminder.message || "");
      setTemplateName(reminder.templateName || "");
      setSettings(reminder.settings || []);
    }
  }, [isOpen, reminder]);

  if (!isOpen) return null;

  const formatTo24Hour = (time) => {
    if (!time) return "";

    if (/^\d{2}:\d{2}$/.test(time)) return time;

    const [rawTime, modifier] = time.split(" ");
    if (!rawTime || !modifier) return "";

    let [hours, minutes] = rawTime.split(":");
    hours = parseInt(hours, 10);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const convertTo12Hour = (time24h) => {
    if (!time24h) return "";

    let [hours, minutes] = time24h.split(":");
    hours = parseInt(hours);

    const modifier = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    return `${hour12}:${minutes} ${modifier}`;
  };

  const handleTimeChange = (index, value) => {
    const updated = [...settings];

    updated[index] = {
      ...updated[index],
      time: convertTo12Hour(value), 
    };

    setSettings(updated);
  };


  const handleSave = async () => {
    await dispatch(
      updateReminder({
        type: reminder.type,
        data: { message, settings, templateName },
      }),
    );

    dispatch(getReminders()); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="font-bold text-lg">Edit Reminder</h2>

        {/* Template Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Template Name (Meta)</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            readOnly
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g. meal_plan_reminder"
          />
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message Content (Variable)</label>
          <textarea
            className="w-full border rounded p-2 text-sm h-24"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Times */}
        {settings.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span>{item.label}</span>
            <input
              type="time"
              value={formatTo24Hour(item.time)} 
              onChange={(e) => handleTimeChange(idx, e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSave}
            className="bg-[#0A4F48] text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReminderModal;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateReminder } from "@/redux/features/autoReminder/reminder.thunk";

const EditReminderModal = ({ isOpen, onClose, reminder }) => {
  const dispatch = useDispatch();

  const [message, setMessage] = useState(reminder?.message || "");
  const [settings, setSettings] = useState(reminder?.settings || []);

  if (!isOpen) return null;

  const handleTimeChange = (index, value) => {
    const updated = [...settings];
    updated[index].time = value;
    setSettings(updated);
  };

  const handleSave = () => {
    dispatch(
      updateReminder({
        type: reminder.type,
        data: { message, settings },
      }),
    );
    onClose();
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = parseInt(hours, 10) + 12;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] space-y-4">
        <h2 className="font-bold text-lg">Edit Reminder</h2>

        {/* Message */}
        <textarea
          className="w-full border rounded-lg p-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Times */}
        {settings.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span>{item.label}</span>
            <input
              type="time"
              value={convertTo24Hour(item.time)}
              onChange={(e) => handleTimeChange(idx, e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        ))}

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

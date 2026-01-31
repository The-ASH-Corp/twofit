import React from "react";
import { useNavigate } from "react-router-dom";

export default function HabitStartButton({ clientId }) {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          navigate(`therapy/add-habit/${clientId}`);
        }}
        className="bg-green-800 px-2 py-2 text-white rounded-md"
      >
        Add Habit
      </button>
    </div>
  );
}

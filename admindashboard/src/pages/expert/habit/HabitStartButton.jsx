import { useNavigate } from "react-router-dom";

export default function HabitStartButton({ clientId }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();  
    navigate(`add-habit/${clientId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-800 px-2 py-2 text-white rounded-md"
    >
      Add Habit
    </button>
  );
}

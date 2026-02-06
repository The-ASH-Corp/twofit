import { useNavigate } from "react-router-dom";

export default function HabitStartButton({ clientId }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();  
    navigate(`add-habit/${clientId}`);
  };

  return (
<<<<<<< HEAD
    <button
      onClick={handleClick}
      className="bg-green-800 px-2 py-2 text-white rounded-md"
    >
      Add Habit
    </button>
=======
    <div>
      <button
        onClick={(e) => {
           e.stopPropagation()
          navigate(`add-habit/${clientId}`);
        }}
        className="bg-green-800 px-2 py-2 text-white rounded-md"
      >
        Add Habit
      </button>
    </div>
>>>>>>> f1a2276e4fcc1ef12bc6a61637e885f3d42e678f
  );
}

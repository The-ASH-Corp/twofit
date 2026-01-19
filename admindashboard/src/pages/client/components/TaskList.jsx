import React, { useEffect, useState } from "react";
import TaskModal from "./TaskModal";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { useDispatch } from "react-redux";

export default function TaskList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const user =useAppSelector(selectUser)
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([])

  const fetchProgramData = async () => {
    const data = await  dispatch(getProgramById(user?.programType)).unwrap();
    setPlans(data.plan);
  }
  useEffect(() => {
    fetchProgramData();
  }, []);
  console.log(plans,"plams");
  const list = [
    {
      type: "Breakfast",
      time: "7:30 – 10:00 AM",
      desc: "Eat a balanced, healthy meal.",
      image: "src/assets/breakfast.svg",
      status: "pending",
    },
    {
      type: "Lunch",
      time: "1:00 – 2:30 PM",
      desc: "Balanced meal, avoid heavy food.",
      image: "src/assets/breakfast.svg",
      status: "pending",
    },
    {
      type: "Evening Snack",
      time: "4:30 – 5:00 PM",
      desc: "Light and healthy snack.",
      image: "src/assets/breakfast.svg",
      status: "pending",
    },
    {
      type: "Dinner",
      time: "7:00 – 9:00 PM",
      desc: "Light, easy-to-digest meal.",
      image: "src/assets/breakfast.svg",
      status: "pending",
    },
    {
      type: "Workout",
      time: "30-60 minutes.",
      desc: "Morning or evening. Stay hydrated.",
      image: "src/assets/breakfast.svg",
      status: "pending",
    },
    {
      type: "Therapy",
      time: "After workout or evening.",
      desc: "Stretching or recovery sessi...",
      image: "src/assets/breakfast.svg",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-3 mt-4">
      {list.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={item.image}
              alt={item.type}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#0A4F48] text-[15px]">
              {item.type}
            </h3>
            <p className="text-[12px] text-gray-500 font-medium truncate">
              <span className="text-[#0A4F48] font-semibold">{item.time}</span>{" "}
              {item.desc}
            </p>
          </div>

          <div className="flex gap-2">
            <button className="bg-gray-50 px-6 py-2 rounded-lg text-[13px] font-bold text-gray-400 hover:bg-gray-100 transition-colors">
              Skip
            </button>
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setSelectedTask(item);
              }}
              className="bg-[#0A4F48] text-[13px] font-bold px-6 py-2 text-white rounded-lg hover:bg-[#083d38] transition-colors"
            >
              View
            </button>
          </div>
        </div>
      ))}

      {isOpen && (
        <TaskModal task={selectedTask} onClose={() => setIsOpen(!isOpen)} />
      )}
    </div>
  );
}

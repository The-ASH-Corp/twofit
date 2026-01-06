import React, { useState } from "react";
import breakfast from "/src/assets/breakfast.svg";
import TaskModal from "./TaskModal";

export default function TaskList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const list = [
    {
      type: "Breakfast",
      time: "7:30 – 10:30 AM",
      desc: "Eat a healthy breakfast with fruits & protein",
      image: breakfast,
      status: "pending",
    },
    {
      type: "Workout",
      time: "6:00 – 7:00 AM",
      desc: "Complete strength training workout",
      image: breakfast,
      status: "completed",
    },
    {
      type: "Lunch",
      time: "1:00 – 2:00 PM",
      desc: "Balanced meal with carbs and vegetables",
      image: breakfast,
      status: "pending",
    },
    {
      type: "Therapy",
      time: "5:00 – 5:30 PM",
      desc: "Breathing and relaxation session",
      image: breakfast,
      status: "missed",
    },
    {
      type: "Dinner",
      time: "8:00 – 9:00 PM",
      desc: "Light dinner with protein",
      image: breakfast,
      status: "pending",
    },
  ];

  return (
    <div className="space-y-4">
      {list.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl   overflow-hidden">
            <img
              src={item.image}
              alt={item.type}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="font-bold text-[#0A4F48]">{item.type}</h3>
            <div className="flex gap-4">
              {" "}
              <p className="text-xs  ">{item.time}</p>
              <p className="text-xs">{item.desc}</p>
            </div>
          </div>

          <button className="bg-[#EBF3F2] px-8 py-2 rounded-lg text-sm">
            Skip
          </button>
          <button
            onClick={() => {setIsOpen(!isOpen);setSelectedTask(item)}}
            className="bg-[#0A4F48] text-sm px-8 py-2 text-white rounded-lg"
          >
            View
          </button>
        </div>
      ))}

      {isOpen && <TaskModal task={selectedTask} onClose={()=>setIsOpen(!isOpen)} />}
    </div>
  );
}

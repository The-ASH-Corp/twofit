import { assets } from '@/assets/asset';
import React, { useState } from 'react'
import { Calendar } from '../ui/calendar';

const missedTasks = [
  {
    date: "March 2",
    missedItems: "Breakfast skipped",
  },
  {
    date: "March 5",
    missedItems: "No tasks completed",
  },
  {
    date: "March 28",
    missedItems: "Some tasks missed",
  },
];

const dailyActivityLog = [
  {
    title: "Meal Uploaded (Lunch: Paneer Salad)",
    date: "10:40 AM",
  },
  {
    title: "Workout Completed (20 mins HIIT)",
    date: "8:15 AM",
  },
  {
    title: "Meal Skipped (Dinner)",
    date: "Yesterday, 6:05 PM",
  },
  {
    title: "Therapy Task Completed",
    date: "2 Days Ago, 2:30 PM",
  },
];

const ProfileRightSide = () => {
    const [date, setDate] = useState(new Date(2025, 5, 12));
      const [taskOpen, setTaskOpen] = useState(false)
  return (
    <div className="w-[25%] flex flex-col items-center gap-4 overflow-auto  no-scrollbar">
      {/* calender */}
      <div className="flex flex-col items-center w-full bg-white rounded-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg px-2 py-4 bg-[#EBF3F2] [--cell-size:37px] w-full "
          buttonVariant="ghost"
        />
        <div className="w-full flex flex-col items-center gap-4 p-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-[16px] font-bold text-[#0A4F48]">
              Missed Tasks
            </h3>
            <button onClick={() => setTaskOpen(!taskOpen)}>
              {!taskOpen ? (
                <img src={assets.upVector} alt="down vector" className="w-3" />
              ) : (
                <img
                  src={assets.downVector}
                  alt="down vector"
                  className="w-3"
                />
              )}
            </button>
          </div>
          <div
            className={`flex flex-col items-center gap-4 w-full overflow-hidden transition-all duration-700 ease-in-out ${
              taskOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {missedTasks.map((items) => (
              <div className="bg-[#F8F8F8] w-full rounded-lg p-4 flex flex-col items-start">
                <span className="text-[12px] text-[#66706D]">{items.date}</span>
                <div>
                  <span className="text-[14px] text-[#0A4F48] font-bold">
                    {items.missedItems}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Weight Progress */}
      <div className="flex flex-col items-center w-full p-4 bg-white rounded-lg gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#0A4F48]">
            Weight Progress
          </h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[13px]" />
          </button>
        </div>
        <div className="w-full bg-[#F8F8F8] rounded-lg flex flex-col items-center gap-5 p-3">
          <div className="flex items-center justify-between w-full ">
            <span className="text-[12px] ">Today</span>
            <span className="text-[14px] font-bold text-[#0A4F48]">
              78.5 kg
            </span>
          </div>
          <div className="flex flex-col items-center w-full gap-2">
            <div className="flex items-center justify-between w-full ">
              <span className="text-[12px] text-[#66706D]">Start</span>
              <span className="text-[12px]">80.2 kg</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] text-[#66706D]">Change</span>
              <span className="text-[12px]">1.7 kg</span>
            </div>
          </div>
        </div>
      </div>
      {/* Measurements */}
      <div className="flex flex-col items-center w-full p-4 bg-white rounded-lg gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#0A4F48]">Measurements</h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[13px]" />
          </button>
        </div>
        <div className="flex flex-col items-center w-full gap-2.5">
          <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
            <div className="absolute left-0 top-0 w-2 h-full bg-[#0A4F48] rounded-xs"></div>
            <div className="w-full flex items-center justify-between">
              <p className="text-[12px] ">Chest</p>
              <div className="flex items-center gap-1.5">
                <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                  <p className="text-[10px] text-[#66706D]">
                    Before <span className="text-black"> 98 cm</span>
                  </p>
                </div>
                <p className="text-[#0A4F48] text-[12px] font-bold">96 cm</p>
              </div>
            </div>
          </div>
          <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
            <div className="absolute left-0 top-0 w-2 h-full bg-[#F4DBC7] rounded-xs"></div>
            <div className="w-full flex items-center justify-between">
              <p className="text-[12px] ">Waist</p>
              <div className="flex items-center gap-1.5">
                <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                  <p className="text-[10px] text-[#66706D]">
                    Before <span className="text-black"> 89 cm</span>
                  </p>
                </div>
                <p className="text-[#0A4F48] text-[12px] font-bold">89 cm</p>
              </div>
            </div>
          </div>
          <div className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]">
            <div className="absolute left-0 top-0 w-2 h-full bg-[#EBF3F2] rounded-xs"></div>
            <div className="w-full flex items-center justify-between">
              <p className="text-[12px] ">Hips</p>
              <div className="flex items-center gap-1.5">
                <div className="pr-1.5 border-r border-r-[#DBDEDD]">
                  <p className="text-[10px] text-[#66706D]">
                    Before <span className="text-black">101 cm</span>
                  </p>
                </div>
                <p className="text-[#0A4F48] text-[12px] font-bold">99 cm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Daily Activity Log */}
      <div className="flex flex-col items-center w-full gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#0A4F48]">
            Daily Activity Log
          </h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[13px]" />
          </button>
        </div>
        <div className="flex flex-col items-center w-full">
          {dailyActivityLog.map((items, i) => (
            <div
              key={i}
              className="flex items-center gap-4 justify-start w-full"
            >
              <div
                className={`${
                  i % 2 === 0 ? "bg-[#0A4F48]" : "bg-[#F4DBC7]"
                } rounded-full p-2`}
              >
                {i % 2 === 0 ? (
                  <img
                    src={assets.bellVector}
                    alt="bell vector"
                    className="w-4 h-3.5"
                  />
                ) : (
                  <img
                    src={assets.greenBellVector}
                    alt="bell vector"
                    className="w-4 h-3.5"
                  />
                )}
              </div>
              <div className="flex flex-col items-start gap-2 w-full py-3 border-b border-b-[#DBDEDD]">
                <span className="text-[12px] leading-[150%]">
                  {items.title}
                </span>
                <span className="text-[10px] text-[#66706D] leading-[150%]">
                  {items.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileRightSide;
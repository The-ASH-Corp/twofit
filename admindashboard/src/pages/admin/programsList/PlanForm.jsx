import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Trash2,
  Upload,
  Check,
} from "lucide-react";

export default function PlanForm() {
  const [weeks, setWeeks] = useState([
    {
      id: 1,
      name: "Week 1",
      expanded: true,
      days: [
        {
          id: 1,
          name: "Day 1",
          expanded: true,
        },
        {
          id: 2,
          name: "Day 2",
          expanded: false,
        },
      ],
    },
    {
      id: 2,
      name: "Week 2",
      expanded: false,
      days: [],
    },
    {
      id: 3,
      name: "Week 3",
      expanded: false,
      days: [],
    },
  ]);

  const toggleWeek = (id) => {
    setWeeks(
      weeks.map((week) =>
        week.id === id ? { ...week, expanded: !week.expanded } : week
      )
    );
  };

  const toggleDay = (weekId, dayId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) =>
              day.id === dayId ? { ...day, expanded: !day.expanded } : day
            ),
          };
        }
        return week;
      })
    );
  };

  const addWeek = () => {
    const newWeek = {
      id: weeks.length + 1,
      name: `Week ${weeks.length + 1}`,
      expanded: true,
      days: [],
    };
    setWeeks([...weeks, newWeek]);
  };

  const addDay = (weekId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          if (week.days.length >= 7) return week;
          const newDay = {
            id: week.days.length + 1,
            name: `Day ${week.days.length + 1}`,
            expanded: true,
          };
          return { ...week, days: [...week.days, newDay] };
        }
        return week;
      })
    );
  };

  const removeWeek = (weekId) => {
    setWeeks(weeks.filter((week) => week.id !== weekId));
  };

  const removeDay = (weekId, dayId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.filter((day) => day.id !== dayId),
          };
        }
        return week;
      })
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-[#F8F9FA]">
      {/* Left Content - Form Area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
              Program Name
            </label>
            <span className="text-sm font-bold text-[#0A4F48]">
              Weight Loss
            </span>
          </div>
          <hr className="border-gray-50" />
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#66706D] uppercase tracking-wider">
              Duration
            </label>
            <div className="flex gap-2">
              {["30 Days", "60 Days", "90 Days"].map((dur, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    i === 0
                      ? "bg-[#EBF3F2] text-[#0A4F48] border-transparent"
                      : "bg-white text-[#66706D] border-gray-200"
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Plan Structure Header */}
        <h2 className="text-lg font-bold text-[#0A4F48]">
          Create Plan Structure
        </h2>

        {/* Weeks List */}
        <div className="flex flex-col gap-4">
          {weeks.map((week) => (
            <div
              key={week.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Week Header */}
              <div className="p-4 flex items-center justify-between bg-white">
                <h3 className="text-base font-bold text-[#011412]">
                  {week.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeWeek(week.id)}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove Week"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleWeek(week.id)}
                    className="p-1.5 bg-[#F8F9FA] hover:bg-gray-100 rounded-lg text-[#66706D]"
                  >
                    {week.expanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>
              </div>

              {week.expanded && (
                <div className="p-4 pt-0 border-t border-gray-50">
                  {/* Week Input */}
                  <div className="my-4">
                    <label className="block text-xs font-bold text-[#011412] mb-1.5">
                      Week Title
                    </label>
                    <input
                      type="text"
                      defaultValue="Foundation Phase"
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0A4F48] transition-colors"
                      placeholder="Enter week title"
                    />
                  </div>

                  {/* Days List */}
                  <div className="flex flex-col gap-4">
                    {week.days.map((day) => (
                      <div
                        key={day.id}
                        className="border border-gray-100 rounded-xl overflow-hidden"
                      >
                        {/* Day Header */}
                        <div className="p-3 flex items-center justify-between bg-gray-50/50">
                          <span className="text-sm font-bold text-[#011412]">
                            {day.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeDay(week.id, day.id)}
                              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                              title="Remove Day"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => toggleDay(week.id, day.id)}
                              className="p-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-[#66706D]"
                            >
                              {day.expanded ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Day Content */}
                        {day.expanded && (
                          <div className="p-4 bg-white flex flex-col gap-6">
                            <PlanSection title="Workout Plan" type="workout" />
                          </div>
                        )}
                      </div>
                    ))}
                    {week.days.length < 7 && (
                      <button
                        onClick={() => addDay(week.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#EBF3F2] text-[#0A4F48] text-xs font-bold rounded-lg hover:bg-[#dceceb] transition-colors w-fit"
                      >
                        <Plus size={14} />
                        Add New Day
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={addWeek}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0A4F48] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#08443e] transition-all w-fit mx-auto"
          >
            <Plus size={16} />
            Add New Week
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      {/* <div className="w-full lg:w-80 flex flex-col gap-6">
        <SidebarCard title="Plan Media">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-xs text-gray-400">No Data Found</p>
          </div>
        </SidebarCard>
        <SidebarCard title="Change Logs">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-xs text-gray-400">No Data Found</p>
          </div>
        </SidebarCard>

      </div> */}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 right-0 bg-gray-50 border-t border-gray-200 p-4 z-10 left-0 lg:left-[225px]">
        {/* Adjust lg:pl-64 based on your actual sidebar width if resizing */}
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          {/* <hr className="w-full text-gray-300" /> */}
          <div className="flex items-center justify-between w-full text-[12px] font-semibold">
            <button className="text-[#011412]">Save as Draft</button>
            <div className="flex gap-2">
              <button className="bg-[#EBF3F2] rounded-md p-2 min-w-[80px]">
                Cancel
              </button>
              <button className="bg-[#0A4F48] p-2 rounded-md text-white min-w-[120px]">
                Save & Add Plan
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-32"></div>
    </div>
  );
}

const SidebarCard = ({ title, children }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
    <h3 className="text-sm font-bold text-[#0A4F48] mb-4">{title}</h3>
    {children}
  </div>
);

const PlanSection = ({ title, type }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-bold text-[#011412]">{title}</h4>
        <ChevronUp
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4">
          {/* Input Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label={type === "workout" ? "Exercise Name" : "Therapy Type"}
              placeholder={
                type === "workout"
                  ? "Enter Exercise Name"
                  : "Select Therapy Type"
              }
            />
            <InputGroup
              label={type === "workout" ? "Notes" : "Attach URL"}
              placeholder={type === "workout" ? "Add Notes" : "Paste link here"}
            />
          </div>
          {/* Input Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {type === "workout" && (
              <InputGroup label="Attach URL" placeholder="Paste link here" />
            )}
            {type === "therapy" && (
              <InputGroup label="Notes" placeholder="Add Notes" />
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#011412]">
                Media Attachment
              </label>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#EBF3F2] text-[#011412] text-xs font-bold whitespace-nowrap">
                  Upload File
                </button>
                <input
                  type="text"
                  placeholder={
                    type === "workout"
                      ? "Upload Exercise Video"
                      : "Upload Video, Audio and Photos"
                  }
                  className="w-full px-4 py-2.5 text-xs outline-none text-gray-500 placeholder:text-gray-400"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Existing Items (Mock) */}
          {type === "workout" && (
            <div className="flex flex-col gap-2 mt-2">
              <ExistingItem name="Bodyweight Squats" checked={true} />
              <ExistingItem name="Glute Bridges" checked={false} />
            </div>
          )}

          {/* Create Exercise Form (Green Box) - Only for Workout in screenshot, but generic here */}
          {type === "workout" && (
            <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 mt-2">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xs font-bold text-[#011412]">
                  Create Exercise
                </h5>
                <button className="px-4 py-1.5 bg-[#0A4F48] text-white text-[10px] font-bold rounded-lg shadow-sm">
                  Update
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InputGroup
                  label="Exercise Name"
                  placeholder="Enter Exercise Name"
                  bg="white"
                />
                <InputGroup label="Notes" placeholder="Add Notes" bg="white" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup
                  label="Attach URL"
                  placeholder="Paste link here"
                  bg="white"
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#011412]">
                    Media Attachment
                  </label>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#EBF3F2] text-[#011412] text-xs font-bold whitespace-nowrap">
                      Upload File
                    </button>
                    <input
                      type="text"
                      placeholder="Upload Exercise Video"
                      className="w-full px-4 py-2.5 text-xs outline-none text-gray-500 placeholder:text-gray-400 bg-white"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, placeholder, bg = "transparent" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-[#011412]">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full p-3 ${
        bg === "white" ? "bg-white" : "bg-white"
      } border border-gray-200 rounded-xl text-xs outline-none focus:border-[#0A4F48] transition-colors placeholder:text-gray-400`}
    />
  </div>
);

const ExistingItem = ({ name, checked }) => (
  <div
    className={`p-3 rounded-xl flex items-center justify-between ${
      checked ? "bg-[#F8F9FA]" : "bg-[#F8F9FA]"
    } border border-gray-50`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
          checked ? "bg-[#0A4F48] border-[#0A4F48]" : "bg-white border-gray-200"
        }`}
      >
        {checked && <Check size={12} className="text-white" />}
      </div>
      <span className="text-xs font-bold text-[#011412]">{name}</span>
    </div>
    <button className="text-gray-400 hover:text-gray-600">
      <MoreHorizontal size={16} />
    </button>
  </div>
);

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Plus } from "lucide-react";
import TherapyPlan from "./TherapyPlan";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import {
  createNewPlan,
  getTherapyPlanById,
  updateTherapyPlan,
} from "@/redux/features/therapy/therapy.thunk";

const INITIAL_WEEKS = [
  {
    id: 1,
    name: "Week 1",
    title: "",
    expanded: true,
    days: [
      {
        id: 1,
        name: "Day 1",
        expanded: true,
        therapies: [],
      },
      {
        id: 2,
        name: "Day2",
        expanded: true,
        therapies: [],
      },
    ],
  },
];

const TherapyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [weeks, setWeeks] = useState(INITIAL_WEEKS);
  const [therapyName, setTherapyName] = useState("");
  const [isAssignedToClients, setIsAssignedToClients] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPlan = async () => {
      const result = await dispatch(getTherapyPlanById(id));
      if (getTherapyPlanById.fulfilled.match(result)) {
        const plan = result.payload?.data || result.payload;
        if (!plan) return;

        setIsAssignedToClients((plan.clients || 0) > 0);

        setTherapyName(plan.name || "");

        const mappedWeeks = (plan.weeks || []).map((week, wIndex) => ({
          id: wIndex + 1,
          name: week.name || `Week ${wIndex + 1}`,
          title: week.title || "",
          expanded: wIndex === 0,
          days: (week.days || []).map((day, dIndex) => ({
            id: dIndex + 1,
            name: day.name || `Day ${dIndex + 1}`,
            expanded: dIndex === 0,
            therapies: (day.therapies || []).map((th, tIndex) => ({
              ...th,
              id: th.id || th._id || `${wIndex + 1}-${dIndex + 1}-${tIndex + 1}`,
            })),
          })),
        }));

        setWeeks(mappedWeeks.length ? mappedWeeks : INITIAL_WEEKS);
      }
    };

    fetchPlan();
  }, [id, dispatch]);

  const toggleWeek = (id) => {
    setWeeks(
      weeks.map((week) =>
        week.id === id ? { ...week, expanded: !week.expanded } : week,
      ),
    );
  };

  const toggleDay = (weekId, dayId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) =>
              day.id === dayId ? { ...day, expanded: !day.expanded } : day,
            ),
          };
        }
        return week;
      }),
    );
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
            therapies: [],
          };
          return { ...week, days: [...week.days, newDay] };
        }
        return week;
      }),
    );
  };
  const addWeek = () => {
    const newWeek = {
      id: weeks.length + 1,
      name: `Week ${weeks.length + 1}`,
      title: "",
      expanded: true,
      days: [],
    };
    setWeeks([...weeks, newWeek]);
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
      }),
    );
  };

  const addTherapy = (weekId, dayId, therapy) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) => {
              if (day.id === dayId) {
                return {
                  ...day,
                  therapies: [
                    ...(day.therapies || []),
                    { ...therapy, id: Date.now() },
                  ],
                };
              }
              return day;
            }),
          };
        }
        return week;
      }),
    );
  };

  const updateWeekTitle = (weekId, value) => {
    setWeeks(
      weeks.map((week) =>
        week.id === weekId ? { ...week, title: value } : week,
      ),
    );
  };

  const updateTherapy = (weekId, dayId, therapy) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) => {
              if (day.id === dayId) {
                return {
                  ...day,
                  therapies: (day.therapies || []).map((th) => {
                    const currentId = th.id || th._id;
                    const incomingId = therapy.id || therapy._id;
                    return currentId === incomingId ? { ...th, ...therapy } : th;
                  }),
                };
              }
              return day;
            }),
          };
        }
        return week;
      }),
    );
  };

  const removeTherapy = (weekId, dayId, therapyId) => {
    setWeeks(
      weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            days: week.days.map((day) => {
              if (day.id === dayId) {
                return {
                  ...day,
                  therapies: (day.therapies || []).filter((th) => {
                    const currentId = th.id || th._id;
                    return currentId !== therapyId;
                  }),
                };
              }
              return day;
            }),
          };
        }
        return week;
      }),
    );
  };

  const handleSave = async () => {
    if (!therapyName.trim()) {
      toast.error("Therapy name is required");
      return;
    }
    const cleanedWeeks = weeks.map((week) => ({
      name: week.name,
      title: week.title,
      days: week.days.map((day) => ({
        name: day.name,
        therapies: (day.therapies || []).map((th) => {
          const { id: _idToStrip, ...rest } = th;
          return rest; // remove frontend-only ID, keep _id if exists or let backend handle it
        }),
      })),
    }));

    const payload = {
      name: therapyName,
      weeks: cleanedWeeks,
    };

    let resultAction;
    if (id) {
       resultAction = await dispatch(updateTherapyPlan({ id, planData: payload }));
    } else {
       resultAction = await dispatch(createNewPlan(payload));
    }

    if (resultAction.meta.requestStatus === "fulfilled") {
      toast.success(id ? "Plan updated successfully" : "Plan created successfully");
      navigate(-1);
    } else {
      toast.error(id ? "Failed to update plan" : "Failed to create plan");
    }
  };
  return (
    <div>
      {/* <TherapyHeader/> */}

      <h2 className="text-lg font-bold text-[#0A4F48] mb-4">
        {id ? "Edit Plan Structure" : "Create Plan Structure"}
      </h2>
      <div className="my-4">
        <label className="block text-xs font-bold text-[#011412] mb-1.5">
          Therapy Name
        </label>
        <input
          type="text"
          value={therapyName}
          onChange={(e) => setTherapyName(e.target.value)}
          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0A4F48] transition-colors"
          placeholder="Enter Therapy Name"
        />
      </div>
      <div className="flex flex-col gap-4">
        {weeks.map((week) => (
          <div
            key={week.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            {/* Week Header */}
            <div className="p-4 flex items-center justify-between bg-white rounded-t-2xl">
              <h3 className="text-base font-bold text-[#011412]">
                {week.name}
              </h3>
              <div className="flex items-center gap-2">
                {!isAssignedToClients && (
                  <button
                    onClick={() => removeWeek(week.id)}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remove Week"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
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
              <div className="p-4 pt-0 border-t border-gray-50 rounded-b-2xl">
                <div className="my-4">
                  <label className="block text-xs font-bold text-[#011412] mb-1.5">
                    Week Title
                  </label>
                  <input
                    type="text"
                    value={week.title}
                    onChange={(e) => updateWeekTitle(week.id, e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0A4F48] transition-colors"
                    placeholder="Enter week title"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {week.days.map((day) => (
                    <div
                      key={day.id}
                      className="border border-gray-100 rounded-xl"
                    >
                      <div className="p-3 flex items-center justify-between bg-gray-100 rounded-t-xl">
                        <span className="text-sm font-bold text-[#011412]">
                          {day.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {!isAssignedToClients && (
                            <button
                              onClick={() => removeDay(week.id, day.id)}
                              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                              title="Remove Day"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
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

                      {day.expanded && (
                        <div className="bg-white p-4 flex flex-col gap-6 rounded-b-xl ">
                          <TherapyPlan
                            title="Therapy Plan"
                            therapies={day.therapies || []}
                            onAddTherapy={(therapy) =>
                              addTherapy(week.id, day.id, therapy)
                            }
                            onUpdateTherapy={(therapy) =>
                              updateTherapy(week.id, day.id, therapy)
                            }
                            onRemoveTherapy={(therapyId) =>
                              removeTherapy(week.id, day.id, therapyId)
                            }
                            readOnly={isAssignedToClients}
                          />
                        </div>
                      )}

                      {/* {day.expanded && (
                                  <div className="p-4 bg-white flex flex-col gap-6 rounded-b-xl">
                                    <TherapyPlanSection
                                      title="Workout Plan"
                                      type="Workout"
                                      exercises={day.exercises || []}
                                      onAddExercise={(exercise) =>
                                        addExercise(week.id, day.id, exercise)
                                      }
                                      onUpdateExercise={(exercise) =>
                                        updateExercise(week.id, day.id, exercise)
                                      }
                                      onRemoveExercise={(exerciseId) =>
                                        removeExercise(week.id, day.id, exerciseId)
                                      }
                                    />
                                  </div>
                                )} */}
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
          className="flex mb-20 items-center justify-center gap-2 px-6 py-3 bg-[#0A4F48] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#08443e] transition-all w-fit mx-auto"
        >
          {/* <Plus size={16} /> */}
          Add New Week
        </button>
      </div>
      <div className="fixed bottom-0 right-0 bg-gray-50 border-t border-gray-200 p-4 z-10 left-0 lg:left-[225px]">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-end w-full text-[12px] font-semibold">
            <div className="flex gap-2">
              <button className="bg-[#EBF3F2] rounded-md p-2 min-w-20"onClick={()=>navigate(-1)} >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#0A4F48] p-2 rounded-md text-white min-w-[120px]"
              >
                {id ? "Update Plan" : "Save & Add Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyForm;

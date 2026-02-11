import HabitModel from "./habit.model.js";

export const createHabitsService = async (clientId, habitNames) => {
  const existing = await HabitModel.findOne({ clientId });

  if (existing) {
    throw new Error("Habits already exist for this client");
  }

  const formattedHabits = habitNames.map((name) => ({
    name,
    logs: [],
  }));

  return await HabitModel.create({
    clientId,
    habits: formattedHabits,
  });
};

export const updateHabit = async (habitId, updateData) => {
  return await HabitModel.findByIdAndUpdate(
    habitId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const getClientHabitsService = async (clientId) => {
  return await HabitModel.findOne({ clientId });
};

export const getHabitByIdService=async(habitId)=>{
  return await HabitModel.findOne({_id: habitId })
}
export const updateHabitStatusService = async (
  clientId,
  habitName,
  status
) => {
  const habitDoc = await HabitModel.findOne({ clientId });

  if (!habitDoc) {
    throw new Error("Habits not found for this client");
  }

  const normalizedHabitName = habitName.trim().toLowerCase();

  console.log(
    "Requested:", normalizedHabitName,
    "Available:", habitDoc.habits.map(h => h.name)
  );

  const habit = habitDoc.habits.find(
    (h) => h.name.toLowerCase() === normalizedHabitName
  );

  if (!habit) {
    throw new Error("Habit not found");
  }

  // today check
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingLog = habit.logs.find((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });

  if (existingLog) {
    existingLog.status = status;
  } else {
    habit.logs.push({ status, date: new Date() });
  }

  await habitDoc.save();
  return habit;
};

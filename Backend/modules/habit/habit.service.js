import HabitModel from "./habit.model.js";

const normalizeDate = (date = new Date()) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

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
    { new: true, runValidators: true },
  );
};

export const getClientHabitsService = async (clientId) => {
  return await HabitModel.findOne({ clientId });
};

export const getHabitByIdService = async (habitId) => {
  return await HabitModel.findOne({ _id: habitId });
};

export const getTodayReflectionService = async (clientId) => {
  const habitDoc = await HabitModel.findOne({ clientId });

  if (!habitDoc) {
    throw new Error("Habits not found for this client");
  }

  const today = normalizeDate();
  const todayReflection = habitDoc.reflectionLogs?.find((entry) => {
    const reflectionDate = normalizeDate(entry.date);
    return reflectionDate.getTime() === today.getTime();
  });

  return {
    note: todayReflection?.note || "",
    date: todayReflection?.date || null,
  };
};

export const upsertTodayReflectionService = async (clientId, note = "") => {
  if (typeof note !== "string") {
    throw new Error("note must be a string");
  }

  if (note.length > 500) {
    throw new Error("Reflection note must be 500 characters or fewer");
  }

  const habitDoc = await HabitModel.findOne({ clientId });

  if (!habitDoc) {
    throw new Error("Habits not found for this client");
  }

  const today = normalizeDate();
  const existingReflection = habitDoc.reflectionLogs?.find((entry) => {
    const reflectionDate = normalizeDate(entry.date);
    return reflectionDate.getTime() === today.getTime();
  });

  if (existingReflection) {
    existingReflection.note = note;
  } else {
    habitDoc.reflectionLogs.push({
      date: new Date(),
      note,
    });
  }

  await habitDoc.save();

  const updatedReflection = habitDoc.reflectionLogs?.find((entry) => {
    const reflectionDate = normalizeDate(entry.date);
    return reflectionDate.getTime() === today.getTime();
  });

  return {
    note: updatedReflection?.note || "",
    date: updatedReflection?.date || null,
  };
};

// export const updateHabitStatusService = async (clientId, habitName, status) => {
//   const habitDoc = await HabitModel.findOne({ clientId });

//   if (!habitDoc) {
//     throw new Error("Habits not found for this client");
//   }

//   const normalizedHabitName = habitName.trim().toLowerCase();

//   console.log(
//     "Requested:",
//     normalizedHabitName,
//     "Available:",
//     habitDoc.habits.map((h) => h.name),
//   );

//   const habit = habitDoc.habits.find(
//     (h) => h.name.toLowerCase() === normalizedHabitName,
//   );

//   if (!habit) {
//     throw new Error("Habit not found");
//   }

//   // today check
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const existingLog = habit.logs.find((log) => {
//     const logDate = new Date(log.date);
//     logDate.setHours(0, 0, 0, 0);
//     return logDate.getTime() === today.getTime();
//   });

//   if (existingLog) {
//     existingLog.status = status;
//   } else {
//     habit.logs.push({ status, date: new Date() });
//   }

//   await habitDoc.save();
//   return habit;
// };

export const updateHabitStatusService = async (clientId, habitId, status) => {
  const today = normalizeDate();

  const habitDoc = await HabitModel.findOne({ clientId });

  if (!habitDoc) {
    throw new Error("Habit document not found");
  }

  const habit = habitDoc.habits.id(habitId);

  if (!habit) {
    throw new Error("Habit not found");
  }

  const existingLog = habit.logs.find((log) => {
    const logDate = normalizeDate(log.date);
    return logDate.getTime() === today.getTime();
  });

  if (existingLog) {
    existingLog.status = status;
  } else {
    habit.logs.push({
      date: new Date(),
      status,
    });
  }

  await habitDoc.save();

  return habit;
};

export const getDailyClientHabitSummary = async () => {
  const habits = await HabitModel.find().populate("clientId", "name email");

  const todayString = new Date().toDateString();

  const summary = habits.map((doc) => {
    let done = 0;
    let missed = 0;
    const todayReflection = doc.reflectionLogs?.find(
      (log) => new Date(log.date).toDateString() === todayString,
    );

    doc.habits.forEach((habit) => {
      const todayLog = habit.logs.find(
        (log) => new Date(log.date).toDateString() === todayString,
      );

      if (todayLog) {
        if (todayLog.status === "done") done++;
        if (todayLog.status === "missed") missed++;
      } else {
        missed++;
      }
    });

    const total = doc.habits.length;

    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      clientId: doc.clientId._id,
      clientName: doc.clientId.name,
      done,
      missed,
      total,
      percentage,
      reflectionNote: todayReflection?.note || "",
    };
  });

  return summary;
};
export const getWeeklyClientHabitSummaryService = async () => {
  const habits = await HabitModel.find().populate("clientId", "name");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const summary = habits.map((doc) => {
    let done = 0;
    let missed = 0;

    // ✅ define inside map
    const startDate = new Date(doc.createdAt);
    startDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today - startDate) / (1000 * 60 * 60 * 24)
    );

    // ✅ rolling week
    const cycleStart = new Date(startDate);
    cycleStart.setDate(
      startDate.getDate() + Math.floor(diffDays / 7) * 7
    );

    doc.habits.forEach((habit) => {
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(cycleStart);
        currentDate.setDate(cycleStart.getDate() + i);
        currentDate.setHours(0, 0, 0, 0);

        const log = habit.logs.find((l) => {
          const logDate = new Date(l.date);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === currentDate.getTime();
        });

        if (log) {
          if (log.status === "done") done++;
          else missed++;
        } else {
          // ✅ strict tracking
          missed++;
        }
      }
    });

    const total = doc.habits.length * 7;
    const percentage =
      total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      clientId: doc.clientId?._id,
      clientName: doc.clientId?.name,
      done,
      missed,
      total,
      percentage,
    };
  });

  return summary;
};
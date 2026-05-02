import User from "../auth/auth.model.js";
import { CoachModel } from "../coach/coach.model.js";
import mongoose from "mongoose";
import HabitModel from "../habit/habit.model.js";
import TaskSubmission from "../taskSubmission/taskSubmission.model.js";
import { calculateCoachIncentives } from "../incentive/incentive.service.js";

const ACCEPTED_SUBMISSION_STATUSES = new Set(["pending", "verified"]);

function toDateKey(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(baseDate, offsetDays) {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + offsetDays);
  return next;
}

function calculateStreakFromDateKeys(dateKeys) {
  const uniqueSortedDates = Array.from(
    new Set((dateKeys || []).filter((value) => Boolean(toDateKey(value)))),
  )
    .map((value) => toDateKey(value))
    .sort();

  if (!uniqueSortedDates.length) {
    return { activeStreak: 0, longestStreak: 0, doneToday: false };
  }

  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate = null;
  let streakEnd = null;

  uniqueSortedDates.forEach((dateKey) => {
    const currentDate = new Date(dateKey);
    currentDate.setHours(0, 0, 0, 0);

    if (previousDate) {
      const diffTime = Math.abs(currentDate - previousDate);
      const diffDays = Math.round(diffTime / 86400000);

      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    previousDate = currentDate;
    streakEnd = dateKey;
  });

  const today = new Date();
  const todayStr = toDateKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toDateKey(yesterday);

  const doneToday = uniqueSortedDates.includes(todayStr);
  const activeStreak =
    streakEnd === todayStr || streakEnd === yesterdayStr ? currentStreak : 0;

  return { activeStreak, longestStreak, doneToday };
}

function getCompletedHabitDateKeys(habitList) {
  if (!Array.isArray(habitList) || habitList.length === 0) {
    return [];
  }

  let commonDoneDates = null;

  habitList.forEach((habit) => {
    const latestStatusByDate = new Map();

    (habit?.logs || []).forEach((log) => {
      const dateKey = toDateKey(log?.date);
      if (!dateKey) return;

      const parsedDate = new Date(log?.date);
      if (Number.isNaN(parsedDate.getTime())) return;

      const normalizedStatus = String(log?.status || "").toLowerCase();
      const currentTime = parsedDate.getTime();
      const previous = latestStatusByDate.get(dateKey);

      if (!previous || currentTime >= previous.time) {
        latestStatusByDate.set(dateKey, {
          status: normalizedStatus,
          time: currentTime,
        });
      }
    });

    const doneDatesForHabit = new Set(
      Array.from(latestStatusByDate.entries())
        .filter(([, value]) => value.status === "done")
        .map(([dateKey]) => dateKey),
    );

    if (commonDoneDates === null) {
      commonDoneDates = doneDatesForHabit;
      return;
    }

    commonDoneDates = new Set(
      Array.from(commonDoneDates).filter((dateKey) =>
        doneDatesForHabit.has(dateKey),
      ),
    );
  });

  return Array.from(commonDoneDates || []).sort();
}

function toPositiveInt(value, fallbackValue) {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }

  return fallbackValue;
}

function countCompletedTasksByType(exercises, taskType) {
  const completedIndices = new Set();

  (exercises || []).forEach((exercise) => {
    const normalizedType = String(exercise?.taskType || "").toLowerCase();
    const normalizedStatus = String(exercise?.status || "").toLowerCase();
    const exerciseIndex = Number(exercise?.exerciseIndex);

    if (normalizedType !== String(taskType).toLowerCase()) return;
    if (!ACCEPTED_SUBMISSION_STATUSES.has(normalizedStatus)) return;
    if (!Number.isFinite(exerciseIndex)) return;

    completedIndices.add(exerciseIndex);
  });

  return completedIndices.size;
}

function getLatestTaskCompletionDateKey(exercises, taskType, fallbackDateKey) {
  let latestTime = null;

  (exercises || []).forEach((exercise) => {
    const normalizedType = String(exercise?.taskType || "").toLowerCase();
    const normalizedStatus = String(exercise?.status || "").toLowerCase();

    if (normalizedType !== String(taskType).toLowerCase()) return;
    if (!ACCEPTED_SUBMISSION_STATUSES.has(normalizedStatus)) return;

    const updatedAt = exercise?.updatedAt ? new Date(exercise.updatedAt) : null;
    if (!updatedAt || Number.isNaN(updatedAt.getTime())) return;

    if (latestTime === null || updatedAt.getTime() > latestTime) {
      latestTime = updatedAt.getTime();
    }
  });

  if (latestTime !== null) {
    return toDateKey(new Date(latestTime));
  }

  return fallbackDateKey;
}

export const getAllClient = async (page, limit) => {
  const skip = (page - 1) * limit;
  const totalCount = await User.countDocuments({ role: "user" });
  const clients = await User.find({ role: "user" })
    .skip(skip)
    .limit(limit)
    .select("-password");
  return { clients, totalCount };
};

export const getSingleClient = async (id) => {
  const client = await User.findById(id)
    .select("-password")
    .populate({ path: "programType", populate: { path: "plan" } })
    .populate("therapyType")
    .populate("trainer")
    .populate("dietition")
    .populate("therapist")
    .populate("therapyType");
  return client;
};

export const updateOneClient = async (userData, id) => {
  const client = await User.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true },
  ).select("-password");
  const coaches = [client.Dietician, client.trainer, client.therapist].filter(
    Boolean,
  );
  for (const coachId of coaches) {
    await calculateCoachIncentives(coachId);
  }
  return client;
};

export const deleteOneClient = async (id) => {
  const client = await User.findById(id);
  if (!client) {
    throw new Error("Client not found");
  }

  const coachIds = [client.trainer, client.Dietician, client.therapist].filter(
    Boolean,
  );

  // 1. Remove client from Expert's assignedUsers list
  if (coachIds.length > 0) {
    await CoachModel.updateMany(
      { _id: { $in: coachIds } },
      { $pull: { assignedUsers: id } },
    );
  }

  // 2. Delete habits and task submissions
  await Promise.all([
    HabitModel.deleteMany({ clientId: id }),
    TaskSubmission.deleteMany({ userId: id }),
  ]);

  // 3. Recalculate Expert incentives
  for (const coachId of coachIds) {
    try {
      await calculateCoachIncentives(coachId);
    } catch (error) {
      console.error(
        `Failed to recal incentive for coach ${coachId}:`,
        error.message,
      );
    }
  }

  // 4. Delete the client
  return await User.findByIdAndDelete(id);
};


export const getClientsBasedOnCoach = async (coachIds, page, limit) => {
  const skip = (page - 1) * limit;

  // Ensure coachIds is an array
  const ids = Array.isArray(coachIds) ? coachIds : [coachIds];

  const query = {
    $or: [
      { trainer: { $in: ids } },
      { dietition: { $in: ids } },
      { therapist: { $in: ids } },
    ],
    role: "user",
  };

  const totalCount = await User.countDocuments(query);
  const clients = await User.find(query)
    .skip(skip)
    .limit(limit)
    .select("-password")
    .populate("trainer")
    .populate("dietition")
    .populate("therapist");

  return { clients, totalCount };
};

export const updateWeightService = async (userId, data) => {
  if (!data.currentWeight) {
    throw new Error("Current weight is required");
  }

   if (!data.sidePhoto && !data.frontPhoto) {
     throw new Error("photo is required");
   }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.weightHistory || user.weightHistory.length === 0) {
    user.weightHistory = [
      {
        weight: data.currentWeight,
        frontPhoto: data.frontPhoto,
        sidePhoto: data.sidePhoto,
        date: new Date(),
        isInitial: true,
      },
    ];
  } else {
    user.weightHistory.push({
      weight: data.currentWeight,
      frontPhoto: data.frontPhoto,
      sidePhoto: data.sidePhoto,
      date: new Date(),
      isInitial: false,
    });
  }

  user.currentWeight = data.currentWeight;

  await user.save();

  return user;
};

export const assignDietPlanService = async (userId, dietPlanData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        dietPlanPdf: dietPlanData.dietPlanPdf,
        dietPlanMealCount: dietPlanData.dietPlanMealCount,
      },
    },
    { new: true },
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateMeasurementsService = async (
  userId,
  { chest, waist, hip },
) => {
  const updateFields = {};
  const historyEntry = {};

  if (chest !== undefined) {
    updateFields["measurements.chest"] = chest;
    historyEntry.chest = chest;
  }

  if (waist !== undefined) {
    updateFields["measurements.waist"] = waist;
    historyEntry.waist = waist;
  }

  if (hip !== undefined) {
    updateFields["measurements.hip"] = hip;
    historyEntry.hip = hip;
  }

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No measurements provided");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateFields,
      $push: {
        measurementHistory: {
          ...historyEntry,
          date: new Date(),
        },
      },
    },
    { new: true },
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getAllFeedbacksService = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { "feedback.userId": new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$feedback" },
    { $match: { "feedback.userId": new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        totalCount: [{ $count: "count" }],
        feedbacks: [
          { $sort: { "feedback.createdAt": -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              role: 1,
              feedback: ["$feedback"],
            },
          },
        ],
      },
    },
  ];

  const result = await CoachModel.aggregate(pipeline);

  const feedbacks = result[0].feedbacks;
  const totalCount = result[0].totalCount[0]?.count || 0;

  return { feedbacks, totalCount };
};

export const fetchWeightHistoryService = async (userId) => {
  const user = await User.findById(userId).select(
    "weightHistory currentWeight",
  );

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const sortedHistory = user.weightHistory
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: item.date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      weight: item.weight,
    }));

  return {
    currentWeight: user.currentWeight,
    weightHistory: sortedHistory,
  };
};

export const fetchMeasurementHistory = async (userId) => {
  const user = await User.findById(userId).select("measurementHistory");

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const sortedHistory = user.measurementHistory
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: item.date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      chest: item.chest,
      waist: item.waist,
      hip: item.hip,
    }));

  return {
    measurementHistory: sortedHistory,
  };
};

export const founderClientList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await User.countDocuments();

    const data = await User.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Program =====
      {
        $lookup: {
          from: "programslists",
          localField: "programType",
          foreignField: "_id",
          as: "program",
        },
      },

      // ===== Final Shape =====
      {
        $project: {
          _id: 0,
          _id: "$_id",
          userName: "$name",
          status: "$status",

          programName: {
            $arrayElemAt: ["$program.title", 0],
          },

          durationTaken: "$duration",
          programStartDate: "$programStartDate",
          programEndDate: "$programEndDate",

          // ✅ Coach roles only
          coachRoles: {
            $filter: {
              input: [
                { $cond: [{ $ifNull: ["$trainer", false] }, "Trainer", null] },

                {
                  $cond: [
                    { $ifNull: ["$dietition", false] },
                    "Dietitian",
                    null,
                  ],
                },
                {
                  $cond: [
                    { $ifNull: ["$therapist", false] },
                    "Therapist",
                    null,
                  ],
                },
              ],
              as: "role",
              cond: { $ne: ["$$role", null] },
            },
          },
        },
      },
    ]);

    return {
      data,
      totalCount,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchClientsWithHabitPlan = async () => {
  const clients = await User.find({ role: "user" });

  const clientsWithHabit = await Promise.all(
    clients.map(async (client) => {
      const habit = await HabitModel.findOne({ clientId: client._id });

      return {
        ...client.toObject(),
        hasHabitPlan: Boolean(habit),
        habitId: habit ? habit._id : null,
      };
    }),
  );

  return clientsWithHabit;
};

export const getAdherenceStreaksService = async (userId) => {
  const user = await getSingleClient(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const currentGlobalDay = Math.max(1, Number(user.currentGlobalDay) || 1);
  const programPlan = user?.programType?.plan;
  const programTitle = String(user?.programType?.title || "").toLowerCase();

  const isWeightLoss = programTitle.includes("weight loss");
  const defaultMealCount = isWeightLoss ? 4 : 5;
  const mealCountPerDay = toPositiveInt(
    user?.dietPlanMealCount,
    defaultMealCount,
  );

  const planDayMap = new Map();
  (programPlan?.weeks || []).forEach((week, weekIndex) => {
    (week.days || []).forEach((day, dayIndex) => {
      const globalDayIndex = weekIndex * 7 + dayIndex + 1;
      planDayMap.set(globalDayIndex, day || {});
    });
  });

  const taskSubmissionDoc = await TaskSubmission.findOne({ userId }).select(
    "dailySubmissions.globalDayIndex dailySubmissions.waterIntakeMl dailySubmissions.exercises dailySubmissions.waterIntakeUpdatedAt",
  );

  const submissionsByDay = new Map(
    (taskSubmissionDoc?.dailySubmissions || []).map((day) => [
      Number(day.globalDayIndex),
      day,
    ]),
  );

  const completedWorkoutDays = [];
  const completedDietDays = [];
  const completedWaterDays = [];
  const startDate = user?.programStartDate
    ? new Date(user.programStartDate)
    : null;

  if (startDate && !Number.isNaN(startDate.getTime())) {
    startDate.setHours(0, 0, 0, 0);
  }

  for (let dayIndex = 1; dayIndex <= currentGlobalDay; dayIndex += 1) {
    const dayPlan = planDayMap.get(dayIndex) || {};
    const daySubmission = submissionsByDay.get(dayIndex);
    const exercises = daySubmission?.exercises || [];
    const fallbackDateKey =
      startDate && !Number.isNaN(startDate.getTime())
        ? toDateKey(addDays(startDate, dayIndex - 1))
        : "";

    const expectedWorkoutCount = (dayPlan.exercises || []).filter(
      (exercise) => !exercise?.type || exercise.type === "Workout",
    ).length;

    const workoutDoneCount = countCompletedTasksByType(exercises, "Workout");

    if (expectedWorkoutCount > 0 && workoutDoneCount >= expectedWorkoutCount) {
      completedWorkoutDays.push(
        getLatestTaskCompletionDateKey(exercises, "Workout", fallbackDateKey),
      );
    }

    const mealDoneCount = countCompletedTasksByType(exercises, "Meal");

    if (mealCountPerDay > 0 && mealDoneCount >= 1) {
      completedDietDays.push(
        getLatestTaskCompletionDateKey(exercises, "Meal", fallbackDateKey),
      );
    }

    const waterIntakeMl = Number(daySubmission?.waterIntakeMl || 0);
    if (waterIntakeMl > 100) {
      const waterUpdatedAt = daySubmission?.waterIntakeUpdatedAt
        ? toDateKey(daySubmission.waterIntakeUpdatedAt)
        : "";
      completedWaterDays.push(waterUpdatedAt || fallbackDateKey);
    }
  }

  const habitDoc = await HabitModel.findOne({ clientId: userId }).select(
    "habits.logs",
  );
  const habitList = habitDoc?.habits || [];
  const completedHabitDateKeys = getCompletedHabitDateKeys(habitList);

  return {
    workout: calculateStreakFromDateKeys(completedWorkoutDays),
    diet: calculateStreakFromDateKeys(completedDietDays),
    water: calculateStreakFromDateKeys(completedWaterDays),
    habit: calculateStreakFromDateKeys(completedHabitDateKeys),
  };
};

export const submitWeeklyCheckIn = async (userId, weekIndex, responses) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if check-in for this week already exists
  const existingCheckIn = user.weeklyCheckIns.find(
    (ci) => ci.weekIndex === Number(weekIndex)
  );
  if (existingCheckIn) {
    throw new Error(`Check-in for week ${weekIndex} already exists`);
  }

  user.weeklyCheckIns.push({
    weekIndex: Number(weekIndex),
    responses: responses.map((r) => ({
      rating: Number(r.rating),
      description: r.description,
    })),
    date: new Date(),
  });

  await user.save();
  return user.weeklyCheckIns;
};

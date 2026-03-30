import { SOP } from "./sop.model.js";
import { SOPLog } from "./sopLog.model.js";
import mongoose from "mongoose";

// Assign SOP (Admin)

export const assignSOP = async (data) => {
  return await SOP.create(data);
};

// Update SOP (Admin)

export const updateSOP = async (id, updatedData) => {
  return await SOP.findByIdAndUpdate(id, updatedData, { new: true });
};

// Deactivate SOP (Admin)

export const deactivate = async (id) => {
   const data = await SOP.updateOne({ _id: id }, { status: "Inactive" }, { new: true });
   return data
};

// Get Today’s SOP Tasks (Coach)

export const getTodaySOP = async (coachId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sops = await SOP.find({
    coachId,
    status: "Active",
  });
  const tasks = [];

  for (let sop of sops) {
    let log = await SOPLog.findOne({
      sopId: sop._id,
      coachId,
      date: today,
    });

    // If no log exists for today → create one
    if (!log) {
      log = await SOPLog.create({
        sopId: sop._id,
        coachId,
        date: today,
      });
    }

    tasks.push({
      sopId: sop._id,
      title: sop.title,
      description: sop.description,
      timeSlot: sop.timeSlot,
      completed: log.completed,
    });
  }

  return tasks;
};

// cron SOP daily update

export const startSOPDailyJob = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sops = await SOP.find({ status: "Active" });

  for (const sop of sops) {
    const exists = await SOPLog.findOne({
      sopId: sop._id,
      coachId: sop.coachId,
      date: today,
    });

    if (!exists) {
      await SOPLog.create({
        sopId: sop._id,
        coachId: sop.coachId,
        date: today,
      });
    }
  }
};

// Complete SOP Task (Coach)

export const completeSOP = async (sopId, coachId, completed) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await SOPLog.findOneAndUpdate(
    { sopId, coachId, date: today },
    {
      completed,
      completedAt: completed ? new Date() : null,
    },
    { new: true },
  );
};

// Get SOP Completion History (Admin)

export const getSOPHistory = async (coachId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return await SOPLog.find({
    coachId,
    date: { $gte: startDate, $lt: endDate },
  }).populate("sopId");
};

// get SOP by id

export const getSOPById = async (SOPId) => {
  return await SOP.findById(SOPId);
};

// get SOP by coach

export const getSOPByCoach = async (coachId) => {
  try {
    const sops = await SOP.find({
      coachId,
      status: "Active",
    });
    return sops;
  } catch (error) {
    throw new Error("Failed to fetch SOPs for coach");
  }
};

// get SOP state (Admin)

export const getSOPStats = async (coachId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const stats = await SOPLog.aggregate([
    {
      $match: {
        coachId: new mongoose.Types.ObjectId(coachId),
        date: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: "$date",
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: ["$completed", 1, 0] },
        },
      },
    },
    {
      $addFields: {
        pending: { $subtract: ["$total", "$completed"] },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return stats;
};


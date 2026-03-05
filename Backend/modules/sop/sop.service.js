import { SOP } from "./sop.model.js";
import { SOPLog } from "./sopLog.model.js";
import mongoose from "mongoose";


//  1️⃣ Assign SOP (Admin)

export const assignSOP = async (data) => {
  return await SOP.create(data);
};

//  2️⃣ Update SOP (Admin)

export const updateSOP = async (id, updatedData) => {
  return await SOP.findByIdAndUpdate(id, updatedData, { new: true });
};

//  3️⃣ Delete SOP (Admin)

export const deleteSOP = async (id) => {
  return await SOP.findByIdAndDelete(id);
};


//  4️⃣ Get Today’s SOP Tasks (Coach)

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


//  5️⃣ Complete SOP Task (Coach)

export const completeSOP = async (sopId, coachId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await SOPLog.findOneAndUpdate(
    { sopId, coachId, date: today },
    {
      completed: true,
      completedAt: new Date(),
    },
    { new: true },
  );
};


//  6️⃣ Get SOP Completion History (Admin)

export const getSOPHistory = async (coachId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return await SOPLog.find({
    coachId,
    date: { $gte: startDate, $lt: endDate },
  }).populate("sopId");
};

export const getSOPById = async (SOPId)=> {
  return await SOP.findById(SOPId)
}

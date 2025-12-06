 import { WorkoutLog } from "../../models/workout/workOutLog.js";
// import { WorkoutPlan } from "../models/WorkoutPlan.js";

export const logWorkout = async (req, res) => {
  await WorkoutLog.create(req.body);
  res.json({ success: true, message: "Workout logged successfully." });
};

export const getLogs = async (req, res) => {
  const logs = await WorkoutLog.find({ userId: req.params.userId });

  res.json({ success: true, data: logs });
};

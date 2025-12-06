// import mongoose from "mongoose";

// const exerciseSchema = new mongoose.Schema({
//   name: String,
//   sets: Number,
//   reps: Number,
//   rest: String,
// });

// const daySchema = new mongoose.Schema({
//   day: String,
//   exercises: [exerciseSchema],
// });

// const planSchema = new mongoose.Schema({
//   name: String,
//   goal: String,
//   difficulty: String,
//   durationWeeks: Number,
//   schedule: [daySchema],
//   createdBy: String,
//   isCustom: Boolean,
//   createdAt: { type: Date, default: Date.now },
// });

// export const WorkoutPlan =
//   mongoose.models.WorkoutPlan || mongoose.model("WorkoutPlan", planSchema);


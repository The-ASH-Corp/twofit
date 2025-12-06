import mongoose from "mongoose";

const completedExerciseSchema = new mongoose.Schema({
  name: String,
  setsCompleted: Number,
  repsCompleted: Number,
});

const logSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  planId: mongoose.Schema.Types.ObjectId,
  date: Date,
  completedExercises: [completedExerciseSchema],
});

export const WorkoutLog = mongoose.model("WorkoutLog", logSchema);

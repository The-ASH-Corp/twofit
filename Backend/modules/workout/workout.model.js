import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name:{ type: String },
  sets: { type: Number },
  reps: { type: Number },
  rest: { type: String },

});
const therapyPlanSchema = new mongoose.Schema({
  therapyType:{ type: String },
  url: { type: String },
  notes: { type: String },
  photo: { type: String },
})

const dietPlanSchema = new mongoose.Schema({
  breakFast: [
    {
      breakFast: { type: String },
      url: { type: String },
      notes: { type: String },
      photo: { type: String },
    },
  ],
  lunch: [
    {
      lunch: { type: String },
      url: { type: String },
      notes: { type: String },
      photo: { type: String },
    },
  ],
  snack: [
    {
      snack: { type: String },
      url: { type: String },
      notes: { type: String },
      photo: { type: String },
    },
  ],
  dinner: [
    {
      dinner: { type: String },
      url: { type: String },
      notes: { type: String },
      photo: { type: String },
    },
  ],
});

const daySchema = new mongoose.Schema({
  day: String,
  exercises: [exerciseSchema],
  dietPlan: [dietPlanSchema],
  therapyPlan: [therapyPlanSchema],
});


const weekSchema = new mongoose.Schema({
  week: { type: Number },
  days: [daySchema],
});


const workoutSchema = new mongoose.Schema({
  name:{type:String},
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"
  },
  duration: { type: Number }, // duration in weeks
  weeklySchedule: [weekSchema],
})

export const WorkoutPlan = mongoose.model("WorkoutPlan", workoutSchema);
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

const assignedSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  planId: mongoose.Schema.Types.ObjectId,
  startDate: Date,
  currentWeek: {
    type: Number,
    default: 1,
  },
});

export const AssignedPlan = mongoose.model("AssignedPlan", assignedSchema);

import mongoose from "mongoose";

const therapyPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notes: String,
  url: String,
  mediaName: String,
});

const daySchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  therapies: [therapyPlanSchema],
});

const weekSchema = new mongoose.Schema({
  name: { type: String, required: true },
  days: [daySchema],
});

const therapySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    duration: { type: String, required: true }, 
    weeks: [weekSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Therapy", therapySchema);

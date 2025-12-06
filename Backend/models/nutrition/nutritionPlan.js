import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: String,
  calories: Number,
  protein: Number,
});

const mealSchema = new mongoose.Schema({
  mealType: String,
  items: [itemSchema],
});

const daySchema = new mongoose.Schema({
  day: String,
  meals: [mealSchema],
});

const nutritionPlanSchema = new mongoose.Schema({
  name: String,
  goal: String,
  durationWeeks: Number,
  schedule: [daySchema],
  createdBy: String,
  isCustom: Boolean,
  createdAt: { type: Date, default: Date.now },
});

export const NutritionPlan =
  mongoose.models.NutritionPlan ||
  mongoose.model("NutritionPlan", nutritionPlanSchema);

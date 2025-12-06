import mongoose from "mongoose";

const logItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein: Number,
});

const mealSchema = new mongoose.Schema({
  mealType: String,
  items: [logItemSchema],
});

const nutritionLogSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: Date,
  meals: [mealSchema],
  totalCalories: Number,
  totalProtein: Number,
});

export const NutritionLog =
  mongoose.models.NutritionLog ||
  mongoose.model("NutritionLog", nutritionLogSchema);

import { NutritionLog } from "../../models/nutrition/nutritionLog.js";

export const logMeal = async (req, res) => {
  const { meals } = req.body;

  let totalCalories = 0;
  let totalProtein = 0;

  meals.forEach(meal => {
    meal.items.forEach(item => {
      totalCalories += item.calories;
      totalProtein += item.protein;
    });
  });

  await NutritionLog.create({
    ...req.body,
    totalCalories,
    totalProtein,
  });

  res.json({
    success: true,
    message: "Meal log recorded successfully.",
  });
};

export const getNutritionLogs = async (req, res) => {
  const logs = await NutritionLog.find({ userId: req.params.userId });
  res.json({ success: true, data: logs });
};

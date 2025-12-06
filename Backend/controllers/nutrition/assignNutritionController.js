import { AssignedNutrition } from  '../../models/nutrition/assignedNutritionPlan.js';
import { NutritionPlan } from "../../models/nutrition/nutritionPlan.js";

export const assignDietPlan = async (req, res) => {
  const { userId, planId, startDate } = req.body;

  const plan = await NutritionPlan.findById(planId);
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  await AssignedNutrition.create({
    userId,
    planId,
    startDate,
  });

  res.json({
    success: true,
    message: "Diet plan assigned successfully to user.",
  });
};

export const getUserActiveDietPlan = async (req, res) => {
  const assigned = await AssignedNutrition.findOne({
    userId: req.params.userId,
  });

  if (!assigned)
    return res.status(404).json({ message: "User has no active diet plan" });

  res.json({
    success: true,
    data: {
      planId: assigned.planId,
      currentWeek: assigned.currentWeek,
    },
  });
};

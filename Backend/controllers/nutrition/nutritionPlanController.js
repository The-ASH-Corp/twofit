import { NutritionPlan } from "../../models/nutrition/nutritionPlan.js";

export const getDietPlans = async (req, res) => {
  const plans = await NutritionPlan.find();
  res.json({ success: true, data: plans });
};

export const getSingleDietPlan = async (req, res) => {
  const plan = await NutritionPlan.findById(req.params.planId);
  if (!plan) return res.status(404).json({ message: "Diet plan not found" });

  res.json({ success: true, data: plan });
};

export const createDietPlan = async (req, res) => {
  console.log("REQ BODY:", req.body);

  const newPlan = await NutritionPlan.create({
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: "Diet plan created successfully.",
    planId: newPlan._id,
  });
};

export const updateDietPlan = async (req, res) => {
  await NutritionPlan.findByIdAndUpdate(req.params.planId, req.body);
  res.json({ success: true, message: "Diet plan updated successfully." });
};

export const deleteDietPlan = async (req, res) => {
  await NutritionPlan.findByIdAndDelete(req.params.planId);
  res.json({ success: true, message: "Diet plan deleted successfully." });
};

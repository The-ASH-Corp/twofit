// import { WorkoutPlan } from '../../models/workout/WorkoutPlan.js'

// export const getPlans = async (req, res) => {
//   const plans = await WorkoutPlan.find();
//   res.json({ success: true, data: plans });
// };

// export const getSinglePlan = async (req, res) => {
//   const plan = await WorkoutPlan.findById(req.params.planId);
//   if (!plan) return res.status(404).json({ message: "Plan not found" });

//   res.json({ success: true, data: plan });
// };

// export const createPlan = async (req, res) => {
//      console.log("REQ BODY:", req.body);
//   const newPlan = await WorkoutPlan.create({
//     ...req.body,
//     // createdBy: req.user.role,
//     // isCustom: req.user.role === "coach",
//   });

//   res.status(201).json({
//     success: true,
//     message: "Workout plan created successfully.",
//     plan: newPlan,
//   });
// };

// export const updatePlan = async (req, res) => {
//   await WorkoutPlan.findByIdAndUpdate(req.params.planId, req.body);
//   res.json({ success: true, message: "Workout plan updated successfully." });
// };

// export const deletePlan = async (req, res) => {
//   await WorkoutPlan.findByIdAndDelete(req.params.planId);
//   res.json({ success: true, message: "Workout plan deleted successfully." });
// };

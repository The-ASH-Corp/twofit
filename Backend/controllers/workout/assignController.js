// import { AssignedPlan } from "../../modules/workout/workout.model.js";
//  import { WorkoutPlan } from "../../modules/workout/workout.model.js";
 

// export const assignPlan = async (req, res) => {
//   const { userId, planId, startDate } = req.body;

//   const plan = await WorkoutPlan.findById(planId);
//   if (!plan) return res.status(404).json({ message: "Plan not found" });

//   await AssignedPlan.create({
//     userId,
//     planId,
//     startDate,
//   });

//   res.json({
//     success: true,
//     message: "Workout plan assigned successfully to user.",
//   });
// };

// export const getUserActivePlan = async (req, res) => {
//   const assigned = await AssignedPlan.findOne({ userId: req.params.userId });

//   if (!assigned)
//     return res.status(404).json({ message: "User has no active plan" });

//   const plan = await WorkoutPlan.findById(assigned.planId);

//   res.json({
//     success: true,
//     data: {
//       currentWeek: assigned.currentWeek,
//       startDate: assigned.startDate,
//       plan: plan
//     },
//   });

 
// };

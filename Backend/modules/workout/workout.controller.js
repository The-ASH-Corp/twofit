import * as workoutService from "./workout.service.js"
import { AssignedPlan } from "./workout.model.js";
import { WorkoutPlan } from "./workout.model.js";

import mongoose from "mongoose";


export const getPlans = async (req, res) => {
  try {
    const{page,limit} = req.params
    const plans = await workoutService.getPlans(page,limit);
    res.json({ success: true, data: plans });
  } catch (error) {
     res.status(400).json({ success: false, message: err.message });
  }
};

export const getSinglePlan = async (req, res) => {

   try {
     if (!mongoose.Types.ObjectId.isValid(req.params.planId)) {
       return res.status(400).json({
         success: false,
         message: "Invalid plan ID",
       });
     }

     const plan = await workoutService.getSinglePlan(req.params.planId);
     if (!plan) return res.status(404).json({ message: "Plan not found" });

     res.json({ success: true, data: plan });
   } catch (error) {
    res.status(400).json({ success: false, message: err.message });
   }
};

export const createPlan = async (req, res) => {
  try {
    const plan = {
      ...req.body,
      // createdBy: req.user.role,
      // isCustom: req.user.role === "coach",
    };
    const newPlan = await workoutService.createPlan(plan);

    res.status(201).json({
      success: true,
      message: "Workout plan created successfully.",
      plan: newPlan,
    });
  } catch (error) {
     res.status(400).json({ success: false, message: err.message });
  }
};

export const updatePlan = async (req, res) => {

   try {
     if (!mongoose.Types.ObjectId.isValid(req.params.planId)) {
       return res.status(400).json({
         success: false,
         message: "Invalid plan ID",
       });
     }

     await workoutService.updatePlan(req.params.planId, req.body);
     res.json({ success: true, message: "Workout plan updated successfully." });
   } catch (error) {
     res.status(400).json({ success: false, message: err.message });
   }
};

export const deletePlan = async (req, res) => {

    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.planId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan ID",
        });
      }

      await workoutService.deletePlan(req.params.planId);
      res.json({
        success: true,
        message: "Workout plan deleted successfully.",
      });
    } catch (error) {
       res.status(400).json({ success: false, message: err.message });
    }
};

export const assignPlan = async (req, res) => {
  const { userId, planId, startDate } = req.body;

  const plan = await WorkoutPlan.findById(planId);
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  const data = {
    userId,
    planId,
    startDate,
  };

  await workoutService.assignPlan(data)

  res.json({
    success: true,
    message: "Workout plan assigned successfully to user.",
  });
};

export const getUserActivePlan = async (req, res) => {
  const assigned = await AssignedPlan.findOne({ userId: req.params.userId });

  if (!assigned)
    return res.status(404).json({ message: "User has no active plan" });

  const plan = await WorkoutPlan.findById(assigned.planId);

  res.json({
    success: true,
    data: {
      currentWeek: assigned.currentWeek,
      startDate: assigned.startDate,
      plan: plan
    },
  });

 
};


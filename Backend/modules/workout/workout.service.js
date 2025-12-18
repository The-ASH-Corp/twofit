import { WorkoutPlan } from "./workout.model.js";
import { AssignedPlan } from "./workout.model.js";


export const getPlans = async (page,limit)=> {
    return await WorkoutPlan.find().skip((page-1)*limit).limit(limit);
};

export const getSinglePlan = async (planId) => {
    return await WorkoutPlan.findById(planId);
};

export const createPlan = async (plan) => {
    return await WorkoutPlan.create(plan);
};

export const updatePlan = async (planId, updatedData)=> {
    return await WorkoutPlan.findByIdAndUpdate({_id: planId}, {$set: updatedData});
};

export const deletePlan = async (planId)=> {
    return await WorkoutPlan.findByIdAndDelete(planId);
};

export const assignPlan = async (plan)=> {
    return await AssignedPlan.create(plan);
}
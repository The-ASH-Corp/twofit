import Plan from "./plan.model.js";

export const createPlan = async (planData) => {
    const newPlan = await Plan.create(planData);
    return  { success: true, message: "Plan created successfully", data: newPlan };
}


export const getPlanById = async (planId) => {
    const plan = await Plan.findById(planId);
    return plan;
}
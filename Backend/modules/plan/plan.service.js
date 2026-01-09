import Plan from "./plan.model.js";

export const createPlan = async (planData) => {
    const newPlan = await Plan.create(planData);
    return newPlan;
}
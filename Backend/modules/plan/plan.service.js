import ProgramModel from "../allPrograms/allPrograma.model.js";
import Plan from "./plan.model.js";

export const createPlan = async (planData) => {
    const newPlan = await Plan.create(planData);

   await ProgramModel.findByIdAndUpdate(planData.program, { plan: newPlan._id });
    return  newPlan;
}


export const getPlanById = async (planId) => {
    const plan = await Plan.findById(planId);
    return plan;
}


export const getPlanByProgramId = async (programId) => {    
    const plan = await Plan.findOne({ program: programId });
    return plan;
}
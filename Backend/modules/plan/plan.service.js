import ProgramModel from "../allPrograms/allPrograma.model.js";
import User from "../auth/auth.model.js";
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
    const clients = await User.find({ programType: programId }).select("name email");
    return {...plan.toObject(), clients};
}
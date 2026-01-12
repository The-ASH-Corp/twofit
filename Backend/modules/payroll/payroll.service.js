import { PayrollModel } from "./payroll.model.js";

export const createPayroll = async (payroll) => {
    return await PayrollModel.findByIdAndUpdate(
      "6960c69c6b7d7ca635decb87",
      {
        rating1: payroll.rating1,
        rating2: payroll.rating2,
        rating3: payroll.rating3,
        extraClient: payroll.extraClient,
        extendProgram30days: payroll.extendProgram30days,
        extendProgram60days: payroll.extendProgram60days,
        extendProgram90days: payroll.extendProgram90days,
        targetAchieved: payroll.targetAchieved,
      },
      { new: true }
    );
}

export const getPayroll = async ()=> {
  return await PayrollModel.findById("6960c69c6b7d7ca635decb87");
}
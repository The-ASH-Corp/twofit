import { PayrollModel } from "./payroll.model";

export const createPayroll = async (payroll) => {
    await PayrollModel.create({
      rating1: payroll.rating1,
      rating2: payroll.rating2,
      rating3: payroll.rating3,
      extraClient: payroll.extraClient,
      extendProgram30days: payroll.extendProgram30days,
      extendProgram60days: payroll.extendProgram60days,
      extendProgram90days: payroll.extendProgram90days,
      targetAchieved: payroll.targetAchieved,
    });
}
import { CoachModel } from "../coach/coach.model.js";
import { PayrollModel } from "./payroll.model.js";

// helper: incentive slab logic
const getRatingIncentive = (avgRating, payroll) => {
  if (!payroll) return 0;

  if (avgRating >= 4.0 && avgRating <= 4.4) return payroll.rating1;
  if (avgRating >= 4.5 && avgRating <= 4.7) return payroll.rating2;
  if (avgRating >= 4.8 && avgRating <= 5.0) return payroll.rating3;

  return 0;
};

export const updatePayroll = async (payroll) => {
  // 1️⃣ Update payroll slab
  const updatedPayroll = await PayrollModel.findOneAndUpdate(
    { id: "6960c69c6b7d7ca635decb87" },
    {
      $set: {
        rating1: payroll.rating1,
        rating2: payroll.rating2,
        rating3: payroll.rating3,
        extraClient: payroll.extraClient,
        extendProgram30days: payroll.extendProgram30days,
        extendProgram60days: payroll.extendProgram60days,
        extendProgram90days: payroll.extendProgram90days,
        targetAchieved: payroll.targetAchieved,
      },
    },
    { new: true, upsert: true }
  );

  // 2️⃣ Recalculate incentives for all eligible coaches
  const coaches = await CoachModel.find().select(
    "_id avgRating"
  );

  for (const coach of coaches) {
    const incentive = getRatingIncentive(coach.avgRating || 0, updatedPayroll);

    await CoachModel.findByIdAndUpdate(coach._id, {
      incentives: incentive,
    });
  }

  return updatedPayroll;
};

export const getPayroll = async () => {
  return await PayrollModel.findOne({ id: "6960c69c6b7d7ca635decb87" });
};

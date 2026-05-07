import { AdjustmentModel } from "./adjustment.model.js";

// Create Bonus / Deduction
export const createAdjustment = async (data) => {
  return await AdjustmentModel.create(data);
};

// Get adjustments
export const getAdjustments = async (month, year) => {
  return await AdjustmentModel.find({ month, year }).lean();
};

import mongoose from "mongoose";

const incentiveSchema = new mongoose.Schema({
  rating1: { type: Number, default: 0 },
  rating2: { type: Number, default: 0 },
  rating3: { type: Number, default: 0 },
  extraClient: { type: Number, default: 0 },
  extendProgram30days: { type: Number, default: 0 },
  extendProgram60days: { type: Number, default: 0 },
  extendProgram90days: { type: Number, default: 0 },
  targetAchieved: { type: Number, default: 0 },
});

export const IncentiveModel = mongoose.model("incentive", incentiveSchema);

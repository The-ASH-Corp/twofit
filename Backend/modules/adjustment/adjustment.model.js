import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "employeeType",
    },

    employeeType: {
      type: String,
      enum: ["Head", "Admin", "Coach"],
    },

    type: {
      type: String,
      enum: ["BONUS", "DEDUCTION"],
      required: true,
    },

    amount: { type: Number, required: true },

    reason: { type: String },

    scope: {
      type: String,
      enum: ["INDIVIDUAL", "ALL"],
      default: "INDIVIDUAL",
    },

    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true },
);

export const AdjustmentModel = mongoose.model("Adjustment", adjustmentSchema);

import mongoose from "mongoose";

const sopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Admin who assigned the task
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    // Coach who must follow the task
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },

    frequency: {
      type: String,
      enum: ["Daily"],
      default: "Daily",
    },

    timeSlot: {
      type: String,
      enum: ["Morning", "Lunch", "Evening", "Night"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Optional useful index for faster querying
sopSchema.index({ coachId: 1, status: 1 });

export const SOP = mongoose.model("SOP", sopSchema);

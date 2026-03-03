import mongoose from "mongoose";

const sopLogSchema = new mongoose.Schema(
  {
    sopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SOP",
      required: true,
    },

    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Prevent duplicate log for same task on same day
sopLogSchema.index({ sopId: 1, coachId: 1, date: 1 }, { unique: true });

export const SOPLog = mongoose.model("SOPLog", sopLogSchema);

import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["meal", "workout", "therapy"],
      required: true,
      unique: true,
    },
    title: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    settings: [
      {
        label: String,
        time: String,
      },
    ],

    message: {
      type: String,
    },

    templateName: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Reminder = mongoose.model("Reminder", reminderSchema);

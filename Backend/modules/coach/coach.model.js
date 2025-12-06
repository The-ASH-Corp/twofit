import mongoose from "mongoose";

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  specialization: { type: String },
  experience: { type: String },
  bio: { type: String },
  image: { type: String },
  assignedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const CoachModel = mongoose.model("Coach", coachSchema);

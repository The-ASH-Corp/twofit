import mongoose from "mongoose";

const healthConcernSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,  
    required: true,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  status: {
    type: String,
    enum: ["Improved", "Decreased", "Reversed"],
    default: "Improved",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("HealthConcern", healthConcernSchema);

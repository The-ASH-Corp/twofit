import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
  specialization: {
    type:Array,
    required: true,
  },
  program: 
    { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  salary: { type: Number, default: 0 },
  role: { type: String, default: "admin" },
  autoSendWelcome: { type: Boolean, default: false },
  autoSendGuide: { type: Boolean, default: false },
  automatedReminder: { type: Boolean, default: false },
});

export const AdminModel = mongoose.model("Admin", adminSchema);

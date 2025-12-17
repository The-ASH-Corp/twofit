import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    dob: { type: String, required: true },

    gender: { type: String, enum: ["male", "female", "other"] },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: { type: Number, required: true },

    password: { type: String, required: true },

    address: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin", "coach"],
      default: "user",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    currentWeight: { type: Number, required: true },

    targetWeight: { type: Number, required: true },

    medicalConditions: { type: Array, required: true },

    allergies: { type: Array, required: true },

    goals: { type: String },

    foodPreferances: { type: String, required: true },

    profileImage: { type: String },

    programType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramType",
      required: true,
    },

    duration: { type: Number, required:true},

    programStartDate: { type: Date, required: true },

    programEndDate: { type: Date, required: true },

    dietition:{type:mongoose.Schema.Types.ObjectId, required:true},

    trainer:{type:mongoose.Schema.Types.ObjectId,required:true},

    therapist:{type:mongoose.Schema.Types.ObjectId,required:true},
    
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
     email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

     role: {
      type: String,
      enum: ["user", "admin", "coach"],
      default: "user",
    },

     status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // USER PROFILE DETAILS (Clients update these)
    name: { type: String },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    height: { type: Number },
    weight: { type: Number },
    goals: { type: String },
    profileImage: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

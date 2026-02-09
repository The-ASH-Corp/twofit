import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const founderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },

    password: { type: String, required: true },

    role: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone: { type: String },
    address: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true, strict: false },
);

export const FounderModel = mongoose.model("Founder", founderSchema);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log(" Database connected");

    const email = "founder@twofit.com";
    const password = "Founder@2025";

    const existing = await FounderModel.findOne({ email });

    if (existing) {
      console.log(" Admin already exists. Skipping seed.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const adminUser = await FounderModel.create({
      name: "Founder",
      email,
      password: hashedPassword,
      role: "founder",
      status: "Active",
    });

    console.log(" Admin created successfully!");
    console.log("Login with:");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (err) {
    console.log("Seed failed:", err);
    process.exit(1);
  }
};

// seedAdmin();

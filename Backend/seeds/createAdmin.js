import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from '../models/authModel.js'

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log(" Database connected");

    const email = "admin@twofit.com";
    const password = "Admin@2025";

    const existing = await User.findOne({ email });

    if (existing) {
      console.log(" Admin already exists. Skipping seed.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const adminUser = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
      active: true,
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

seedAdmin();

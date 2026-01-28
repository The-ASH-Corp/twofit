import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      //   enum: ["Weight Management", "Disease Management"],
      unique: true,
    },
    programLimit: { type: Number, required: true },
    status: { type: String, default: "Published" },
  },
  { timestamps: true },
);
export const categoryModel = mongoose.model("Category", categorySchema);

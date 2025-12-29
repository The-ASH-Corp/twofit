import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    //   enum: ["Weight Management", "Disease Management"],
      unique: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Category", categorySchema);

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    //   enum: ["Weight Management", "Disease Management"],
      unique: true,
    },
    programLimit: { type: Number, required: true}
  },
  { timestamps: true }
);
export default mongoose.model("Category", categorySchema);

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    //   enum: ["Weight Management", "Disease Management"],
      unique: true,
    },
    programLimit: { type: Number, require: true}
  },
  { timestamps: true }
);
export default mongoose.model("Category", categorySchema);

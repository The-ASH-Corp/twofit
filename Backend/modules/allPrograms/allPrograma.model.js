import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    whatYouGet: [
      {
        type: String,
        required: true,
      },
    ],
    photo: {
      type: String,
      required: false,
    },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Program", programSchema);

import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image:{
      type:String,
      required:true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    duration: {
      type: [Number],
      required: true,
    },

    // template: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Template",
    //   required: true,
    // },
    status:{
      type:String,
      enum:["Draft","Published"],
      default:"draft"
    }
  },
  

  {
    timestamps: true,
  }
);

export default mongoose.model("ProgramsList", programSchema);

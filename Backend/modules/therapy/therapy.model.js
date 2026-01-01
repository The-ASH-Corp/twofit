import mongoose from "mongoose";

const therapySchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: String, required: true},
  attachment: {type: String, required: true},
  media: {type: String, },
});

export const TherapyModel = mongoose.model("Therapy", therapySchema)
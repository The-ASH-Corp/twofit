import mongoose from 'mongoose';

const headsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  specialization: { type: Array, required: true },
  experience: { type: String, required: true },
  qualification: { type: String, required: true },
  programCategory: { type: mongoose.Schema.Types.ObjectId, ref: "ProgramsList", required: true },
  salary: { type: String, required: true },
  password: { type: String, required: true },
  role:{type:String,enum:["head"],default:"head"},
  status:{type:String,enum:["Active","Inactive"],default:"Active"}
});

export const HeadsModel = mongoose.model('Heads', headsSchema);
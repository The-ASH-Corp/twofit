import mongoose from 'mongoose';

const headsSchema = new mongoose.Schema({
    name: { type: String, required: true},
    dob: { type: String, required: true},
    gender: { type: String, enum: ["male", "female", "other"], required: true},
    email: { type: String, required: true, unique: true, trim: true},
    phone: { type: String, required: true, unique: true},
    password: { type: String, required: true},
});

export const HeadsModel = mongoose.model('Heads', headsSchema);
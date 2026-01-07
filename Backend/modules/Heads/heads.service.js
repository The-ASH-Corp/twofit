import { generatePassword, hashPassword } from "../../utils/password.js";
import { AdminModel } from "../admin/admin.model.js";
import allProgramaModel from "../allPrograms/allPrograma.model.js";
import User from "../auth/auth.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "./heads.modal.js";

export const createHead = async (head) => {
  let hashedPassword;

  if (head.password) {
    console.log(head.password);
    hashedPassword = await hashPassword(head.password);
  } else {
    const newPassword = generatePassword();
    console.log("Generated Password for head:", newPassword);
    hashedPassword = await hashPassword(newPassword);
  }

  return await HeadsModel.create({
    name: head.name,
    dob: head.dob,
    gender: head.gender,
    email: head.email,
    phone: head.phone,
    password: hashedPassword,
    address: head.address,
    specialization: head.specialization,
    experience: head.experience,
    qualification: head.qualification,
    programCategory: head.programCategory,
    salary: head.salary,
  });
};

export const getAllHeads = async (page, limit) => {
  const skip = (page - 1) * limit;

  return await HeadsModel.find().skip(skip).limit(limit);
};

export const getHeadById = async (id) => {
  return await HeadsModel.findById(id);
};

export const updateHead = async (id, updatedData) => {
  return await HeadsModel.findByIdAndUpdate(id, updatedData);
};

export const deleteHead = async (id) => {
  return await HeadsModel.findByIdAndDelete(id);
};

export const getDashboardData = async () => {
  const totalClients = await User.countDocuments({ role: "user" });
  const totalPrograms = await allProgramaModel.countDocuments();
  const totalAdmins = await AdminModel.countDocuments();
  const totalExperts = await CoachModel.countDocuments();
  const totalTrainers = await CoachModel.countDocuments({ role: "Trainer" });
  const totalDietitians = await CoachModel.countDocuments({ role: "Dietician" });
  const totalTherapists = await CoachModel.countDocuments({ role: "Therapist" });

  return {
    totalClients,
    totalPrograms,
    totalAdmins,
    totalExperts,
    totalTrainers,
    totalDietitians,
    totalTherapists,
  };
};

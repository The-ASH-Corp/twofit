import { generatePassword, hashPassword } from "../../utils/password.js";
import allProgramaModel from "../allPrograms/allPrograma.model.js";
import User from "../auth/auth.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { AdminModel } from "./admin.model.js";

export const getAllAdmins = async (page, limit) => {
  const skip = (page - 1) * limit;
  const totalCount = await AdminModel.countDocuments();
  const admins = await AdminModel.find()
    .skip(skip)
    .limit(limit)
    .select("-password");

  const updated = admins.map((admin) => {
    const obj = admin.toObject();

    obj.experts = admin.experts ? admin.experts.length : 0;
    return obj;
  });

  return {
    updated,
    totalCount,
  };
};

export const addNewAdmin = async (adminData) => {
  if (adminData.password) {
    adminData.password = await hashPassword(adminData.password);
  } else {
    const password = generatePassword();
    console.log(password);
    adminData.password = await hashPassword(password);
  }

  const newAdmin = await AdminModel.create({
    name: adminData.fullname,
    email: adminData.email,
    phone: adminData.phone,
    address: adminData.address,
    password: adminData.password,
    dob: adminData.dob,
    gender: adminData.gender,
    specialization: adminData.specialization,
    program: adminData.chooseProgram,
    salary: adminData.baseSalary,
    autoSendWelcome: adminData.autoSendWelcome,
    autoSendGuide: adminData.autoSendGuide,
    automatedReminder: adminData.automatedReminder,
    headId: adminData.headId,
    experience: adminData.experience,
    qualification: adminData.qualification,
  });
  return newAdmin;
};

export const getAdminById = async (id) => {
  const admin = await AdminModel.findById(id).select("-password");
  return admin;
};


export const getAllCoachesByAdmin = async ({ adminId, page, limit }) => {
  const skip = (page - 1) * limit;
  const admin = await AdminModel.findById(adminId).select("experts");
  const totalCount = admin?.experts?.length || 0;

  const populatedAdmin = await AdminModel.findById(adminId).populate({
    path: "experts",
    options: {
      skip: skip,
      limit: limit,
    },
  });

  return {
    coaches: populatedAdmin?.experts || [],
    totalCount: totalCount,
  };
};

export const getDashboardData = async (adminId) => {

  const totalExperts = await AdminModel.find({_id:adminId}).select("experts program").populate("experts program");
  const totalPrograms = totalExperts[0].program?.length;

  const query = {
    $or: [
      { trainer: { $in: totalExperts?.experts } },
      { dietition: { $in: totalExperts?.experts } },
      { therapist: { $in: totalExperts?.experts } },
    ],
    role: "user",
  };

  const clients = await User.find(query)

  const totalClients = clients?.length;
  const totalCoaches = totalExperts[0].experts?.length;

  const totalTrainers =await totalExperts[0].experts?.filter((expert) => expert.role.includes("Trainer"))?.length;
  const totalDietitians =await totalExperts[0].experts?.filter((expert) => expert.role.includes("Dietician"))?.length;
  const totalTherapists =await totalExperts[0].experts?.filter((expert) => expert.role.includes("Therapist"))?.length;

  return {
    totalPrograms,
    totalExperts:totalExperts[0].experts?.length,
    totalClients,
    totalCoaches,
    totalTrainers,
    totalDietitians,
    totalTherapists,
  }
};

export const getAdminByHead = async ({headId,page,limit}) => {
  const skip = (page - 1) * limit;
  const totalCount = await AdminModel.countDocuments({ headId });
  const admin = await AdminModel.find({ headId }).select("-password").skip(skip).limit(limit);
  return {
    admin,
    totalCount,
  };
};

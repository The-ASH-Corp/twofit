import { generatePassword, hashPassword } from "../../utils/password.js";
import { AdminModel } from "../admin/admin.model.js";
import ProgramModel from "../allPrograms/allPrograma.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "./heads.modal.js";

export const createHead = async (head) => {
  let hashedPassword;

  if (head.password) {
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
    status: "Active",
    specialization: head.specialization,
    experience: head.experience,
    qualification: head.qualification,
    programCategory: head.programCategory,
    salary: head.salary,
  });
};

export const getAllHeads = async (page, limit) => {
  const skip = (page - 1) * limit;

  const totalCount = await HeadsModel.countDocuments();
  const head = await HeadsModel.find().skip(skip).limit(limit);
  return {
    head,
    totalCount,
  };
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

export const getDashboardData = async (id) => {

  const head = await HeadsModel.find({ _id: id }).populate("programCategory")
  const totalAdmins = await AdminModel.find({ headId: id });

  const totalExperts = await Promise.all(totalAdmins.map(async (admin) => {
    return await CoachModel.find({ adminId: admin._id });
  }));

  const uniqueClients = new Set();
  totalExperts.flat().forEach(expert => {
    if (expert.assignedUsers && expert.assignedUsers.length > 0) {
      expert.assignedUsers.forEach(userId => uniqueClients.add(userId.toString()));
    }
  });

  const totalClients = uniqueClients.size;

  const totalPrograms = await ProgramModel.countDocuments({ category: head[0].programCategory._id });

  const totalTrainers = await totalExperts.filter(expertArray =>
    expertArray.some(expert => expert.role == "Trainer")
  ).reduce((acc, expertArray) => acc + expertArray.filter(expert => expert.role == "Trainer").length, 0);

  const totalDietitians = await totalExperts.filter(expertArray =>
    expertArray.some(expert => expert.role == "Dietician")
  ).reduce((acc, expertArray) => acc + expertArray.filter(expert => expert.role == "Dietician").length, 0);

  const totalTherapists = await totalExperts.filter(expertArray =>
    expertArray.some(expert => expert.role == "Therapist")
  ).reduce((acc, expertArray) => acc + expertArray.filter(expert => expert.role == "Therapist").length, 0);

  return {
    totalClients,
    totalPrograms,
    totalAdmins: totalAdmins.length,
    totalExperts: totalExperts.reduce((acc, expert) => acc + expert.length, 0),
    totalTrainers,
    totalDietitians,
    totalTherapists,
  };
};


export const getAllCoachesByHead =async(headId,page,limit)=>{
  const skip = (page - 1) * limit;

  const totalAdmins = await AdminModel.find({ headId })
  const totalCount = (await Promise.all(totalAdmins.map(admin => CoachModel.countDocuments({ adminId: admin._id })))).reduce((acc, count) => acc + count, 0);
  const coaches = await Promise.all(totalAdmins.map(admin => CoachModel.find({ adminId: admin._id }).skip(skip).limit(limit).populate("assignedUsers")));
  return {
    coaches:coaches.flat(),
    totalCount:totalCount, 
  };
}
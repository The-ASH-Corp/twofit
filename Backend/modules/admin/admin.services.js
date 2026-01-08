import { generatePassword, hashPassword } from "../../utils/password.js";
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
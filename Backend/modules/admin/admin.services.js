import { AdminModel } from "./admin.model.js";

export const getAllAdmins = async (page, limit) => {
  const skip = (page - 1) * limit;

  const admins = await AdminModel.find().skip(skip).limit(limit).select("-password");
  return admins;
};

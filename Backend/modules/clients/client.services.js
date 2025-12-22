import User from "../auth/auth.model.js";

export const getAllClient = async (page, limit) => {
  const skip = (page - 1) * limit;

  const clients = await User.find({role:"user"}).skip(skip).limit(limit).select("-password");
  return clients;
};

export const getSingleClient = async (id) => {
  const client = await User.findById(id).select("-password");
  return client;
};

export const updateOneClient = async (userData, id) => {
  const client = await User.findByIdAndUpdate(
    id,
    { $set: userData },
    { new: true }
  ).select("-password");
  return client;
};

export const deleteOneClient = async (id) => {
  return await User.findByIdAndDelete(id);
};

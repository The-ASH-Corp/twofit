import User from "../auth/auth.model.js";

export const getAllClient = async () => {
  const clients = await User.find();
  return clients;
};


export const getSingleClient =async (id) => {
    const client = await User.findById(id);
    return client;
}
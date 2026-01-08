import User from "../auth/auth.model.js";

export const getAllClient = async (page, limit) => {
  const skip = (page - 1) * limit;
const totalCount = await User.countDocuments({ role: "user" });
  const clients = await User.find({ role: "user" })
    .skip(skip)
    .limit(limit)
    .select("-password");
  return {clients, totalCount};
};

export const getSingleClient = async (id) => {
  const client = await User.findById(id)
    .select("-password")
    .populate("programType")
    .populate("trainer")
    .populate("dietition")
    .populate("therapist");
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

export const getClientsBasedOnCoach = async (coachIds, page, limit) => {
  const skip = (page - 1) * limit;

  // Ensure coachIds is an array
  const ids = Array.isArray(coachIds) ? coachIds : [coachIds];

  const query = {
    $or: [
      { trainer: { $in: ids } },
      { dietition: { $in: ids } },
      { therapist: { $in: ids } },
    ],
    role: "user",
  };

  const totalCount = await User.countDocuments(query);
  const clients = await User.find(query)
    .skip(skip)
    .limit(limit)
    .select("-password")
    .populate("trainer")
    .populate("dietition")
    .populate("therapist");

  return { clients, totalCount };
};

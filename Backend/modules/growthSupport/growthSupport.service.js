import { GrowthSupportModel } from "./growthSupport.model.js";

export const createGrowthSupport = async (data) => {
  return await GrowthSupportModel.create(data);
};

export const getReceivedSupport = async (userId, page = 1, limit = 10) => {
  const query = { recipientIds: userId };
  const skip = (page - 1) * limit;

  const requests = await GrowthSupportModel.find(query)
    .populate("sender", "name profilePhoto email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await GrowthSupportModel.countDocuments(query);

  return { requests, totalCount };
};

export const markAsRead = async (id, userId) => {
  return await GrowthSupportModel.findOneAndUpdate(
    { _id: id, recipientIds: userId },
    { status: "read" },
    { new: true },
  );
};

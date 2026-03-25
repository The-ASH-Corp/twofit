import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";
import { broadcastModel } from "./broadcast.model.js";
import { sendTemplateMessage } from "../../utils/whatsapp.js";
import User from "../auth/auth.model.js";

export const createBroadcast = async (data) => {
  try {
    const duplicate = await broadcastModel.findOne({
      title: data.title.trim(),
    });

    if (duplicate) {
      throw new Error("Broadcast title already exists");
    }
    return await broadcastModel.create({
      ...data,
      title: capitalizeFirst(data.title),
    });
  } catch (error) {
    throw error;
  }
};

export const getAllBroadcast = async (page, limit, type) => {
  try {
    const skip = (page - 1) * limit;

    const filter = {};
    if (type && type !== "All") {
      filter.type = type;
    }

    const totalCount = await broadcastModel.countDocuments(filter);
    const broadcast = await broadcastModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      totalCount,
      broadcast,
    };
  } catch (error) {
    throw error;
  }
};

export const getBroadcast = async (id) => {
  try {
    return await broadcastModel.findById(id)
  } catch (error) {
    throw error;
  }
}

export const deleteBroadcast = async (id) => {
  try {
    return await broadcastModel.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};


export const updateBroadcast = async (id, data) => {
  try {
    if (data.title) {
      const duplicate = await broadcastModel.findOne({
        title: data.title.trim(),
        _id: { $ne: id },
      });

      if (duplicate) {
        throw new Error("Broadcast title already exists");
      }
    }

    const updatedBroadcast = await broadcastModel.findByIdAndUpdate(
      id,
      {
        ...data,
        ...(data.title && { title: capitalizeFirst(data.title) }),
      },
      { new: true }
    );

    if (!updatedBroadcast) {
      throw new Error("Broadcast not found");
    }

    return updatedBroadcast;
  } catch (error) {
    throw error;
  }
};

export const sentWhatsAppMessage = async (payload) => {
  try {
    console.log(payload)
    const {
      audienceType = "selected",
      selectedUserIds = [],
      templateName,
      variables = [],
      broadcastId = null,
    } = payload || {};

    const isAllUsers = audienceType === "all";

    const userQuery = isAllUsers
      ? { role: "user" }
      : { _id: { $in: selectedUserIds }, role: "user" };

    if (!isAllUsers && (!Array.isArray(selectedUserIds) || selectedUserIds.length === 0)) {
      throw new Error("Please select at least one user");
    }

    const users = await User.find(userQuery).select("_id name phone role status");

    if (!users.length) {
      throw new Error("No users found for selected audience");
    }

    if (!templateName) {
      return {
        queued: false,
        audienceType,
        message: isAllUsers
          ? "sent to all users"
          : "sent to selected users",
        totalUsers: users.length,
        sentCount: 0,
        failedCount: users.length,
        broadcastId,
      };
    }

    const sendResults = await Promise.allSettled(
      users.map((user) =>
        sendTemplateMessage({
          to: user.phone,
          templateName,
          variables,
        }),
      ),
    );

    const sentCount = sendResults.filter((result) => result.status === "fulfilled").length;
    const failedCount = sendResults.length - sentCount;

    return {
      queued: true,
      audienceType,
      message: isAllUsers ? "sent to all users" : "sent to selected users",
      totalUsers: users.length,
      sentCount,
      failedCount,
      broadcastId,
      ...(isAllUsers
        ? {}
        : {
            userDetails: users.map((user) => ({
              _id: user._id,
              name: user.name,
              phone: user.phone,
            })),
          }),
    };
  } catch (error) {
    throw error;
  }
};

export const getBroadcastAudience = async (page = 1, limit = 20, search = "") => {
  try {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 20;
    const skip = (parsedPage - 1) * parsedLimit;

    const query = {
      role: "user",
      ...(search
        ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
        : {}),
    };

    const totalCount = await User.countDocuments(query);
    const users = await User.find(query)
      .select("_id name phone email status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    return {
      users,
      totalCount,
      page: parsedPage,
      limit: parsedLimit,
    };
  } catch (error) {
    throw error;
  }
};


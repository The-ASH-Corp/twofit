import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";
import { broadcastModel } from "./broadcast.model.js";

export const createBroadcast = async (data) => {
    try {
        return await broadcastModel.create({
          ...data,
          title: capitalizeFirst(data.title),
        });
    } catch (error) {
        throw error;
    }
}

export const getAllBroadcast = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;
        const totalCount = await broadcastModel.countDocuments();
        const broadcast = await broadcastModel.find().skip(skip).limit(limit);
        return {
            totalCount,
            broadcast,
        }
    } catch (error) {
        throw error;
    }
}
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
import User from "../auth/auth.model.js";
import { CoachModel } from "../coach/coach.model.js";
import {IncentiveModel} from "./incentive.model.js";


export const calculateCoachIncentives = async (coachId) => {
  const coach = await CoachModel.findById(coachId).lean();
  const config = await IncentiveModel.findOne().lean();

  if (!coach || !config) return null;

  let ratingIncentive = 0;
  let extraClientIncentive = 0;

  // ✅ Rating incentive
  if (coach.avgRating >= 4.0 && coach.avgRating <= 4.4)
    ratingIncentive = config.rating1;
  else if (coach.avgRating >= 4.5 && coach.avgRating <= 4.7)
    ratingIncentive = config.rating2;
  else if (coach.avgRating >= 4.8) ratingIncentive = config.rating3;

  // ✅ Active clients count
  const totalClients = await User.countDocuments({
    _id: { $in: coach.assignedUsers },
    status: "Active",
  });

  if (totalClients > coach.maxClient) {
    extraClientIncentive =
      (totalClients - coach.maxClient) * config.extraClient;
  }

  const totalIncentive = ratingIncentive + extraClientIncentive;

  await CoachModel.findByIdAndUpdate(coachId, {
    ratingIncentiveAmount: ratingIncentive,
    extraClientIncentive,
    incentives: totalIncentive,
  });

  return {
    ratingIncentive,
    extraClientIncentive,
    totalIncentive,
  };
};


export const updatePayroll = async (payload) => {
  // ✅ No hardcoded ID anymore
  const updatedConfig = await IncentiveModel.findOneAndUpdate(
    {},
    {
      $set: {
        rating1: payload.rating1,
        rating2: payload.rating2,
        rating3: payload.rating3,
        extraClient: payload.extraClient,
        extendProgram30days: payload.extendProgram30days,
        extendProgram60days: payload.extendProgram60days,
        extendProgram90days: payload.extendProgram90days,
        targetAchieved: payload.targetAchieved,
      },
    },
    { new: true, upsert: true },
  ); 

  
  const coaches = await CoachModel.find().select("_id");

  await Promise.all(
    coaches.map((coach) => calculateCoachIncentives(coach._id)),
  );

  return updatedConfig;
};

export const getPayroll = async () => {
  return await IncentiveModel.findOne();
};

import { CoachModel } from "./coach.model.js"


export const createCoach = async (coach)=> {
    return await CoachModel.create(coach)
}

export const getAllCoach = async (page, limit)=> {
  const skip = (page - 1) * limit;

    return await CoachModel.find().skip(skip).limit(limit).select(
      "_id name specialization experience image"
    );
}

export const getCoachById = async (coachId) => {
  return await CoachModel.findById(coachId)
    .select("_id name specialization experience bio image")
    .populate("assignedUsers", "name _id");
};

export const updateCoachById = async (coachId, updatedData) => {
  return await CoachModel.updateOne({ _id: coachId }, { $set: updatedData });
};

export const deleteCoachById = async (coachId) => {
  return await CoachModel.findByIdAndDelete(coachId);
};

export const AssignCoachToUser = async (coachId, userId)=>{
  return await CoachModel.findByIdAndUpdate(
    coachId,
    { $addToSet: { assignedUsers: userId } },
    { new: true }
  )
};

export const getUsersAssignedToACoach = async (coachId) => {
  return await CoachModel.findById(coachId)
    .select("assignedUsers")
    .populate("assignedUsers", "name _id email");
};
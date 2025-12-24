import { generatePassword, hashPassword } from "../../utils/password.js";
import { CoachModel } from "./coach.model.js";

export const createCoach = async (coach) => {

  const password = hashPassword(generatePassword())

  return await CoachModel.create({
    name: fullname,
    dob,
    gender,
    password,
    ratingIncentive,
    responseTimeIncentive,
    complianceIncentive,
    autoSendWelcome,
    autoSendGuide,
    automatedReminder,
    email,
    phone,
    address,
    role,
    specialization,
    experience,
    qualification,
    certifications,
    languages,
    assignedPrograms:chooseProgram,
    maxClient:clientLimit,
    workingDays:workingdays,
    workingHours,
    breakSlots,
    maxDailyConsults:dailyConsults,
    responseTime,
    salary:baseSalary
  });
};

export const getAllCoach = async (page, limit) => {
  const skip = (page - 1) * limit;

  return await CoachModel.find()
    .skip(skip)
    .limit(limit)
};

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

export const AssignCoachToUser = async (coachId, userId) => {
  return await CoachModel.findByIdAndUpdate(
    coachId,
    { $addToSet: { assignedUsers: userId } },
    { new: true }
  );
};

export const getUsersAssignedToACoach = async (coachId) => {
  return await CoachModel.findById(coachId)
    .select("assignedUsers")
    .populate("assignedUsers", "name _id email");
};

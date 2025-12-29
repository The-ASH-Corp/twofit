import { generatePassword, hashPassword } from "../../utils/password.js";
import { CoachModel } from "./coach.model.js";

export const createCoach = async (coach) => {

  const password = hashPassword(generatePassword())

  return await CoachModel.create({
    name: coach.fullname,
    dob: coach.dob,
    gender: coach.gender,
    password: password,
    ratingIncentive: coach.ratingIncentive,
    responseTimeIncentive: coach.responseTimeIncentive,
    complianceIncentive: coach.complianceIncentive,
    autoSendWelcome: coach.autoSendWelcome,
    autoSendGuide: coach.autoSendGuide,
    automatedReminder: coach.automatedReminder,
    email: coach.email,
    phone: coach.phone,
    address: coach.address,
    role: coach.role,
    specialization: coach.specialization,
    experience: coach.experience,
    qualification: coach.qualification,
    certifications: coach.certifications,
    languages: coach.languages,
    assignedPrograms: coach.chooseProgram,
    maxClient: coach.clientLimit,
    workingDays: coach.workingdays,
    workingHours: coach.workingHours,
    breakSlots: coach.breakSlots,
    maxDailyConsults: coach.dailyConsults,
    responseTime: coach.responseTime,
    salary: coach.baseSalary,
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

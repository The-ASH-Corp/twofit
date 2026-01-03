import { generatePassword, hashPassword } from "../../utils/password.js";
import { CoachModel } from "./coach.model.js";

export const createCoach = async (coach) => {
  // Parse JSON stringified fields from FormData
  const fieldsToParseAsJSON = [
    "workingHours",
    "breakSlots",
    "workingdays",
    "role",
    "specialization",
    "languages",
  ];
  const booleanFields = [
    "ratingIncentive",
    "responseTimeIncentive",
    "complianceIncentive",
    "autoSendWelcome",
    "autoSendGuide",
    "automatedReminder",
  ];

  // Parse JSON strings
  fieldsToParseAsJSON.forEach((field) => {
    if (coach[field] && typeof coach[field] === "string") {
      try {
        coach[field] = JSON.parse(coach[field]);
      } catch (e) {
        console.error(`Failed to parse ${field}:`, e);
      }
    }
  });

  // Convert boolean strings to actual booleans
  booleanFields.forEach((field) => {
    if (coach[field] !== undefined) {
      coach[field] = coach[field] === "true" || coach[field] === true;
    }
  });
  
  const password = async (CoachPassword) => {
    if (CoachPassword) {
      return await hashPassword(CoachPassword);
    } else {
      const newPassword = generatePassword();
      console.log("Generated Password for Coach:", newPassword);
      return await hashPassword(newPassword);
    }
  };

  return await CoachModel.create({
    name: coach.fullname,
    dob: coach.dob,
    gender: coach.gender,
    password: await password(coach.password),
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
    status: "Active",
  });
};

export const getAllCoach = async (page, limit) => {
  const skip = (page - 1) * limit;

  return await CoachModel.find().skip(skip).limit(limit);
};

export const getCoachById = async (coachId) => {
  return await CoachModel.findById(coachId)
    .select("-password")
    .populate("assignedUsers", "name _id email")
    .populate("assignedPrograms");
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

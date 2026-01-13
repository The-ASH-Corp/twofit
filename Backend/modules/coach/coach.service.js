import { generatePassword, hashPassword } from "../../utils/password.js";
import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "./coach.model.js";

export const createCoach = async (coach) => {
  // Parse JSON stringified fields from FormData
  const fieldsToParseAsJSON = [
    "workingHours",
    "breakSlots",
    "workingdays",
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

  const coachCreated = await CoachModel.create({
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

  await AdminModel.findByIdAndUpdate(
    coach.adminId,
    { $addToSet: { experts: coachCreated._id } },
    { new: true }
  );

  return coachCreated;
};

export const getAllCoach = async (page, limit) => {
  const skip = (page - 1) * limit;

  return await CoachModel.find().skip(skip).limit(limit);
};

export const getCoachById = async (coachId) => {
  return await CoachModel.findById(coachId)
    .select("-password")
    .populate({
      path: "assignedUsers",
      select: "-password",
      populate: {
        path: "programType",
      },
    })
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

export const getUsersAssignedToACoach = async (coachId, page, limit) => {
  const skip = (page - 1) * limit;
  
  const coach = await CoachModel.findById(coachId).select("assignedUsers");
  
  if (!coach) {
    return { users: [], total: 0 };
  }
  
  const total = coach.assignedUsers.length;
  
  const paginatedCoach = await CoachModel.findById(coachId)
    .select("assignedUsers")
    .populate({
      path: "assignedUsers",
      select: "-password",
      options: {
        skip: skip,
        limit: limit
      }
    });
  
  return {
    users: paginatedCoach.assignedUsers,
    total: total 
   };
};


export const getCoachesByAdmin = async ({ adminIds }) => {
  let coaches = adminIds.map((adminId) =>
    CoachModel.findOne({ _id: adminId })
      .select("-password")
      .populate("assignedPrograms")
  );
  return await Promise.all(coaches);
}

export const createFeedback = async (expertId, userId, rating, feedback) => {
  return await CoachModel.findByIdAndUpdate(
    expertId,
    { $addToSet: { feedback: { userId, rating, feedback } } },
    { new: true }
  );
};


export const getCoachDashboardStats =async(coachId) => {
  const coach = await CoachModel.findById(coachId).select("assignedUsers assignedPrograms feedback");
  if (!coach) {
    throw new Error("Coach not found");
  }
  const totalClients = coach.assignedUsers.length;
  const totalPrograms = coach.assignedPrograms.length;
  const avarageRating = coach.feedback.length > 0 ? 
    (coach.feedback.reduce((sum, fb) => sum + fb.rating, 0) / coach.feedback.length).toFixed(2) 
    : 0;
  return {
    totalClients,
    totalPrograms,
    avarageRating: parseFloat(avarageRating)
  };
} 

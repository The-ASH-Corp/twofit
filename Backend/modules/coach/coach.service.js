import { generatePassword, hashPassword } from "../../utils/password.js";
import { AdminModel } from "../admin/admin.model.js";
import { calculateRatingIncentive } from "../payroll/payroll.service.js";
import { CoachModel } from "./coach.model.js";
import User from "../auth/auth.model.js";
import mongoose from "mongoose";

export const createCoach = async (coach) => {
  // Parse JSON stringified fields from FormData
  const fieldsToParseAsJSON = [
    "workingHours",
    "breakSlots",
    "workingdays",
    "specialization",
    "chooseProgram",
    "languages",
  ];
  const booleanFields = [
    // "ratingIncentive",
    // "responseTimeIncentive",
    // "complianceIncentive",
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
    // ratingIncentive: coach.ratingIncentive,
    // responseTimeIncentive: coach.responseTimeIncentive,
    // complianceIncentive: coach.complianceIncentive,
    autoSendWelcome: coach.autoSendWelcome,
    autoSendGuide: coach.autoSendGuide,
    automatedReminder: coach.automatedReminder,
    email: coach.email,
    phone: coach.phone,
    address: coach.address,
    role: coach.role,
    adminId: coach.adminId,
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
    { new: true },
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
    { new: true },
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
        limit: limit,
      },
    });

  return {
    users: paginatedCoach.assignedUsers,
    total: total,
  };
};

export const getCoachesByAdmin = async ({ adminIds }) => {
  let coaches = adminIds.map((adminId) =>
    CoachModel.findOne({ _id: adminId })
      .select("-password")
      .populate("assignedPrograms"),
  );
  return await Promise.all(coaches);
};

const calculateAvgRating = (feedback = []) => {
  if (!feedback.length) return 0;
  const total = feedback.reduce((sum, f) => sum + f.rating, 0);
  return Number((total / feedback.length).toFixed(1));
};

export const createFeedback = async (expertId, userId, rating, feedback) => {
  const exists = await CoachModel.findOne({
    _id: expertId,
    "feedback.userId": userId,
  });

  if (exists) {
    throw new Error("You have already submitted a review for this coach"); 
  }
  // Push feedback
  const coach = await CoachModel.findByIdAndUpdate(
    expertId,
    { $push: { feedback: { userId, rating, feedback } } },
    { new: true },
  );

  if (!coach) throw new Error("Coach not found");

  const avgRating = calculateAvgRating(coach.feedback);

  const avgrating = await CoachModel.findByIdAndUpdate(
    expertId,
    { avgRating },
    { new: true },
  );

  await calculateRatingIncentive(expertId);

  return avgrating;
};

export const getCoachDashboardStats = async (coachId) => {
  const coach = await CoachModel.findById(coachId).select(
    "avgRating adminId assignedPrograms",
  );
  if (!coach) {
    throw new Error("Coach not found");
  }

  const coachObjectId = new mongoose.Types.ObjectId(coachId);

  // Dynamically count assigned clients from User model
  const totalClients = await User.countDocuments({
    $or: [
      { trainer: coachObjectId },
      { dietition: coachObjectId },
      { therapist: coachObjectId },
    ],
  });

  // Count programs: Start with what is assigned directly to the coach
  let totalPrograms = coach.assignedPrograms?.length || 0;

  // If direct assignments are 0, fallback to checking their associated admin's program list
  if (totalPrograms === 0 && coach.adminId) {
    const admin = await AdminModel.findById(coach.adminId).select("program");
    totalPrograms = admin?.program?.length || 0;
  }

  const avarageRating = coach.avgRating || 0;

  return {
    totalClients,
    totalPrograms,
    avarageRating,
  };
};

export const founderCoachList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await CoachModel.countDocuments();

    const data = await CoachModel.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Admin =====
      {
        $lookup: {
          from: "admins",
          localField: "adminId",
          foreignField: "_id",
          as: "admin",
        },
      },

      // ===== Head =====
      {
        $lookup: {
          from: "heads",
          localField: "admin.headId",
          foreignField: "_id",
          as: "head",
        },
      },

      // ===== Category =====
      {
        $lookup: {
          from: "categories",
          localField: "head.programCategory",
          foreignField: "_id",
          as: "category",
        },
      },

      // ===== Final Shape =====
      {
        $project: {
          _id: 0,
          _id: "$_id",
          coachName: "$name",
          role: "$role",
          status: "$status",

          adminName: {
            $arrayElemAt: ["$admin.name", 0],
          },

          headName: {
            $arrayElemAt: ["$head.name", 0],
          },

          categoryName: {
            $arrayElemAt: ["$category.name", 0],
          },

          clientCount: {
            $size: { $ifNull: ["$assignedUsers", []] },
          },

          maxClientLimit: "$maxClient",
          avgRating: "$avgRating",
        },
      },
    ]);

    return {
      data,
      totalCount,
    };
  } catch (error) {
    throw error;
  }
};

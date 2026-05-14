import mongoose from "mongoose";
import { generatePassword, hashPassword } from "../../utils/password.js";
import { AdminModel } from "../admin/admin.model.js";
import ProgramModel from "../allPrograms/allPrograma.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "./heads.modal.js";
import TaskSubmission from "../taskSubmission/taskSubmission.model.js";
import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";
import { sendEmail } from "../../utils/email.js";
import User from "../auth/auth.model.js";
import { categoryModel } from "../category/category.model.js";
import { assertEmailUnique } from "../../utils/checkEmailUnique.js";

export const createHead = async (head) => {
  await assertEmailUnique(head.email);

  let hashedPassword;
  let plainPassword;

  if (head.password) {
    plainPassword = head.password;
    hashedPassword = await hashPassword(head.password);
  } else {
    plainPassword = generatePassword();
    console.log("Generated Password for head:", plainPassword);
    hashedPassword = await hashPassword(plainPassword);
  }

  const newHead = await HeadsModel.create({
    name: head.name,
    dob: head.dob,
    gender: head.gender,
    email: head.email,
    phone: head.phone,
    password: hashedPassword,
    address: head.address,
    status: "Active",
    specialization: head.specialization,
    experience: head.experience,
    qualification: head.qualification,
    programCategory: head.programCategory,
    salary: head.salary,
  });

  // ✅ Send Email
  try {
    await sendEmail({
      email: head.email,
      fullName: head.name,
      password: plainPassword,
    });

  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }

  return newHead;
};

export const getAllHeads = async (page, limit) => {
  const skip = (page - 1) * limit;

  const totalCount = await HeadsModel.countDocuments();
  const head = await HeadsModel.find().skip(skip).limit(limit);
  return {
    head,
    totalCount,
  };
};

export const getHeadById = async (id) => {
  return await HeadsModel.findById(id).populate({
    path: "programCategory",
    select: "name",
  });
};

export const updateHead = async (id, data) => {
  try {
    if (!data?.name || !data?.email || !data?.phone) {
      throw new Error("Name, email, and phone are required");
    }

    const duplicate = await HeadsModel.findOne({
      _id: { $ne: id },
      $or: [
        { name: data.name.trim() },
        { email: data.email?.trim() },
        { phone: data.phone?.trim() },
      ],
    });

    if (duplicate) {
      throw new Error("Head already exists with same name, email, or phone");
    }

    const updated = await HeadsModel.findByIdAndUpdate(
      id,
      {
        name: capitalizeFirst(data.name.trim()),
        dob: data.dob,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        address: data.address,
        specialization: data.specialization,
        experience: data.experience,
        qualification: data.qualification,
        salary: data.salary,
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new Error("Head not found");
    }

    return updated;
  } catch (error) {
    throw error;
  }
};

export const deleteHead = async (id) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid head ID");
    }

    // Check head exists
    const head = await HeadsModel.findById(id);
    if (!head) {
      throw new Error("Head not found");
    }

    // Check admins using this head
    const adminsUsingHead = await AdminModel.find(
      { headId: id },
      { _id: 1, name: 1 },
    );

    // Block delete if head is in use
    if (adminsUsingHead.length > 0) {
      const adminNames = adminsUsingHead.map((a) => a.name).join(", ");

      return {
        canDelete: false,
        message: `Cannot delete head.This head assigned to admins: ${adminNames}.`,
      };
    }

    // Safe delete
    await HeadsModel.findByIdAndDelete(id);

    return {
      canDelete: true,
      message: "Head deleted successfully",
      head,
    };
  } catch (error) {
    throw error;
  }
};

export const getDashboardData = async (id, duration) => {
  let startDate = new Date();
  const months = parseInt(duration) || 3; // Default to 3 months if not provided
  startDate.setMonth(startDate.getMonth() - months);

  const head = await HeadsModel.findById(id).populate("programCategory");
  if (!head) {
    throw new Error("Head not found");
  }

  const programs = await ProgramModel.find({
    category: head.programCategory._id,
  }).select("_id");

  const programIds = programs.map((program) => program._id);

  const [
    totalAdmins,
    totalExperts,
    totalTrainers,
    totalDietitians,
    totalTherapists,
    totalClients,
  ] = await Promise.all([
    AdminModel.countDocuments({
      program: { $in: programIds },
    }),
    CoachModel.countDocuments({
      assignedPrograms: { $in: programIds },
    }),
    CoachModel.countDocuments({
      assignedPrograms: { $in: programIds },
      role: "Trainer",
    }),
    CoachModel.countDocuments({
      assignedPrograms: { $in: programIds },
      role: "Dietician",
    }),
    CoachModel.countDocuments({
      assignedPrograms: { $in: programIds },
      role: "Therapist",
    }),
    User.countDocuments({
      programType: { $in: programIds },
      status: "Active",
    }),
  ]);

  const matchedExperts = await CoachModel.find({
    assignedPrograms: { $in: programIds },
  }).select("maxClient role feedback createdAt");

  const totalPrograms = await ProgramModel.countDocuments({
    category: head.programCategory._id,
  });

  const newProgramsCount = await ProgramModel.countDocuments({
    category: head.programCategory._id,
  });

  const newExpertsCount = await CoachModel.countDocuments({
    assignedPrograms: { $in: programIds },
  });

  const newClientsCount = await User.countDocuments({
    programType: { $in: programIds },
  });

  const sumMaxCapacity = matchedExperts.reduce(
    (acc, expert) => acc + (expert.maxClient || 0),
    0,
  );

  const matchedClientIds = await User.find({
    programType: { $in: programIds },
  }).select("_id");

  const clientIds = matchedClientIds.map((user) => user._id);

  const clientCompletionRates = await TaskSubmission.aggregate([
    {
      $match: {
        userId: { $in: clientIds },
      },
    },
    { $unwind: "$dailySubmissions" },
    { $unwind: "$dailySubmissions.exercises" },
    { $match: { "dailySubmissions.exercises.updatedAt": { $gte: startDate } } },
    {
      $group: {
        _id: "$userId",
        totalTasks: { $sum: 1 },
        verifiedTasks: {
          $sum: {
            $cond: [
              { $eq: ["$dailySubmissions.exercises.status", "verified"] },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        completionRate: {
          $cond: [
            { $eq: ["$totalTasks", 0] },
            0,
            {
              $multiply: [{ $divide: ["$verifiedTasks", "$totalTasks"] }, 100],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        averageCompletionRate: { $avg: "$completionRate" },
      },
    },
  ]);

  const taskCompletionRate =
    clientCompletionRates.length > 0
      ? Math.round(clientCompletionRates[0].averageCompletionRate)
      : 0;

  let totalRating = 0;
  let ratingCount = 0;
  matchedExperts.forEach((expert) => {
    if (expert.feedback && expert.feedback.length > 0) {
      expert.feedback.forEach((f) => {
        if (f.rating && (!f.createdAt || new Date(f.createdAt) >= startDate)) {
          totalRating += f.rating;
          ratingCount++;
        }
      });
    }
  });

  const averageRating =
    ratingCount > 0 ? Number((totalRating / ratingCount).toFixed(1)) : 0;

  const clientsAssignedRate =
    sumMaxCapacity > 0 ? Math.round((totalClients / sumMaxCapacity) * 100) : 0;

  const latestReports = await TaskSubmission.aggregate([
    {
      $match: {
        userId: { $in: clientIds },
        "dailySubmissions.exercises": { $exists: true, $ne: [] },
      },
    },
    { $unwind: "$dailySubmissions" },
    { $unwind: "$dailySubmissions.exercises" },
    {
      $sort: {
        "dailySubmissions.exercises.updatedAt": -1,
        "dailySubmissions.exercises.status": -1,
      },
    },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "coaches",
        localField: "user.trainer",
        foreignField: "_id",
        as: "trainer",
      },
    },
    {
      $lookup: {
        from: "coaches",
        localField: "user.dietition",
        foreignField: "_id",
        as: "dietitian",
      },
    },
    {
      $lookup: {
        from: "coaches",
        localField: "user.therapist",
        foreignField: "_id",
        as: "therapist",
      },
    },
    {
      $project: {
        clientName: "$user.name",
        taskType: "$dailySubmissions.exercises.taskType",
        status: "$dailySubmissions.exercises.status",
        updatedAt: "$dailySubmissions.exercises.updatedAt",
        trainerName: { $arrayElemAt: ["$trainer.name", 0] },
        dietitianName: { $arrayElemAt: ["$dietitian.name", 0] },
        therapistName: { $arrayElemAt: ["$therapist.name", 0] },
      },
    },
  ]);

  const formattedReports = latestReports.map((report) => {
    let expertName = "N/A";
    let expertType = "N/A";

    if (report.taskType === "Workout") {
      expertName = report.trainerName;
      expertType = "Trainer";
    } else if (report.taskType === "Meal" || report.taskType === "Diet") {
      expertName = report.dietitianName;
      expertType = "Dietitian";
    } else if (report.taskType === "Therapy") {
      expertName = report.therapistName;
      expertType = "Therapist";
    }

    return {
      name: report.clientName,
      type: report.taskType === "Meal" ? "Diet" : report.taskType,
      expert: expertType,
      submittedBy: expertName
        ? `${expertType} ${expertName.split(" ")[0]}`
        : "Client",
      time: report.updatedAt,
    };
  });

  return {
    totalClients,
    totalPrograms,
    totalAdmins,
    totalExperts,
    totalTrainers,
    totalDietitians,
    totalTherapists,
    adminPerformance: {
      programs: newProgramsCount,
      experts: newExpertsCount,
      clients: newClientsCount,
    },
    expertPerformance: {
      taskCompletion: taskCompletionRate,
      rating: averageRating,
      clientsAssigned: clientsAssignedRate,
      totalClientsAssigned: totalClients,
      totalCapacity: sumMaxCapacity,
    },
    latestReports: formattedReports,
  };
};

export const getAllCoachesByHead = async (headId, page, limit) => {
  const skip = (page - 1) * limit;

  const totalAdmins = await AdminModel.find({ headId });
  const totalCount = (
    await Promise.all(
      totalAdmins.map((admin) =>
        CoachModel.countDocuments({ adminId: admin._id }),
      ),
    )
  ).reduce((acc, count) => acc + count, 0);
  const coaches = await Promise.all(
    totalAdmins.map((admin) =>
      CoachModel.find({ adminId: admin._id, role: "Therapist" })
        .skip(skip)
        .limit(limit)
        .populate("assignedUsers"),
    ),
  );
  return {
    coaches: coaches.flat(),
    totalCount: totalCount,
  };
};

export const getAllUsersByHead = async (headId, page, limit) => {
  const totalAdmins = await AdminModel.find({ headId });

  // Fetch all coaches to get all potential users
  const coaches = await Promise.all(
    totalAdmins.map((admin) =>
      CoachModel.find({ adminId: admin._id }).populate("assignedUsers"),
    ),
  );

  const allUsers = coaches.flat().flatMap((coach) => coach.assignedUsers);

  const uniqueUsersMap = new Map();
  allUsers.forEach((user) => {
    if (user && user._id) {
      uniqueUsersMap.set(user._id.toString(), user);
    }
  });

  const uniqueUsersList = Array.from(uniqueUsersMap.values());

  const totalCount = uniqueUsersList.length;

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = uniqueUsersList.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    totalCount: totalCount,
  };
};

export const founderHeadList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await HeadsModel.countDocuments();

    const data = await HeadsModel.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Category =====
      {
        $lookup: {
          from: "categories",
          localField: "programCategory",
          foreignField: "_id",
          as: "category",
        },
      },

      // ===== Programs under category =====
      {
        $lookup: {
          from: "programslists",
          localField: "programCategory",
          foreignField: "category",
          as: "programs",
        },
      },

      // ===== Admins by category programs =====
      {
        $lookup: {
          from: "admins",
          let: { programIds: "$programs._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $setIntersection: ["$program", "$$programIds"],
                      },
                    },
                    0,
                  ],
                },
              },
            },
          ],
          as: "admins",
        },
      },

      // ===== Coaches by category programs =====
      {
        $lookup: {
          from: "coaches",
          let: { programIds: "$programs._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $gt: [
                    {
                      $size: {
                        $setIntersection: ["$assignedPrograms", "$$programIds"],
                      },
                    },
                    0,
                  ],
                },
              },
            },
          ],
          as: "coaches",
        },
      },

      // ===== Users by category programs =====
      {
        $lookup: {
          from: "users",
          let: { programIds: "$programs._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$programType", "$$programIds"] },
              },
            },
          ],
          as: "users",
        },
      },

      // ===== Final Shape =====
      {
        $project: {
          _id: 0,
          _id: "$_id",
          headName: "$name",
          status: "$status",

          categoryName: {
            $arrayElemAt: ["$category.name", 0],
          },

          programCount: { $size: "$programs" },
          adminCount: { $size: "$admins" },
          coachCount: { $size: "$coaches" },
          userCount: { $size: "$users" },
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

export const getHeadPerformance = async (headId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(headId);

    // 1️⃣ Get head
    const head = await HeadsModel.findById(objectId);

    if (!head) {
      throw new Error("Head not found");
    }

    const categoryId = head.programCategory;

    // 2️⃣ Get programs under this category
    const programs = await ProgramModel.find({
      category: categoryId,
    }).select("_id");

    const programIds = programs.map((p) => p._id);

    // 3️⃣ Counts
    const [programCount, coachCount, clientCount] = await Promise.all([
      ProgramModel.countDocuments({ category: categoryId }),

      CoachModel.countDocuments({
        assignedPrograms: { $in: programIds },
        status: "Active",
      }),

      User.countDocuments({
        programType: { $in: programIds },
        status: "Active",
      }),
    ]);

    return {
      adminPerformance: {
        programs: programCount,
        experts: coachCount,
        clients: clientCount,
      },
    };
  } catch (error) {
    throw new Error("Failed to fetch dashboard counts: " + error.message);
  }
};

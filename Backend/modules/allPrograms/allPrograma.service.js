import { AdminModel } from "../admin/admin.model.js";
import { CoachModel } from "../coach/coach.model.js";
import planModel from "../plan/plan.model.js";
import programModel from "./allPrograma.model.js";

export const createProgram = async (data) => {
  return await programModel.create(data);
};

export const getAllProgram = async (page, limit) => {
  const totalProgram = await programModel.countDocuments();
  const program = await programModel
    .find()
    .populate("category", "name -_id")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  const formattedPrograms = program.map((program) => ({
    ...program,
    category: program.category?.name || null,
  }));
  return { program: formattedPrograms, totalProgram };
};

export const getSingleProgram = async (id) => {
  return await programModel.findById(id).populate("plan");
};

export const updateProgram = async (id, data) => {
  return await programModel.findByIdAndDelete(id, data);
};

export const deleteProgram = async (id) => {
  return await programModel.findByIdAndDelete(id);
};

export const getAllProgramByCategory = async (category, page, limit) => {
  console.log(category, page, limit);
  const totalProgram = await programModel.countDocuments({ category });
  const data = await programModel
    .find({ category })
    .populate("category", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  console.log(data);
  return { program: data, totalProgram };
};

export const getAllProgramsByExpert = async (expertId, page, limit) => {
  const coach = await CoachModel.findById(expertId)
    .select("assignedPrograms")
    .populate({
      path: "assignedPrograms",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .lean();

  if (!coach) {
    return { program: [], totalProgram: 0 };
  }

  const programsWithPlans = await Promise.all(
    coach.assignedPrograms.map(async (program) => {
      const plans = await planModel.find({ program: program._id }).lean();
      return { ...program, plans };
    }),
  );

  const totalProgram = programsWithPlans?.length || 0;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPrograms =
    programsWithPlans?.slice(startIndex, endIndex) || [];

  return { program: paginatedPrograms, totalProgram };
};

export const getAllProgramsByAdmin = async (adminId, page, limit) => {
  const admin = await AdminModel.findById(adminId)
    .populate({
      path: "program",
      select: "title category duration status",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .lean();

  if (!admin) {
    return { program: [], totalProgram: 0 };
  }

  const programsWithPlans = await Promise.all(
    admin.program.map(async (program) => {
      const plans = await planModel.find({ program: program._id }).lean();
      return { ...program, plans };
    }),
  );

  const totalProgram = admin.program?.length || 0;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedPrograms =
    programsWithPlans?.slice(startIndex, endIndex) || [];
  return { program: paginatedPrograms, totalProgram };
};

export const founderProgramList = async (page, limit) => {
  try {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const totalCount = await programModel.countDocuments();

    const data = await programModel.aggregate([
      // ===== Pagination =====
      { $skip: skip },
      { $limit: limit },

      // ===== Category lookup =====
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      // ===== Experts (Coaches) under program =====
      {
        $lookup: {
          from: "coaches",
          localField: "_id",
          foreignField: "assignedPrograms",
          as: "experts",
        },
      },

      // ===== Users under program =====
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "programType",
          as: "users",
        },
      },

      // ===== Shape response =====
      {
        $project: {
          _id: 0,
          programId: "$_id",
          programTitle: "$title",

          categoryName: {
            $arrayElemAt: ["$category.name", 0],
          },

          expertCount: { $size: "$experts" },
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
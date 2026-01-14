import { CoachModel } from "../coach/coach.model.js";
import programModel from "./allPrograma.model.js";

export const createProgram = async (data) => {
  return await programModel.create(data);
};

export const getAllProgram = async (page,limit) => {
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
  return await programModel.findById(id);
};

export const updateProgram = async (id, data) => {
  return await programModel.findByIdAndDelete(id, data);
};

export const deleteProgram = async (id) => {
  return await programModel.findByIdAndDelete(id);
};

export const getAllProgramByCategory = async (category, page, limit) => {
  const totalProgram = await programModel.countDocuments({ category });
  const data = await programModel
    .find({ category }).populate("category", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { program: data, totalProgram };
};

export const getAllProgramsByExpert = async (expertId, page, limit) => {
  const coach = await CoachModel.findById(expertId).select("assignedPrograms").lean().populate("assignedPrograms");
  
  if (!coach) {
    return { program: [], totalProgram: 0 };
  }
  
  const totalProgram = coach.assignedPrograms?.length || 0;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedPrograms = coach.assignedPrograms?.slice(startIndex, endIndex) || [];
  return { program: paginatedPrograms, totalProgram };
}
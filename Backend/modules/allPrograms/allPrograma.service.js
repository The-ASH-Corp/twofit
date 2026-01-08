import programModel from "./allPrograma.model.js";

export const createProgram = async (data) => {
  return await programModel.create(data);
};

export const getAllProgram = async (page,limit) => {
  const totalProgram = await programModel.countDocuments();
  const program = await programModel.find().skip((page-1)*limit).limit(limit);
  return {program,totalProgram};
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

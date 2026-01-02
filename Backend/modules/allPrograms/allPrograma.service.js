import programModel from "./allPrograma.model.js";

export const createProgram = async (data) => {
  return await programModel.create(data);
};

export const getAllProgram = async (page,limit) => {
  return await programModel.find().skip((page-1)*limit).limit(limit);
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

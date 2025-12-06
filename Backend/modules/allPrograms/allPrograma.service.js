import programModel from "./allPrograma.model.js";

export const createProgram = async (data) => {
  return await programModel.create(data);
};

export const getAllProgram = async () => {
  return await programModel.find();
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

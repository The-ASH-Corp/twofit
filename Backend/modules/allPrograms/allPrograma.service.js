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

export const getAllProgramByCategory =async(category)=>{
    return await programModel.find({category})
}
import {
  createProgram,
  getAllProgram,
  getSingleProgram,
  deleteProgram,
  updateProgram,
  getAllProgramByCategory,
  getAllProgramsByExpert,
} from "./allPrograma.service.js";

export const createProgramController = async (req, res) => {
  try {
    if (req.files && req.files.photo && req.files.photo[0]) {
      req.body.image = "/uploads/" + req.files.photo[0].filename;
    }
    if (req.body.duration) {
      req.body.duration = JSON.parse(req.body.duration);
    }
    const program = await createProgram(req.body);
    res.status(200).json({ success: true, data: program });
  } catch (err) {
    console.log(err);

    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllProgramController = async (req, res) => {
  try {
    const { page, limit } = req.params
    const { program, totalProgram } = await getAllProgram(page, limit);
    res.status(200).json({ status: true, data: program, totalProgram });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSingleProgramController = async (req, res) => {
  try {
    const program = await getSingleProgram(req.params.id);
    res.status(200).json({ status: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateSingleProgramController = async (req, res) => {
  try {
    const program = await updateProgram(req.params.id, req.body);
    res.status(200).json({ status: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteProgramController = async (req, res) => {
  try {
    const program = await deleteProgram(req.params.id);
    res.status(200).json({ status: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const getAllProgramControllerByCategory = async (req, res) => {
  try {
    const { category, page, limit } = req.params
    const { program, totalProgram } = await getAllProgramByCategory(category, page, limit);
    res.status(200).json({ status: true, data: program, totalProgram });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const getAllProgramByExpert = async (req, res) => {
  try {
    const { expertId, page, limit } = req.params
    const { program, totalProgram } = await getAllProgramsByExpert(expertId, page, limit);
    res.status(200).json({ status: true, data: program, totalProgram });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
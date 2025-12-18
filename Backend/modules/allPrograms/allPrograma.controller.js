import {
  createProgram,
  getAllProgram,
  getSingleProgram,
  deleteProgram,
  updateProgram,
} from "./allPrograma.service.js";

export const createProgramController = async (req, res) => {
  try {
    if (req.file) {
      req.body.photo = "/uploads/" + req.file.filename;
    }
    const program = await createProgram(req.body);
    res.status(200).json({ status: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllProgramController = async (req, res) => {
  try {
    const{page,limit} = req.params
    const program = await getAllProgram(page,limit);
    res.status(200).json({ status: true, data: program });
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

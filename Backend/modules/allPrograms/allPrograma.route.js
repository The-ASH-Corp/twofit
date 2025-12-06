import express from "express";
import {
  createProgramController,
  deleteProgramController,
  getAllProgramController,
  getSingleProgramController,
  updateSingleProgramController,
} from "./allPrograma.controller.js";
import {uploader} from "../../middleware/upload.js";

const router = express.Router();
router.post("/create", uploader.single("photo"), createProgramController);
router.get("/list", getAllProgramController);
router.get("/get/:id", getSingleProgramController);
router.put("/update/:id", updateSingleProgramController);
router.delete("/delete/:id", deleteProgramController);

export default router;

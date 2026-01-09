import express from "express";
import {
  createProgramController,
  deleteProgramController,
  getAllProgramController,
  getSingleProgramController,
  updateSingleProgramController,
} from "./allPrograma.controller.js";
import { uploader } from "../../middleware/upload.js";

const router = express.Router();
router.post("/create", uploader.fields([{ name: "photo", maxCount: 1 }]), createProgramController);
router.get("/list/:page/:limit", getAllProgramController);
router.get("/get/:id", getSingleProgramController);
router.put("/update/:id", updateSingleProgramController);
router.delete("/delete/:id", deleteProgramController);

router.get("/get-all-programs-by-category/:category", getAllProgramController)

export default router;

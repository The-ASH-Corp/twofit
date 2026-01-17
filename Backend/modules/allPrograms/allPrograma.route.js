import express from "express";
import {
  createProgramController,
  deleteProgramController,
  getAllProgramByExpert,
  getAllProgramController,
  getAllProgramControllerByAdmin,
  getAllProgramControllerByCategory,
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

router.get("/get-all-programs-by-category/:category/:page/:limit", getAllProgramControllerByCategory)
router.get("/get-all-programs-by-admin/:adminId/:page/:limit", getAllProgramControllerByAdmin)
router.get("/get-all-programs-by-expert/:expertId/:page/:limit", getAllProgramByExpert)

export default router;

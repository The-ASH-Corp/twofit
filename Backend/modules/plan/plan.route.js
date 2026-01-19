import express from "express"
import { createNewPlan, getPlanByProgramId, getSinglePlanById, uploadMedia } from "./plan.contoller.js";
import { uploader } from "../../middleware/upload.js";


const router = express.Router();

router.post("/create-plan", createNewPlan)
router.post("/upload-media", uploader.single("file"), uploadMedia);
router.get("/get-plan-by-id/:planId", getSinglePlanById)
router.get("/get-plan-by-programId/:programId", getPlanByProgramId)
export default router
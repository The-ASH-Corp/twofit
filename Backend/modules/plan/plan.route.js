import express from "express"
import { createNewPlan, getPlanByProgramId, getSinglePlanById } from "./plan.contoller.js";


const router = express.Router();

router.post("/create-plan",createNewPlan)
router.get("/get-plan-by-id/:planId",getSinglePlanById)
router.get("/get-plan-by-programId/:programId",getPlanByProgramId)
export default router
import express from "express"
import { createNewPlan, getSinglePlanById } from "./plan.contoller.js";


const router = express.Router();

router.post("/create-plan",createNewPlan)
router.get("/get-plan-by-id/:planId",getSinglePlanById)
export default router
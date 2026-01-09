import express from "express"
import { createNewPlan } from "./plan.contoller.js";


const router = express.Router();

router.post("/create-plan",createNewPlan)

export default router
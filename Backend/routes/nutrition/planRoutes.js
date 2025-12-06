import express from "express";
import {
  getDietPlans,
  getSingleDietPlan,
  createDietPlan,
  updateDietPlan,
  deleteDietPlan
} from "../../controllers/nutrition/nutritionPlanController.js";

const router = express.Router();

router.get("/", getDietPlans);
router.get("/:planId", getSingleDietPlan);
router.post("/", createDietPlan);
router.put("/:planId", updateDietPlan);
router.delete("/:planId", deleteDietPlan);

export default router;

import express from "express";
import {
  assignDietPlan,
  getUserActiveDietPlan
} from "../../controllers/nutrition/assignNutritionController.js";

const router = express.Router();

router.post("/", assignDietPlan);
router.get("/user/:userId/active", getUserActiveDietPlan);

export default router;

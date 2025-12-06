import express from "express";
import {
  logMeal,
  getNutritionLogs
} from "../../controllers/nutrition/nutritionLogController.js";

const router = express.Router();

router.post("/", logMeal);
router.get("/:userId", getNutritionLogs);

export default router;

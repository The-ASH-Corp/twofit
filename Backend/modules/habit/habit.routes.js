import express from "express";
import {
  createHabitsController,
  getClientHabitsController,
  getDailyClientHabitSummaryController,
  getHabitByIdController,
  getTodayReflectionController,
  getWeeklyClientHabitSummaryController,
  upsertTodayReflectionController,
  updateHabitById,
  updateHabitStatusController,
} from "./habit.controller.js";
const router = express.Router();

router.get("/daily-habit", getDailyClientHabitSummaryController);
router.get("/weekly-habit",getWeeklyClientHabitSummaryController);
router.get("/:clientId/reflection", getTodayReflectionController);
router.put("/:clientId/reflection", upsertTodayReflectionController);
router.post("/:clientId", createHabitsController);
router.get("/:clientId", getClientHabitsController);
router.patch("/:habitId", updateHabitById);
router.get("/get/:habitId", getHabitByIdController);
router.put("/:clientId", updateHabitStatusController);

export default router;

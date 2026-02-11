import express from "express";
import { createHabitsController, getClientHabitsController, getHabitByIdController, updateHabitById, updateHabitStatusController } from "./habit.controller.js";
const router = express.Router();

router.post("/:clientId", createHabitsController);
router.get("/:clientId", getClientHabitsController);
router.patch("/:habitId", updateHabitById);
router.get("/get/:habitId",getHabitByIdController)
router.post("/:habitId", updateHabitStatusController);

export default router;

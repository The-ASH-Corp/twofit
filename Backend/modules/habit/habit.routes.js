import express from "express";
import { createHabitsController, getClientHabitsController, updateHabitStatusController } from "./habit.controller.js";
const router = express.Router();

router.post("/:clientId", createHabitsController);
router.get("/:clientId", getClientHabitsController);
router.post("/:habitId", updateHabitStatusController);

export default router;

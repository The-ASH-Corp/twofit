import express from "express";
import * as workoutController from "./workout.controller.js"

const router = express.Router();

router.post("/create", workoutController.createWorkout)
router.get("/get-all-workout/:page/:limit", workoutController.getAllWorkout)

export default router;
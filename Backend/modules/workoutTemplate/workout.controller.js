import * as workoutService from "./workout.service.js";

export const createWorkout = async (req, res) => {
  try {
    const workout = await workoutService.createWorkout(req.body);
    res.status(201).json({
      success: true,
      message: "workout created successfully",
      data: workout,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllWorkout = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const workouts = await workoutService.getAllWorkout(page, limit);
    res.status(200).json({
        success: true,
        data: workouts
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

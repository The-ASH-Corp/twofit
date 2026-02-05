import {
  createHabitsService,
  getClientHabitsService,
  updateHabitStatusService,
} from "./habit.service.js";

export const createHabitsController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { habits } = req.body;

    if (!habits || !Array.isArray(habits) || habits.length === 0) {
      return res.status(400).json({
        message: "Habits array is required",
      });
    }

    const habitDoc = await createHabitsService(clientId, habits);

    return res.status(201).json({
      message: "Habits created successfully",
      data: habitDoc,
    });
  } catch (error) {
    if (error.message.includes("already exist")) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to create habits",
      error: error.message,
    });
  }
};

export const getClientHabitsController = async (req, res) => {
  try {
    const { clientId } = req.params;

    const habitDoc = await getClientHabitsService(clientId);

    if (!habitDoc) {
      return res.status(404).json({
        message: "No habits found for this client",
      });
    }

    return res.status(200).json({
      data: habitDoc,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch habits",
      error: error.message,
    });
  }
};



export const updateHabitStatusController = async (req, res) => {
  try {
    const { clientId ,habitName} = req.params;
    const {  status } = req.body;
    await updateHabitStatusService(clientId, habitName, status);

    return res.status(200).json({
      message: "Habit status updated successfully",
    });
  }
    catch (error) {
    if (
      error.message === "Habits not found for this client" ||
      error.message === "Habit not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Failed to update habit status",
      error: error.message,
    });
  }
};

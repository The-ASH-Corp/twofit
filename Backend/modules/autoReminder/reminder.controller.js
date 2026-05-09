import * as reminderService from "./reminder.service.js";

// ✅ Get All
export const getReminders = async (req, res) => {
  try {
    const data = await reminderService.getAllReminders();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Single
export const getReminder = async (req, res) => {
  try {
    const { type } = req.params;

    const data = await reminderService.getSingleReminder(type);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update
export const updateReminderController = async (req, res) => {
  try {
    const { type } = req.params;

    const updated = await reminderService.updateReminder(type, req.body);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Toggle
export const toggleReminderController = async (req, res) => {
  try {
    const { type } = req.params;

    const data = await reminderService.toggleReminder(type);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


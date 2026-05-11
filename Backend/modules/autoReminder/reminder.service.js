import { Reminder } from "./reminder.model.js";
import User from "../auth/auth.model.js";
import { sendTemplateMessage } from "../../utils/whatsapp.js";


// ✅ Seed Default Reminders
export const seedReminders = async () => {
  try {
    const existing = await Reminder.find();

    if (existing.length === 0) {
      await Reminder.insertMany([
        {
          type: "meal",
          title: "Meal Plan",
          settings: [
            { label: "Breakfast", time: "08:30 AM" },
            { label: "Lunch", time: "01:00 PM" },
            { label: "Dinner", time: "07:00 PM" },
          ],
          message: "Hi! Don't forget to log your nutritious meal 🍽️",
          templateName: "meal_plan_reminder",
        },
        {
          type: "workout",
          title: "Workout Routine",
          settings: [
            { label: "Morning", time: "06:30 AM" },
            { label: "Evening", time: "07:00 PM" },
          ],
          message: "Time for your workout! 💪 Let's smash those goals.",
          templateName: "workout_routine_reminder",
        },
        {
          type: "therapy",
          title: "Therapy Sessions",
          settings: [{ label: "Daily Session", time: "08:00 PM" }],
          message: "Take a deep breath 🧘 Your therapy session is ready.",
          templateName: "therapy_session_reminder",
        },
      ]);
    } else {
      // Update existing if templateName is missing
      for (const r of existing) {
        if (!r.templateName) {
          if (r.type === "meal") r.templateName = "meal_plan_reminder";
          if (r.type === "workout") r.templateName = "workout_routine_reminder";
          if (r.type === "therapy") r.templateName = "therapy_session_reminder";
          await r.save();
        }
      }
    }

    return { message: "Default reminders seeded" };
  } catch (error) {
    throw error;
  }
};

// ✅ Get All
export const getAllReminders = async () => {
  try {
    return await Reminder.find().sort({ createdAt: 1 });
  } catch (error) {
    throw error;
  }
};

// ✅ Get Single
export const getSingleReminder = async (type) => {
  try {
    const reminder = await Reminder.findOne({ type });

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    return reminder;
  } catch (error) {
    throw error;
  }
};

// ✅ Update
export const updateReminder = async (type, data) => {
  try {
    if (!type) {
      throw new Error("Reminder type is required");
    }

    const reminder = await Reminder.findOne({ type });

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    const updated = await Reminder.findOneAndUpdate(
      { type },
      {
        title: data.title ?? reminder.title,
        settings: data.settings ?? reminder.settings,
        message: data.message ?? reminder.message,
        templateName: data.templateName ?? reminder.templateName,
      },
      { new: true, runValidators: true },
    );

    return updated;
  } catch (error) {
    throw error;
  }
};

// ✅ Toggle
export const toggleReminder = async (type) => {
  try {
    const reminder = await Reminder.findOne({ type });

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    reminder.isActive = !reminder.isActive;

    await reminder.save();

    return reminder;
  } catch (error) {
    throw error;
  }
};

// ✅ Send Automated Reminders to all users
export const sendAutomatedReminders = async (type, label, reminderData = null) => {
  try {
    const reminder = reminderData || await Reminder.findOne({ type, isActive: true });
    if (!reminder || !reminder.templateName) return;

    const users = await User.find({
      role: "user",
      automatedReminder: true,
      status: "Active",
      currentGlobalDay: { $lte: 10 },
    }).select("phone name");

    if (!users.length) return;


    await Promise.all(
      users.map(async (user) => {
        try {
          await sendTemplateMessage({
            to: user.phone,
            templateName: reminder.templateName,
            variables: [], // Sending name and custom message as variables
          });
        } catch (err) {
          console.error(`[Reminder Service] ERROR for ${user.phone}:`, err.message);
        }
      })
    );
  } catch (error) {
    console.error(`Error in sendAutomatedReminders for ${type}:`, error.message);
  }
};


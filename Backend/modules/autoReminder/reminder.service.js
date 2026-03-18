import { Reminder } from "./reminder.model.js";

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
        },
        {
          type: "workout",
          title: "Workout Routine",
          settings: [
            { label: "Morning", time: "06:30 AM" },
            { label: "Evening", time: "07:00 PM" },
          ],
          message: "Time for your workout! 💪 Let's smash those goals.",
        },
        {
          type: "therapy",
          title: "Therapy Sessions",
          settings: [{ label: "Daily Session", time: "08:00 PM" }],
          message: "Take a deep breath 🧘 Your therapy session is ready.",
        },
      ]);
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

// ✅ Send Test
export const sendTestReminder = async (type) => {
  try {
    const reminder = await Reminder.findOne({ type });

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    console.log("TEST REMINDER:", reminder.message);

    return {
      message: "Test reminder sent successfully",
      data: reminder,
    };
  } catch (error) {
    throw error;
  }
};

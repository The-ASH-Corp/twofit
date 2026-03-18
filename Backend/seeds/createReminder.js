import { Reminder } from "../modules/autoReminder/reminder.model";

export const seedReminders = async () => {
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
};

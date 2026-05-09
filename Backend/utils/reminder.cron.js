import cron from "node-cron";
import { Reminder } from "../modules/autoReminder/reminder.model.js";
import { sendAutomatedReminders } from "../modules/autoReminder/reminder.service.js";

/**
 * Normalizes time string (e.g., "08:30 AM" or "8:30 AM") to "H:MM AM/PM"
 */
const normalizeTime = (timeStr) => {
  if (!timeStr) return "";
  const parts = timeStr.trim().split(" ");
  if (parts.length !== 2) return timeStr;
  
  const [time, period] = parts;
  const timeParts = time.split(":");
  if (timeParts.length !== 2) return timeStr;
  
  const [hour, minute] = timeParts;
  return `${parseInt(hour)}:${minute} ${period.toUpperCase()}`;
};

const getLocalTime = (timezone = "Asia/Kolkata") => {
  const now = new Date();
  const options = {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  // toLocaleTimeString can return different formats, but with hour: "numeric", it should be "H:MM AM/PM"
  const timeStr = now.toLocaleTimeString("en-US", options);
  return normalizeTime(timeStr);
};

export const runReminderAutomation = async () => {
  try {
    const currentTime = getLocalTime();
    
    // Fetch all active reminders
    const activeReminders = await Reminder.find({ isActive: true });

    for (const reminder of activeReminders) {
      for (const setting of reminder.settings) {
        if (normalizeTime(setting.time) === currentTime) {
          await sendAutomatedReminders(reminder.type, setting.label, reminder);
        }
      }
    }
  } catch (error) {
    console.error("Reminder automation failed:", error.message);
  }
};

export const startReminderCron = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    await runReminderAutomation();
  }, {
    timezone: "Asia/Kolkata"
  });

  console.log("Reminder automation cron started (Asia/Kolkata)");
};

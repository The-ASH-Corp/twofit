import cron from "node-cron";
import { startSOPDailyJob } from "../modules/sop/sop.service.js";

// Runs at 12:01 AM on 1st of every month
cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Running SOP daily log generator...");

    await startSOPDailyJob();

    console.log("SOP logs created for today");
  },
  {
    timezone: "Asia/Kolkata",
  },
);

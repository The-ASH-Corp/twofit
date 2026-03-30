import cron from "node-cron";
import ProgramExtension from "../modules/plan/programExtension.model.js";
import User from "../modules/auth/auth.model.js";
import ProgramModel from "../modules/allPrograms/allPrograma.model.js";

const parseDurationDays = (durationValue) => {
  if (typeof durationValue === "number" && Number.isFinite(durationValue)) {
    return durationValue;
  }

  const match = String(durationValue || "").match(/\d+/);
  return match ? Number(match[0]) : null;
};

const getContinuedGlobalDay = (currentGlobalDay, originalDurationDays) => {
  const currentDay = Number(currentGlobalDay || 1);
  if (!Number.isFinite(currentDay) || currentDay <= 0) {
    return originalDurationDays ? originalDurationDays + 1 : 1;
  }

  if (!originalDurationDays || !Number.isFinite(originalDurationDays)) {
    return currentDay;
  }

  return Math.max(currentDay, originalDurationDays + 1);
};

// Run daily at 00:00 (midnight) to check for extensions that should be activated
export const activateExtensionsCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("[Cron] Checking for program extensions to activate...");

      // Find all inactive extensions where today >= extendedProgramStartDate
      const today = new Date().toISOString().split("T")[0];

      const extensionsToActivate = await ProgramExtension.find({
        isActivated: false,
        extendedProgramStartDate: { $lte: today },
      });

      console.log(
        `[Cron] Found ${extensionsToActivate.length} extensions to activate`
      );

      for (const extension of extensionsToActivate) {
        try {
          const user = await User.findById(extension.userId).select(
            "currentGlobalDay",
          );
          const originalProgram = await ProgramModel.findById(
            extension.originalProgramId,
          ).select("duration");

          const originalDurationDays = parseDurationDays(originalProgram?.duration);
          const continuedGlobalDay = getContinuedGlobalDay(
            user?.currentGlobalDay,
            originalDurationDays,
          );

          // Update user's program details to the extended program
          await User.findByIdAndUpdate(extension.userId, {
            programType: extension.extendedProgramId,
            duration: extension.extensionDuration,
            programStartDate: extension.extendedProgramStartDate,
            programEndDate: extension.extendedProgramEndDate,
            currentGlobalDay: continuedGlobalDay,
          });

          // Mark extension as activated
          await ProgramExtension.findByIdAndUpdate(extension._id, {
            isActivated: true,
          });

          console.log(
            `[Cron] Activated extension for user ${extension.userId} on ${today}`
          );
        } catch (error) {
          console.error(
            `[Cron] Error activating extension ${extension._id}: ${error.message}`
          );
        }
      }

      console.log("[Cron] Program extension activation check completed");
    } catch (error) {
      console.error(
        `[Cron] Error in activateExtensionsCron: ${error.message}`
      );
    }
  });
};

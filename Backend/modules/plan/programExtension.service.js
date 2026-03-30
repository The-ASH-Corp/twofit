export const shiftActivatedExtensionForMissedDays = async (userId, missedDaysCount) => {
  try {
    if (missedDaysCount <= 0) {
      return null;
    }

    // Find activated extension for this user 
    const extension = await ProgramExtension.findOne({
      userId,
      isActivated: true,
    });

    if (!extension) {
      return null; // No activated extension found
    }

    // Shift the extension end date only (start date doesn't change for activated extensions)
    extension.extendedProgramEndDate = addDaysToDate(
      extension.extendedProgramEndDate,
      missedDaysCount
    );

    await extension.save();

    return {
      success: true,
      message: `Activated extension end date shifted by ${missedDaysCount} days`,
      extension,
    };
  } catch (error) {
    throw new Error(
      `Failed to shift activated extension dates: ${error.message}`
    );
  }
};

import ProgramExtension from "./programExtension.model.js";
import User from "../auth/auth.model.js";
import ProgramModel from "../allPrograms/allPrograma.model.js";

// Helper to calculate end date from start date and days
const calculateEndDate = (startDateString, days) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days - 1); // -1 because we count the start day
  return endDate.toISOString().split("T")[0]; // Return as YYYY-MM-DD
};

// Helper to add 1 day to a date
const addOneDay = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

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

export const createProgramExtension = async (extensionData) => {
  try {
    const {
      userId,
      originalProgramId,
      extendedProgramId,
      extensionDuration,
      originalProgramEndDate,
      createdByAdminId,
      notes,
    } = extensionData;

    // Calculate extended program dates
    const extendedProgramStartDate = addOneDay(originalProgramEndDate);
    const extendedProgramEndDate = calculateEndDate(
      extendedProgramStartDate,
      extensionDuration
    );

    const extension = await ProgramExtension.create({
      userId,
      originalProgramId,
      extendedProgramId,
      extensionDuration,
      originalProgramEndDate,
      extendedProgramStartDate,
      extendedProgramEndDate,
      createdBy: createdByAdminId,
      notes,
      isActivated: false,
    });

    return extension;
  } catch (error) {
    throw new Error(`Failed to create program extension: ${error.message}`);
  }
};

export const getExtensionByUserId = async (userId) => {
  try {
    const extension = await ProgramExtension.findOne({
      userId,
      isActivated: false,
    })
      .populate("userId", "name email")
      .populate("originalProgramId", "title duration")
      .populate("extendedProgramId", "title duration")
      .populate("createdBy", "name email role");

    return extension;
  } catch (error) {
    throw new Error(`Failed to fetch extension: ${error.message}`);
  }
};

export const activateExtensionIfDue = async (userId) => {
  try {
    const extension = await ProgramExtension.findOne({
      userId,
      isActivated: false,
    });

    if (!extension) {
      return null;
    }

    const today = new Date().toISOString().split("T")[0];

    // Check if original program has ended and extended program should start
    if (today >= extension.extendedProgramStartDate) {
      const user = await User.findById(userId).select("currentGlobalDay");
      const originalProgram = await ProgramModel.findById(
        extension.originalProgramId,
      ).select("duration");

      const originalDurationDays = parseDurationDays(originalProgram?.duration);
      const continuedGlobalDay = getContinuedGlobalDay(
        user?.currentGlobalDay,
        originalDurationDays,
      );

      // Update the user's program details
      await User.findByIdAndUpdate(userId, {
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

      return extension;
    }

    return null;
  } catch (error) {
    throw new Error(
      `Failed to activate extension: ${error.message}`
    );
  }
};

export const deleteExtension = async (extensionId) => {
  try {
    const deleted = await ProgramExtension.findByIdAndDelete(extensionId);
    return deleted;
  } catch (error) {
    throw new Error(`Failed to delete extension: ${error.message}`);
  }
};

export const getExtensionById = async (extensionId) => {
  try {
    const extension = await ProgramExtension.findById(extensionId)
      .populate("userId", "name email")
      .populate("originalProgramId", "title duration")
      .populate("extendedProgramId", "title duration")
      .populate("createdBy", "name email role");

    return extension;
  } catch (error) {
    throw new Error(`Failed to fetch extension: ${error.message}`);
  }
};

export const getAllUserExtensions = async (userId) => {
  try {
    const extensions = await ProgramExtension.find({ userId })
      .populate("originalProgramId", "title duration")
      .populate("extendedProgramId", "title duration")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return extensions;
  } catch (error) {
    throw new Error(`Failed to fetch extensions: ${error.message}`);
  }
};

export const getTotalExtendedDuration = async (userId, originalProgramId) => {
  try {
    const extension = await ProgramExtension.findOne({
      userId,
      originalProgramId,
    });

    if (!extension) {
      return 0;
    }

    return extension.extensionDuration;
  } catch (error) {
    throw new Error(`Failed to calculate total duration: ${error.message}`);
  }
};

// Helper to add days to a date string
const addDaysToDate = (dateString, daysToAdd) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
};

export const shiftExtensionDatesForMissedDays = async (userId, missedDaysCount) => {
  try {
    if (missedDaysCount <= 0) {
      return null;
    }

    // Find pending (non-activated) extension for this user
    const extension = await ProgramExtension.findOne({
      userId,
      isActivated: false,
    });

    if (!extension) {
      return null; // No extension to shift
    }

    // Shift all extension dates by the number of missed days
    extension.originalProgramEndDate = addDaysToDate(
      extension.originalProgramEndDate,
      missedDaysCount
    );
    extension.extendedProgramStartDate = addDaysToDate(
      extension.extendedProgramStartDate,
      missedDaysCount
    );
    extension.extendedProgramEndDate = addDaysToDate(
      extension.extendedProgramEndDate,
      missedDaysCount
    );

    await extension.save();

    return {
      success: true,
      message: `Extension dates shifted by ${missedDaysCount} days`,
      extension,
    };
  } catch (error) {
    throw new Error(
      `Failed to shift extension dates: ${error.message}`
    );
  }
};

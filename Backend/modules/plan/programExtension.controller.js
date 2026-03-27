import * as extensionService from "./programExtension.service.js";

export const extendProgramForUser = async (req, res) => {
  try {
    const { userId, originalProgramId, extendedProgramId, extensionDuration, notes } = req.body;
    const adminId = req.user.id;
    const normalizedExtensionDuration = Number(extensionDuration);

    // Validate required fields
    if (!userId || !originalProgramId || !extendedProgramId || !extensionDuration) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, originalProgramId, extendedProgramId, extensionDuration",
      });
    }

    // Extension duration must be a positive integer
    if (!Number.isInteger(normalizedExtensionDuration) || normalizedExtensionDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Extension duration must be a valid positive number of days",
      });
    }

    // Check if user already has an active extension for this program
    const existingExtension = await extensionService.getExtensionByUserId(userId);
    if (existingExtension && existingExtension.originalProgramId._id.toString() === originalProgramId) {
      return res.status(400).json({
        success: false,
        message: "User already has an active extension for this program",
      });
    }

    // Get current user's program end date
    const User = (await import("../auth/auth.model.js")).default;
    const user = await User.findById(userId).select("programEndDate programType duration");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.programType.toString() !== originalProgramId) {
      return res.status(400).json({
        success: false,
        message: "Current program does not match original program",
      });
    }

    // Only allow extending the same currently assigned program
    if (extendedProgramId !== originalProgramId) {
      return res.status(400).json({
        success: false,
        message: "Only the currently assigned program can be extended",
      });
    }

    const assignedDuration = Number(user.duration);
    if (!Number.isInteger(assignedDuration) || assignedDuration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Assigned program duration is invalid for this user",
      });
    }

    // Extension duration must match the user's assigned program duration
    if (normalizedExtensionDuration !== assignedDuration) {
      return res.status(400).json({
        success: false,
        message: `Extension duration must match assigned plan duration (${assignedDuration} days)`,
      });
    }

    const extension = await extensionService.createProgramExtension({
      userId,
      originalProgramId,
      extendedProgramId,
      extensionDuration: normalizedExtensionDuration,
      originalProgramEndDate: user.programEndDate,
      createdByAdminId: adminId,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Program extension created successfully",
      data: extension,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserExtensions = async (req, res) => {
  try {
    const { userId } = req.params;

    const extensions = await extensionService.getAllUserExtensions(userId);

    return res.status(200).json({
      success: true,
      message: "User extensions fetched successfully",
      data: extensions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExtensionById = async (req, res) => {
  try {
    const { extensionId } = req.params;

    const extension = await extensionService.getExtensionById(extensionId);

    if (!extension) {
      return res.status(404).json({
        success: false,
        message: "Extension not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Extension fetched successfully",
      data: extension,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteExtension = async (req, res) => {
  try {
    const { extensionId } = req.params;

    const extension = await extensionService.deleteExtension(extensionId);

    if (!extension) {
      return res.status(404).json({
        success: false,
        message: "Extension not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Program extension deleted successfully",
      data: extension,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const activateExtensionsCheck = async (req, res) => {
  try {
    const { userId } = req.params;

    const activated = await extensionService.activateExtensionIfDue(userId);

    if (!activated) {
      return res.status(200).json({
        success: true,
        message: "No extension activation due yet",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Extension activated successfully",
      data: activated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

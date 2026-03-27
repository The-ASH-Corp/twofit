import mongoose from "mongoose";

const programExtensionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalProgramId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramsList",
      required: true,
    },
    extendedProgramId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramsList",
      required: true,
    },
    extensionDuration: {
      type: Number, // Must match the user's currently assigned program duration
      required: true,
    },
    originalProgramEndDate: {
      type: String, // Store original end date for reference
      required: true,
    },
    extendedProgramStartDate: {
      type: String, // When the extended program starts (day after original ends)
      required: true,
    },
    extendedProgramEndDate: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: false, // Will be set to true once original program ends and extended program starts
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who created the extension
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one active extension per user per program
programExtensionSchema.index({ userId: 1, originalProgramId: 1 }, { unique: true });

export default mongoose.model("ProgramExtension", programExtensionSchema);

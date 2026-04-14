import mongoose from "mongoose";

const growthSupportSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Founder",
      required: true,
    },
    recipientType: {
      type: String,
      required: true,
      enum: ["admin", "head", "trainer", "dietitian", "therapist","dietician"],
    },
    recipientIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    message: {
      type: String,
      required: true,
    },
    attachments: [
      {
        type: String, // Paths to uploaded files
      },
    ],
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  { timestamps: true },
);

// Note: recipientIds are dynamic refs depending on recipientType.
// Since mongoose doesn't support multiple refs in one array easily without a discriminator,
// we will handle the population logic in the service/controller if needed.

export const GrowthSupportModel = mongoose.model(
  "GrowthSupport",
  growthSupportSchema,
);

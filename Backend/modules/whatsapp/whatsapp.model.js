import mongoose from "mongoose";
import { randomUUID } from "crypto";

const STATUS_VALUES = ["accepted", "sent", "delivered", "read", "failed", "deleted", "unknown"];

const whatsappStatusEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: STATUS_VALUES, required: true },
    timestamp: { type: Date, required: true },
    recipientId: { type: String, default: null },
    conversationId: { type: String, default: null },
    pricingCategory: { type: String, default: null },
    errorCode: { type: String, default: null },
    errorTitle: { type: String, default: null },
    errorMessage: { type: String, default: null },
    source: { type: String, enum: ["send_api", "webhook"], default: "webhook" },
    raw: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { _id: false },
);

const whatsappMessageSchema = new mongoose.Schema(
  {
    trackingId: { type: String, default: () => randomUUID(), unique: true, index: true },
    waMessageId: { type: String, unique: true, sparse: true, index: true },
    recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    recipientPhone: { type: String, required: true, index: true },
    templateName: { type: String, default: null },
    variables: { type: [String], default: [] },
    audienceType: { type: String, enum: ["all", "selected"], default: "selected" },
    broadcastId: { type: mongoose.Schema.Types.ObjectId, ref: "Broadcast", default: null, index: true },
    status: { type: String, enum: STATUS_VALUES, default: "accepted", index: true },
    messageStatusFromSendApi: { type: String, default: null },
    acceptedAt: { type: Date, default: null },
    sentAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    readAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
    lastStatusAt: { type: Date, default: null },
    failureReason: { type: String, default: null },
    failureCode: { type: String, default: null },
    statusEvents: { type: [whatsappStatusEventSchema], default: [] },
    sendApiResponse: { type: mongoose.Schema.Types.Mixed, default: null },
    webhookLastPayload: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

whatsappMessageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 }
);

export const WhatsAppMessage = mongoose.model("WhatsAppMessage", whatsappMessageSchema);

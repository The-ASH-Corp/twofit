import { WhatsAppMessage } from "./whatsapp.model.js";

const NORMAL_STATUS_RANK = {
  accepted: 0,
  sent: 1,
  delivered: 2,
  read: 3,
};

const MAX_STATUS_EVENTS = 50;

const normalizeStatus = (status) => {
  const value = String(status || "").toLowerCase();

  if (["accepted", "sent", "delivered", "read", "failed", "deleted"].includes(value)) {
    return value;
  }

  return "unknown";
};

const parseTimestamp = (timestamp) => {
  const parsed = Number(timestamp);
  if (!Number.isNaN(parsed) && parsed > 0) {
    return new Date(parsed * 1000);
  }

  return new Date();
};

const extractPrimaryError = (errors) => {
  if (!Array.isArray(errors) || errors.length === 0) {
    return {
      code: null,
      title: null,
      message: null,
    };
  }

  const firstError = errors[0] || {};

  return {
    code: firstError.code ? String(firstError.code) : null,
    title: firstError.title || null,
    message: firstError.message || null,
  };
};

const shouldUpgradeStatus = (currentStatus, incomingStatus) => {
  if (incomingStatus === "failed") {
    // Do not override a terminal success state with failed.
    return currentStatus !== "read";
  }

  if (incomingStatus === "deleted") {
    return true;
  }

  const currentRank = NORMAL_STATUS_RANK[currentStatus] ?? -1;
  const incomingRank = NORMAL_STATUS_RANK[incomingStatus] ?? -1;

  return incomingRank >= currentRank;
};

const buildStatusEvent = ({ source = "webhook", status, timestamp, recipientId, conversationId, pricingCategory, errors, raw }) => {
  const error = extractPrimaryError(errors);

  return {
    source,
    status,
    timestamp,
    recipientId: recipientId || null,
    conversationId: conversationId || null,
    pricingCategory: pricingCategory || null,
    errorCode: error.code,
    errorTitle: error.title,
    errorMessage: error.message,
    raw,
  };
};

const applyStatusTimestamps = (doc, status, eventDate) => {
  if (!doc.lastStatusAt || eventDate >= doc.lastStatusAt) {
    doc.lastStatusAt = eventDate;
  }

  if (status === "accepted" && !doc.acceptedAt) {
    doc.acceptedAt = eventDate;
  }

  if (status === "sent" && (!doc.sentAt || eventDate >= doc.sentAt)) {
    doc.sentAt = eventDate;
  }

  if (status === "delivered" && (!doc.deliveredAt || eventDate >= doc.deliveredAt)) {
    doc.deliveredAt = eventDate;
  }

  if (status === "read" && (!doc.readAt || eventDate >= doc.readAt)) {
    doc.readAt = eventDate;
  }

  if (status === "failed" && (!doc.failedAt || eventDate >= doc.failedAt)) {
    doc.failedAt = eventDate;
  }
};

export const trackSendSuccess = async ({
  trackingId = null,
  recipientUserId = null,
  recipientPhone,
  templateName,
  variables = [],
  audienceType = "selected",
  broadcastId = null,
  sendApiResponse = {},
}) => {
  const now = new Date();
  const waMessageId = sendApiResponse?.messages?.[0]?.id || null;
  const sendApiStatus = normalizeStatus(sendApiResponse?.messages?.[0]?.message_status || "accepted");

  const message = await WhatsAppMessage.create({
    ...(trackingId ? { trackingId } : {}),
    waMessageId,
    recipientUserId,
    recipientPhone,
    templateName,
    variables,
    audienceType,
    broadcastId,
    status: sendApiStatus,
    messageStatusFromSendApi: sendApiStatus,
    acceptedAt: now,
    lastStatusAt: now,
    sendApiResponse,
    statusEvents: [
      buildStatusEvent({
        source: "send_api",
        status: sendApiStatus,
        timestamp: now,
        recipientId: recipientPhone,
        raw: sendApiResponse,
      }),
    ],
  });

  return message;
};

export const trackSendFailure = async ({
  trackingId = null,
  recipientUserId = null,
  recipientPhone,
  templateName,
  variables = [],
  audienceType = "selected",
  broadcastId = null,
  error,
}) => {
  const now = new Date();
  const reason = error?.message || "Failed to send WhatsApp message";

  const message = await WhatsAppMessage.create({
    ...(trackingId ? { trackingId } : {}),
    recipientUserId,
    recipientPhone,
    templateName,
    variables,
    audienceType,
    broadcastId,
    status: "failed",
    failedAt: now,
    lastStatusAt: now,
    failureReason: reason,
    statusEvents: [
      buildStatusEvent({
        source: "send_api",
        status: "failed",
        timestamp: now,
        recipientId: recipientPhone,
        errors: [{ message: reason }],
        raw: { error: reason },
      }),
    ],
  });

  return message;
};

const extractWebhookStatuses = (payload = {}) => {
  const events = [];

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change?.value || {};
      const metadata = value?.metadata || null;

      for (const statusObj of value?.statuses || []) {
        events.push({
          ...statusObj,
          metadata,
        });
      }
    }
  }

  return events;
};

const upsertWebhookStatus = async (statusObj = {}) => {
  const waMessageId = statusObj?.id;
  const trackingId = statusObj?.biz_opaque_callback_data || null;

  if (!waMessageId && !trackingId) {
    return { updated: false, reason: "missing_identifiers" };
  }

  const incomingStatus = normalizeStatus(statusObj?.status);
  const eventDate = parseTimestamp(statusObj?.timestamp);
  const recipientId = statusObj?.recipient_id || null;
  const conversationId = statusObj?.conversation?.id || null;
  const pricingCategory = statusObj?.pricing?.category || null;
  const errors = Array.isArray(statusObj?.errors) ? statusObj.errors : [];

  const eventLog = buildStatusEvent({
    source: "webhook",
    status: incomingStatus,
    timestamp: eventDate,
    recipientId,
    conversationId,
    pricingCategory,
    errors,
    raw: statusObj,
  });

  let message = null;

  if (waMessageId) {
    message = await WhatsAppMessage.findOne({ waMessageId });
  }

  if (!message && trackingId) {
    message = await WhatsAppMessage.findOne({ trackingId });
  }

  if (!message) {
    message = await WhatsAppMessage.create({
      ...(trackingId ? { trackingId } : {}),
      waMessageId,
      recipientPhone: recipientId || "unknown",
      status: incomingStatus,
      lastStatusAt: eventDate,
      ...(incomingStatus === "accepted" ? { acceptedAt: eventDate } : {}),
      ...(incomingStatus === "sent" ? { sentAt: eventDate } : {}),
      ...(incomingStatus === "delivered" ? { deliveredAt: eventDate } : {}),
      ...(incomingStatus === "read" ? { readAt: eventDate } : {}),
      ...(incomingStatus === "failed" ? { failedAt: eventDate } : {}),
      ...(incomingStatus === "failed"
        ? {
            failureCode: eventLog.errorCode,
            failureReason: eventLog.errorMessage || eventLog.errorTitle || "Failed by webhook status",
          }
        : {}),
      webhookLastPayload: statusObj,
      statusEvents: [eventLog],
    });

    return {
      updated: true,
      created: true,
      waMessageId: waMessageId || null,
      status: message.status,
    };
  }

  if (!message.waMessageId && waMessageId) {
    message.waMessageId = waMessageId;
  }

  if (!message.trackingId && trackingId) {
    message.trackingId = trackingId;
  }

  message.webhookLastPayload = statusObj;
  message.statusEvents.push(eventLog);
  if (message.statusEvents.length > MAX_STATUS_EVENTS) {
    message.statusEvents = message.statusEvents.slice(-MAX_STATUS_EVENTS);
  }

  if (shouldUpgradeStatus(message.status, incomingStatus)) {
    message.status = incomingStatus;
  }

  applyStatusTimestamps(message, incomingStatus, eventDate);

  if (incomingStatus === "failed") {
    message.failureCode = eventLog.errorCode;
    message.failureReason = eventLog.errorMessage || eventLog.errorTitle || "Failed by webhook status";
  }

  if (!message.recipientPhone && recipientId) {
    message.recipientPhone = recipientId;
  }

  await message.save();

  return {
    updated: true,
    created: false,
    waMessageId: waMessageId || message.waMessageId || null,
    status: message.status,
  };
};

export const processWebhookPayload = async (payload = {}) => {
  const statuses = extractWebhookStatuses(payload);

  if (!statuses.length) {
    return {
      received: true,
      totalEvents: 0,
      updated: 0,
    };
  }

  const results = await Promise.all(statuses.map((statusObj) => upsertWebhookStatus(statusObj)));
  const updated = results.filter((item) => item.updated).length;

  return {
    received: true,
    totalEvents: statuses.length,
    updated,
    results,
  };
};

export const findMessageStatus = async (identifier) => {
  return WhatsAppMessage.findOne({
    $or: [{ waMessageId: identifier }, { trackingId: identifier }],
  }).lean();
};

export const getBroadcastStatusSummary = async (broadcastId) => {
  const docs = await WhatsAppMessage.find({ broadcastId }).lean();

  const counts = docs.reduce(
    (acc, doc) => {
      const status = doc?.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {
      accepted: 0,
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
      deleted: 0,
      unknown: 0,
    },
  );

  return {
    total: docs.length,
    counts,
    items: docs,
  };
};

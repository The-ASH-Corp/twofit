import crypto from "crypto";
import * as whatsappService from "./whatsapp.service.js";

const verifyWebhookSignature = (req) => {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    return true;
  }

  const signature = req.get("x-hub-signature-256");
  if (!signature || !req.rawBody) {
    return false;
  }

  const expected = `sha256=${crypto
    .createHmac("sha256", appSecret)
    .update(req.rawBody)
    .digest("hex")}`;

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
};

export const verifyWebhook = async (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token && expectedToken && token === expectedToken) {
    return res.status(200).send(challenge);
  }

  return res.status(403).json({
    success: false,
    message: "Webhook verification failed",
  });
};

export const receiveWebhook = async (req, res) => {
  try {
    const isSignatureValid = verifyWebhookSignature(req);
    if (!isSignatureValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const result = await whatsappService.processWebhookPayload(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessageStatus = async (req, res) => {
  try {
    const { identifier } = req.params;
    const data = await whatsappService.findMessageStatus(identifier);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Message status not found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBroadcastStatusSummary = async (req, res) => {
  try {
    const { broadcastId } = req.params;
    const data = await whatsappService.getBroadcastStatusSummary(broadcastId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

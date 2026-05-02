import express from "express";
import * as whatsappController from "./whatsapp.controller.js";

const router = express.Router();

router.get("/webhook", whatsappController.verifyWebhook);
router.post("/webhook", whatsappController.receiveWebhook);
router.get("/message-status/:identifier", whatsappController.getMessageStatus);
router.get("/broadcast-status/:broadcastId", whatsappController.getBroadcastStatusSummary);

export default router;

import express from "express";
import * as broadcastController from "./broadcast.controller.js";
import { uploader } from "../../middleware/upload.js";

const router = express.Router();

router.post("/create", uploader.fields([{ name: "attachment", maxCount: 1 }]), broadcastController.createBroadcast);
router.get("/get/:page/:limit/:type", broadcastController.getAllBroadcast);
router.delete("/delete/:id", broadcastController.deleteBroadcast);
router.put("/update/:id", uploader.fields([{ name: "attachment", maxCount: 1 }]), broadcastController.updateBroadcast);
router.get("/get/:id", broadcastController.getBroadcast);
router.post("/sent-whatsapp-message", broadcastController.sentWhatsAppMessage);
router.get("/audience", broadcastController.getBroadcastAudience);

export default router
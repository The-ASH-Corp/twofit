import express from "express";
import * as growthSupportController from "./growthSupport.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { uploader } from "../../middleware/upload.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  uploader.fields([{ name: "attachments", maxCount: 10 }]),
  growthSupportController.createGrowthSupport,
);

router.get(
  "/received",
  authMiddleware,
  growthSupportController.getReceivedSupport,
);

router.patch(
  "/mark-read/:id",
  authMiddleware,
  growthSupportController.markAsRead,
);

export default router;

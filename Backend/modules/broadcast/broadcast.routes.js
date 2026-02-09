import express  from "express";
import * as broadcastController from "./broadcast.controller.js";
import { uploader } from "../../middleware/upload.js";

const router = express.Router();

router.post("/create", uploader.fields([{ name: "attachment", maxCount: 1 }]), broadcastController.createBroadcast);
router.get("/get/:page/:limit/:type", broadcastController.getAllBroadcast);
router.delete("/delete/:id", broadcastController.deleteBroadcast);
router.get("/get/:id", broadcastController.getBroadcast);

export default router
import express from "express";
import { createTherapyController, getAllTherapyController, getATherapyController, uploadMedia } from "./therapy.controller.js";
import { uploader } from "../../middleware/upload.js";
 
const router = express.Router();

router.post("/", createTherapyController);
router.post("/upload-media", uploader.single("file"), uploadMedia);
router.get("/plan/:id", getATherapyController);
router.get("/:page/:limit",getAllTherapyController)
 

export default router;

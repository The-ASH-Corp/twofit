import express from "express";
import { createTherapy } from "./therapy.service.js";
import { createTherapyController, getAllTherapyController, getATherapyController, uploadMedia } from "./therapy.controller.js";
import { uploader } from "../../middleware/upload.js";
 
const router = express.Router();

router.post("/", createTherapyController);
router.post("/upload-media", uploader.single("file"), uploadMedia);
router.get("/:page/:limit",getAllTherapyController)

router.get("/plan/:id", getATherapyController);
 

export default router;

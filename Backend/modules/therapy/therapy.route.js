import express from "express"
import * as therapyController from "./therapy.controller.js"
import { uploader } from "../../middleware/upload.js";

const router = express.Router();

router.post("/create", uploader.single("media"), therapyController.createTherapy);
router.get("/get-all-therapy", therapyController.getAllTherapy);
router.get("/get-therapy/:id", therapyController.getTherapy);
router.put("/update/:id", therapyController.updateTherapy);

export default router
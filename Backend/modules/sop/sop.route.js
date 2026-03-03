import express from "express";
import * as sopController from "./sop.controller.js";

const router = express.Router();

router.post("/assign", sopController.assignSOP);
router.patch("/update/:id", sopController.updateSOP);
router.patch("/deactivate/:id", sopController.deactivateSOP);

router.get("/today", sopController.getTodaySOP);
router.patch("/complete/:sopId", sopController.completeSOP);

router.get("/history/:coachId/:month/:year", sopController.getSOPHistory);

export default router;

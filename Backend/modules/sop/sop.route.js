import express from "express";
import * as sopController from "./sop.controller.js";

const router = express.Router();

router.post("/assign", sopController.assignSOP);
router.patch("/update/:id", sopController.updateSOP);
router.delete("/delete/:id", sopController.deleteSOP);

router.get("/today/:id", sopController.getTodaySOP);
router.patch("/complete/:sopId/:coachId", sopController.completeSOP);

router.get("/history/:coachId/:month/:year", sopController.getSOPHistory);

router.get("/get/:id", sopController.getSOPById)
router.get("/getByCoach/:id", sopController.getSOPByCoach);

export default router;

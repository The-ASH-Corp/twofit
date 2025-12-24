import express from "express"
import * as coachController from "./coach.controller.js"


const router = express.Router();

router.post("/create", coachController.createCoach)
router.get("/get-all-coaches/:page/:limit", coachController.getAllCoach);
router.put("/assign", coachController.AssignCoachToUser);
router.get("/get-coach/:coachId", coachController.getCoachById);
router.put("/update/:coachId", coachController.updateCoachById);
router.delete("/delete/:coachId", coachController.deleteCoachById);
router.get("/assigned-users/:coachId", coachController.getUsersAssignedToACoach);

export default router
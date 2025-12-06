import express from "express"
import * as coachController from "./coach.controller.js"


const router = express.Router();

router.post("/create", coachController.createCoach)
router.get("/list", coachController.getAllCoach);
router.put("/assign", coachController.AssignCoachToUser);
router.get("/get/:coachId", coachController.getCoachById);
router.put("/update/:coachId", coachController.updateCoachById);
router.delete("/delete/:coachId", coachController.deleteCoachById);
router.get("/assigned-users/:coachId", coachController.getUsersAssignedToACoach);

export default router
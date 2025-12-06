import express from "express";
// import { assignPlan, getUserActivePlan } from "../../controllers/workout/AssignController.js";
import * as workoutController from './workout.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { ownershipMiddleware } from "../../middleware/ownershipMiddleware.js";


const router = express.Router();

router.get("/plans", authMiddleware, workoutController.getPlans);
router.get("/plans/:planId", authMiddleware, workoutController.getSinglePlan);
router.post("/plans",authMiddleware, allowRoles("admin", "coach"), workoutController.createPlan);
router.put("/plans/:planId", authMiddleware, allowRoles("admin", "coach"), workoutController.updatePlan);
router.delete("/plans/:planId",authMiddleware, allowRoles("admin"), workoutController.deletePlan);

router.post("/assign", authMiddleware, allowRoles("admin", "coach") , workoutController.assignPlan);
router.get("/user/:userId/active", authMiddleware, ownershipMiddleware, workoutController.getUserActivePlan);


export default router;

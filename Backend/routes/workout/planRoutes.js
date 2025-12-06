// import express from "express";
// import {
//   getPlans,
//   getSinglePlan,
//   createPlan,
//   updatePlan,
//   deletePlan,
// } from '../../controllers/workout/planController.js'
// import { authMiddleware } from '../../middleware/authMiddleware.js'
// import { allowRoles } from "../../middleware/roleMiddleware.js"

// const router = express.Router();

// router.get("/",authMiddleware, getPlans);
// router.get("/:planId", authMiddleware,getSinglePlan);
// router.post("/",authMiddleware, allowRoles("admin", "coach"),createPlan);
// router.put("/:planId", authMiddleware, allowRoles("admin", "coach"),  updatePlan);
// router.delete("/:planId",authMiddleware, allowRoles("admin"),  deletePlan);

// export default router;

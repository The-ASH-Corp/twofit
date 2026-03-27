import express from "express"
import { createNewPlan, getPlanByProgramId, getSinglePlanById, uploadMedia, updatePlan, deletePlan } from "./plan.contoller.js";
import { extendProgramForUser, getUserExtensions, getExtensionById, deleteExtension, activateExtensionsCheck } from "./programExtension.controller.js";
import { uploader } from "../../middleware/upload.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";


const router = express.Router();

router.post("/create-plan", authMiddleware, createNewPlan)
router.post("/upload-media", authMiddleware, uploader.single("file"), uploadMedia);
router.get("/get-plan-by-id/:planId", authMiddleware, getSinglePlanById)
router.get("/get-plan-by-programId/:programId", authMiddleware, getPlanByProgramId)
router.put("/update-plan/:planId", authMiddleware, updatePlan)
router.delete("/delete-plan/:planId", authMiddleware, deletePlan)

// Program Extension Routes (Admin only)
router.post("/extend-program", authMiddleware, allowRoles("admin", "head", "founder"), extendProgramForUser)
router.get("/extensions/user/:userId", authMiddleware, getUserExtensions)
router.get("/extensions/:extensionId", authMiddleware, getExtensionById)
router.delete("/extensions/:extensionId", authMiddleware, allowRoles("admin", "head", "founder"), deleteExtension)
router.post("/extensions/activate/:userId", authMiddleware, activateExtensionsCheck)

export default router
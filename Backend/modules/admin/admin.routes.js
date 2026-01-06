import express from "express";
import * as adminController from "./admin.controller.js"
import { validate } from "../../middleware/validate.js";
import { adminValidationSchema } from "../../validator/admin.validator.js";

const router =express.Router()

router.get("/all-admins/:page/:limit",adminController.getAllAdmins)
router.post("/add-admin",validate(adminValidationSchema),adminController.addAdmin)
router.get("/admin-profile/:id",adminController.getAdminProfile)
router.get("/get-all-coaches-by-admin/:adminId/:page/:limit", adminController.getAllCoachesByAdmin);

export default router;
import express from "express";
import * as payrollController from "./payroll.controller.js"

const router = express.Router();

router.put("/update", payrollController.updatePayroll);
router.get("/get-payroll", payrollController.getPayroll)

export default router;
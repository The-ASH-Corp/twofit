import express from "express";
import * as financeController from "./finance.controller.js"

const router = express.Router();

router.get("/employees/:page/:limit", financeController.employees);
router.get("/employee/history/:page/:limit/:id", financeController.getPayrollHistory);
router.get(
  "/payroll/history/:page/:limit",
  financeController.allPayrollHistory,
);

export default router
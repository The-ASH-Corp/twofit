import express from "express";
import * as financeController from "./finance.controller.js"

const router = express.Router();

router.get("/employees/:page/:limit", financeController.employees);

export default router
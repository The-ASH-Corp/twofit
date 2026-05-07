import express from "express";
import * as controller from "./adjustment.controller.js";

const router = express.Router();

router.post("/create", controller.createAdjustment);
router.get("/:month/:year", controller.getAdjustments);

export default router;

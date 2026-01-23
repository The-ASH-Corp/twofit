import express from "express";
import { createTherapy } from "./therapy.service.js";
import { createTherapyController, getTherapyController } from "./therapy.controller.js";
 
const router = express.Router();

router.post("/", createTherapyController);
router.get("/:id", getTherapyController);
 

export default router;

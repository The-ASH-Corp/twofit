import express from "express";
import {
  createFaqController,
  deleteFaqController,
  getFaqByIdController,
  getFaqsController,
  updateFaqController,
} from "./faq.controller.js";
const router = express.Router();

router.post("/", createFaqController);
router.get("/", getFaqsController);
router.get("/:id", getFaqByIdController);
router.put("/:id", updateFaqController);
router.delete("/:id", deleteFaqController);

export default router;

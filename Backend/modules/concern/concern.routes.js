import express from "express";
import {
  addConcern,
  getConcerns,
  updateConcern,
  deleteConcern,
} from "./concern.controller.js"

import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addConcern);

router.get("/", authMiddleware, getConcerns);

router.put("/:id", authMiddleware, updateConcern);

router.delete("/:id", authMiddleware, deleteConcern);

export default router;

import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { uploader } from "../../middleware/upload.js";
import {
  createRecipeController,
  deleteRecipeController,
  getRecipeByIdController,
  getRecipesController,
  toggleBookmarkController,
  toggleSavedController,
  updateRecipeController,
  uploadRecipeImageController,
} from "./recipe.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getRecipesController);
router.get("/:id", authMiddleware, getRecipeByIdController);
router.post("/", authMiddleware, createRecipeController);
router.put("/:id", authMiddleware, updateRecipeController);
router.delete("/:id", authMiddleware, deleteRecipeController);
router.patch("/:id/toggle-bookmark", authMiddleware, toggleBookmarkController);
router.patch("/:id/toggle-saved", authMiddleware, toggleSavedController);
router.post(
  "/upload-image",
  authMiddleware,
  uploader.single("file"),
  uploadRecipeImageController,
);

export default router;

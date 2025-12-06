import express from "express";
import {
  testimonialController,
  getAllTestimonialsController,
  getSingleTestimonialController,
  updateTestimonialController,
  deleteTestimonialController,
  deleteAllTestimonialController,
} from "./testimonial.controller.js";
import { uploader } from "../../middleware/upload.js";
// import upload from"../../middleware/upload.js";

const router = express.Router();

router.post("/",uploader.single("photo"), testimonialController);
router.get("/", getAllTestimonialsController);
router.get("/:id", getSingleTestimonialController);
router.put("/:id", updateTestimonialController);
router.delete("/:id", deleteTestimonialController);
router.delete('/',deleteAllTestimonialController)

export default router;

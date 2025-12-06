import express from "express";
import * as blogController from "./blog.controller.js";
import { uploader } from "../../middleware/upload.js";

const router = express.Router();

router.post("/create", uploader.single("image") , blogController.createBlog);
router.get("/list", blogController.getAllBlogs);
router.get("/get/:blogId", blogController.getBlogById)
router.put("/update/:blogId", blogController.updateBlogById);
router.delete("/delete/:blogId", blogController.deleteBlogById);

export default router;
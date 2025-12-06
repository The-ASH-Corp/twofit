import mongoose from "mongoose";
import * as blogService from "./blog.service.js";

export const createBlog = async (req, res)=> {
    try {
      console.log(req.file)
        const { heading, description, points } = req.body;
        let parsedPoints = [];
        if (points) {
          try {
            parsedPoints = JSON.parse(points);
          } catch (err) {
            return res.status(400).json({
              success: false,
              message: "Invalid JSON format for points",
            });
          }
        }
         const blogData = {
           heading,
           description,
           image: `/uploads/${req.file.filename}`,
           points: parsedPoints,
         };
        const blog = await blogService.createBlog(blogData);
        res
          .status(201)
          .json({
            success: true,
            message: "Blog created successfully",
            data: blog,
          });
    } catch (error) {
        console.log(error)
    }
}

export const getAllBlogs = async (req, res)=> {
    try {
        const blogs = await blogService.getAllBlogs();
        res.status(200).json({
            success: true,
            data: blogs,
        })
    } catch (error) {
        console.log(error)
    }
}

export const getBlogById = async (req, res)=> {
    try {
        const { blogId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(blogId)){
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID",
            })
        }

        const blog = await blogService.getBlogById(blogId);

        if (!blog) {
          return res.status(404).json({
            success: false,
            message: "Blog not found",
          });
        }

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.log(error)
    }
}

export const updateBlogById = async (req, res)=> {
    try {
        const { blogId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(blogId)){
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID",
            })
        }

        await blogService.updateBlogById( blogId , req.body);
        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteBlogById = async (req, res)=> {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.blogId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid blog ID",
          });
        }

        const data = await blogService.deleteBlogById(req.params.blogId);

        if (!data) {
          return res.status(404).json({
            success: false,
            message: "blog not found",
          });
        }

        res.status(200).json({
            success: true,
            message: "blog deleted successfully"
        })
    } catch (error) {
        console.log(error)
    }
}
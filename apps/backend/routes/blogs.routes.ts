import { Router } from "express";
import {
  deleteBlog,
  getBlogByUser,
  createBlog,
  updateBlog,
  getBlogById,
  toggleBlogStatus,
  getAllPublishedBlogs,
  getPublishedBlogByUser,
} from "../controller/blogs.controller.ts";
const blogRouter = Router();
import upload from "../middleware/multer.middleware.ts";

blogRouter.get("/user/:userId", getBlogByUser);
blogRouter.get("/:blogId", getBlogById);
blogRouter.get("/published/user/:userId", getPublishedBlogByUser);
blogRouter.get("/published", getAllPublishedBlogs);
blogRouter.post("/create", upload.any(), createBlog);
blogRouter.put("/update/:blogId", updateBlog);
blogRouter.delete("/delete/:blogId", deleteBlog);
blogRouter.put("/toggle-status/:blogId", toggleBlogStatus);

export default blogRouter;

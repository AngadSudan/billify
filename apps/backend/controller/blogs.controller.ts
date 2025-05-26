import { ApiResponse } from "../utils/index.ts";
import type { BlogType } from "../models/blog.models.ts";
import User from "../models/user.models.ts";
import Blog from "../models/blog.models.ts";
import { uploadFile, getFileById, deleteFile } from "../utils/fileUpload.ts";
import type { Request, Response } from "express";

export const createBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json(new ApiResponse(401, "Unauthorized", null));
    return;
  }

  const dbUser = await User.findById(user._id);
  if (!dbUser) {
    res.status(404).json(new ApiResponse(404, "User not found", null));
    return;
  }
  if (!req.body || !req.body.blog) {
    res
      .status(400)
      .json(new ApiResponse(400, "Blog content is required", null));
    return;
  }

  const data = req.body;
  let blog = req.body.blog;
  const filesMap: Record<string, Express.Multer.File> = {};
  req.files?.forEach((file: Express.Multer.File) => {
    filesMap[file.fieldname] = file;
  });

  const finalBlocks = await Promise.all(
    blog.map(async (block: any) => {
      if (block.type === "image") {
        const file = filesMap[block.data];
        const uploaded = await uploadFile(file, file?.originalname);
        return { type: "image", data: uploaded.url };
      }
      return block;
    })
  );

  const newBlog: BlogType = {
    title: data.title,
    content: finalBlocks,
    createdBy: req.user._id,
  };

  try {
    const createdBlog = await Blog.create(newBlog);
    res
      .status(201)
      .json(new ApiResponse(201, "Blog created successfully", createdBlog));
    return;
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error", null));
    return;
  }
};
export const deleteBlog = async (req: Request, res: Response) => {
  const user = req.user._id;
  const dbUser = await User.findById(user);
  if (!dbUser) {
    res.status(404).json(new ApiResponse(404, "User not found", null));
    return;
  }

  const blogId = req.params.blogId;
  if (!blogId) {
    res.status(400).json(new ApiResponse(400, "Blog ID is required", null));
    return;
  }

  const dbBlog = await Blog.findById(blogId);
  if (!dbBlog) {
    res.status(404).json(new ApiResponse(404, "Blog not found", null));
    return;
  }

  if (dbBlog.createdBy.toString() !== user.toString()) {
    res
      .status(403)
      .json(
        new ApiResponse(403, "Forbidden: You cannot delete this blog", null)
      );
    return;
  }
  const deletionFileIds = [];
  dbBlog.content.forEach((block) => {
    if (block.type === "image") {
      const fileId = block.data;
      if (fileId) {
        deletionFileIds.push(fileId);
      }
    }
  });
  // try deleting all the fileIDS
  if (deletionFileIds.length > 0) {
    try {
      await Promise.all(deletionFileIds.map((fileId) => deleteFile(fileId)));
    } catch (error) {
      console.error("Error deleting files:", error);
      res.status(500).json(new ApiResponse(500, "Error deleting files", null));
      return;
    }
  }
  try {
    const deleteBlog = await Blog.findByIdAndDelete(blogId);
    res
      .status(200)
      .json(new ApiResponse(200, "Blog deleted successfully", deleteBlog));
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error", null));
    return;
  }
};
export const getBlogByUser = async (req: Request, res: Response) => {
  try {
    const user = req.user._id;
    const dbUser = await User.findById(user);
    if (!dbUser) {
      res.status(200).json(new ApiResponse(404, "User not found", null));
      return;
    }

    const blogs = await Blog.find({ createdBy: user })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!blogs || blogs.length === 0) {
      res.status(200).json(new ApiResponse(404, "No blogs found", null));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Blogs fetched successfully", blogs));
    return;
  } catch (error) {
    console.error("Error fetching blogs by user:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error", null));
    return;
  }
};
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const user = req.user._id;
    const dbUser = await User.findById(user);
    if (!dbUser) {
      res.status(404).json(new ApiResponse(404, "User not found", null));
      return;
    }
    const blogId = req.params.blogId;
    if (!blogId) {
      res.status(400).json(new ApiResponse(400, "Blog ID is required", null));
      return;
    }
    const dbBlog = await Blog.findById(blogId);
    if (!dbBlog) {
      res.status(404).json(new ApiResponse(404, "Blog not found", null));
      return;
    }
    if (dbBlog.createdBy.toString() !== user.toString()) {
      res
        .status(403)
        .json(
          new ApiResponse(403, "Forbidden: You cannot update this blog", null)
        );
      return;
    }
    const data = req.body;
    let blog = data.blog;

    const updatedBlog = await Blog.findByIdAndUpdate(
      dbBlog._id,
      {
        title: data.title,
        content: blog,
      },
      { new: true }
    );

    if (!updatedBlog) {
      res.status(500).json(new ApiResponse(500, "Error updating blog", null));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Blog updated successfully", updatedBlog));
    return;
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error", null));
    return;
  }
};
export const getBlogById = async (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  if (!blogId) {
    res.status(400).json(new ApiResponse(400, "Blog ID is required", null));
    return;
  }

  try {
    const blog = await Blog.findById(blogId).populate(
      "createdBy",
      "name email"
    );

    if (!blog) {
      res.status(404).json(new ApiResponse(404, "Blog not found", null));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Blog fetched successfully", blog));
    return;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error", null));
    return;
  }
};
export const toggleBlogStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user._id;
    const dbUser = await User.findById(user);
    if (!dbUser) {
      res.status(404).json(new ApiResponse(404, "User not found", null));
      return;
    }
    const blogId = req.params.blogId;
    if (!blogId) {
      res.status(400).json(new ApiResponse(400, "Blog ID is required", null));
      return;
    }
    const dbBlog = await Blog.findById(req.params.blogId);
    if (!dbBlog) {
      res.status(404).json(new ApiResponse(404, "Blog not found", null));
      return;
    }

    if (dbBlog.createdBy.toString() !== user.toString()) {
      res
        .status(403)
        .json(
          new ApiResponse(403, "Forbidden: You cannot toggle this blog", null)
        );
      return;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      dbBlog._id,
      {
        isPublished: !dbBlog.isPublished,
      },
      { new: true }
    );
    if (!updatedBlog) {
      res
        .status(500)
        .json(new ApiResponse(500, "Error toggling blog status", null));
      return;
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, "Blog status toggled successfully", updatedBlog)
      );
    return;
  } catch (error) {
    console.error("Error toggling blog status:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error", null));
    return;
  }
};
export const getAllPublishedBlogs = async (req: Request, res: Response) => {
  //TODO: create a blog recommendation system
};
export const getPublishedBlogByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(400).json(new ApiResponse(400, "User ID is required", null));
    return;
  }

  try {
    const blogs = await Blog.find({ createdBy: userId, isPublished: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!blogs || blogs.length === 0) {
      res
        .status(404)
        .json(new ApiResponse(404, "No published blogs found", null));
      return;
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, "Published blogs fetched successfully", blogs)
      );
    return;
  } catch (error) {
    console.error("Error fetching published blogs by user:", error);
    res.status(500).json(new ApiResponse(500, "Internal server error", null));
    return;
  }
};

// formData.append("content", JSON.stringify(contentBlocks));

// Append image files (key must match the temp name above)
// formData.append("file1", selectedImageFile);

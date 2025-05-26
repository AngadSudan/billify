import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: [
      {
        data: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["text", "image", "video", "link"],
          required: true,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
export type BlogType = {
  title: string;
  content: {
    data: string;
    type: "text" | "image" | "video" | "link";
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: mongoose.Types.ObjectId;
  __v?: number;
};

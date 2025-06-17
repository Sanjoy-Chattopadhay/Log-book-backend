import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    wordCount: { type: Number },
    readTime: { type: String },
    tags: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: [
        "Life",
        "Tech",
        "Travel",
        "Career",
        "Education",
        "Productivity",
        "Other",
      ],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;

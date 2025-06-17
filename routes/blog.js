import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

// Utility to create a blog
const createBlogHandler = async (req, res) => {
  try {
    const { title, summary, content, author, tags, category } = req.body;

    const requiredFields = [
      "title",
      "summary",
      "content",
      "author",
      "tags",
      "category",
    ];
    const missing = requiredFields.filter((field) => !req.body[field]);

    if (missing.length) {
      return res
        .status(400)
        .json({ error: `Missing fields: ${missing.join(", ")}` });
    }

    const validCategories = [
      "Life",
      "Tech",
      "Travel",
      "Career",
      "Education",
      "Productivity",
      "Other",
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const wordCount = content.trim().split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

    const cleanedTags = Array.isArray(tags)
      ? tags.map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    const newBlog = new Blog({
      title,
      summary,
      content,
      author,
      tags: cleanedTags,
      category,
      wordCount,
      readTime,
    });

    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new blog (form or popup submit)
router.post("/", createBlogHandler);
router.post("/create-blog", createBlogHandler); // alternative endpoint (used by popup)

// DELETE blog by ID (protected with password)
router.post("/delete/:id", async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  const correctPassword = "admin123"; // Replace with process.env in production

  if (password !== correctPassword) {
    return res.status(403).json({ success: false, message: "Wrong password" });
  }

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Deletion failed",
      error: err.message,
    });
  }
});

export default router;

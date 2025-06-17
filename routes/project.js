import express from "express";
import Project from "../models/Project.js";
import Comment from "../models/Comment.js";

const router = express.Router();

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching projects" });
  }
});

// POST new project
router.post("/", async (req, res) => {
  try {
    const { title, description, link, tags, techStack, status } = req.body;

    // Required field check
    const requiredFields = ["title", "description", "link"];
    const missing = requiredFields.filter((field) => !req.body[field]);
    if (missing.length) {
      return res
        .status(400)
        .json({ error: `Missing required fields: ${missing.join(", ")}` });
    }

    // Read time estimate from description (optional)
    const wordCount = description.trim().split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

    const project = new Project({
      title,
      description,
      link,
      tags: tags?.map((t) => t.trim()) || [],
      techStack: techStack?.map((t) => t.trim()) || [],
      status: status || "Ongoing",
      wordCount,
      readTime,
    });

    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// GET single project + comments
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const comments = await Comment.find({ projectId: project._id }).sort({
      createdAt: -1,
    });

    res.json({ project, comments });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST new comment
// router.post("/:id/comment", async (req, res) => {
//   const { author, content } = req.body;
//   try {
//     const comment = new Comment({
//       projectId: req.params.id,
//       author,
//       content,
//     });
//     const saved = await comment.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid comment data" });
//   }
// });
// POST new comment
router.post("/:id/comment", async (req, res) => {
  const { author, content } = req.body;
  try {
    // Optional: verify project exists before commenting
    const projectExists = await Project.exists({ _id: req.params.id });
    if (!projectExists) {
      return res.status(404).json({ error: "Project not found" });
    }

    const comment = new Comment({
      projectId: req.params.id, // ✅ Correct field name
      author,
      content,
    });
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Comment creation failed:", err.message);
    res
      .status(400)
      .json({ error: "Invalid comment data", details: err.message });
  }
});

// DELETE project directly (no password check — for admin only!)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error during deletion" });
  }
});

export default router;

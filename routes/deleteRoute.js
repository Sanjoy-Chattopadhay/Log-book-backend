// server/routes/deleteRoute.js
import express from "express";
import Blog from "../models/Blog.js";
import Article from "../models/Article.js";
import Project from "../models/Project.js";

const router = express.Router();

const PASSWORD = process.env.DELETE_PASSWORD || "sanjoyDeleteKey"; // Store securely in production

const modelMap = {
  blog: Blog,
  article: Article,
  project: Project,
};

router.post("/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  const { password } = req.body;

  if (password !== PASSWORD) {
    return res.status(403).json({ success: false, message: "Wrong password" });
  }

  const Model = modelMap[type];
  if (!Model)
    return res.status(400).json({ success: false, message: "Invalid type" });

  try {
    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: `${type} not found` });
    }
    res.json({ success: true, message: `${type} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting" });
  }
});
// routes/delete.js
router.post("/article/:id", async (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.json({ success: false });
  }
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

export default router;

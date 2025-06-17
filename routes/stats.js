import express from "express";
import Project from "../models/Project.js";
import Blog from "../models/Blog.js";
import Article from "../models/Article.js";

const router = express.Router();

router.get("/count-all", async (req, res) => {
  try {
    const [projectCount, blogCount, articleCount] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Article.countDocuments(),
    ]);

    const total = projectCount + blogCount + articleCount;

    res.json({
      projects: projectCount,
      blogs: blogCount,
      articles: articleCount,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
});

export default router;

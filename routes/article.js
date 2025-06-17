import express from "express";
import mongoose from "mongoose";
import Article from "../models/Article.js";

const router = express.Router();

// GET all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error("🔥 Error fetching articles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new article
router.post("/", async (req, res) => {
  try {
    // console.log("📥 Incoming article data:", req.body);
    const { title, summary, content, author, tag, category } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!summary) missingFields.push("summary");
    if (!content) missingFields.push("content");
    if (!author) missingFields.push("author");
    if (!tag) missingFields.push("tag");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const validCategories = [
      "Web Development",
      "Machine Learning",
      "Blockchain",
      "Programming",
      "Data Science",
      "System Design",
      "Competitive Coding",
      "Open Source",
      "Other",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: `Invalid category: ${category}` });
    }

    const wordCount = content.trim().split(/\s+/).length || 0;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

    const article = new Article({
      title,
      summary,
      content,
      author,
      tag: Array.isArray(tag) ? tag : [], // ✅ Ensure tag is an array
      category,
      wordCount,
      readTime,
    });

    const saved = await article.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("🔥 Error in POST /article:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// GET article by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error("🔥 Error in GET /article/:id:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

export default router;

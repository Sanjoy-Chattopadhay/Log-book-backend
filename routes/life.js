// routes/life.js
import express from "express";
import Life from "../models/Life.js";

const router = express.Router();

// GET all life entries
router.get("/", async (req, res) => {
  try {
    const entries = await Life.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error("Error fetching life entries:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new life entry
router.post("/", async (req, res) => {
  try {
    const { title, snippet, content, mood } = req.body;

    if (!title || !snippet || !content || !mood) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const entry = new Life({ title, snippet, content, mood });
    const saved = await entry.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving life entry:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a single life entry
router.get("/:id", async (req, res) => {
  try {
    const entry = await Life.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(entry);
  } catch (err) {
    console.error("Error fetching single life entry:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

// routes/archivestats.js
import express from "express";
import Article from "../models/Article.js";
import Blog from "../models/Blog.js";
import Project from "../models/Project.js";
import Life from "../models/Life.js";

const router = express.Router();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generic aggregation function
const aggregateByMonth = async (Model) => {
  return await Model.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

router.get("/archive-counts", async (req, res) => {
  try {
    // Aggregate each model
    const [articles, blogs, projects, lives] = await Promise.all([
      aggregateByMonth(Article),
      aggregateByMonth(Blog),
      aggregateByMonth(Project),
      aggregateByMonth(Life),
    ]);

    // Combine all into one array
    const combined = [...articles, ...blogs, ...projects, ...lives];

    // Merge monthly counts
    const merged = {};
    combined.forEach(({ _id, count }) => {
      const key = `${_id.year}-${_id.month}`;
      if (!merged[key]) {
        merged[key] = { year: _id.year, month: _id.month, count: 0 };
      }
      merged[key].count += count;
    });

    // Format and sort
    const result = Object.values(merged)
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      })
      .slice(0, 5) // limit to latest 5
      .map(({ year, month, count }) => ({
        month: `${months[month - 1]} ${year}`,
        count,
      }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching archive counts:", err);
    res.status(500).json({ error: "Failed to fetch archive counts" });
  }
});

router.get("/all-tags", async (req, res) => {
  try {
    const [articles, blogs, projects, lives] = await Promise.all([
      Article.find({}, "tags"),
      Blog.find({}, "tags"),
      Project.find({}, "tags"),
      Life.find({}, "tags"),
    ]);

    const tagCountMap = new Map();

    const allDocs = [...articles, ...blogs, ...projects, ...lives];

    allDocs.forEach((doc) => {
      if (Array.isArray(doc.tags)) {
        doc.tags.forEach((tag) => {
          const trimmed = tag.trim();
          tagCountMap.set(trimmed, (tagCountMap.get(trimmed) || 0) + 1);
        });
      }
    });

    const tagArray = Array.from(tagCountMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag)); // optional alphabetical sort

    res.json(tagArray);
  } catch (err) {
    console.error("Error fetching tag counts:", err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

export default router;

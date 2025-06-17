import express from "express";
import CommunityPost from "../models/CommunityPost.js";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Create a post
router.post("/", async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = new CommunityPost({ author, content });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: "Failed to create post" });
  }
});

// Like a post
router.post("/:id/like", async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: "Failed to like post" });
  }
});

// Dislike a post
router.post("/:id/dislike", async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.dislikes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: "Failed to dislike post" });
  }
});

export default router;

import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    wordCount: { type: Number },
    readTime: { type: String },
    tag: { type: [String], required: true }, // Changed from String to array
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Machine Learning",
        "Blockchain",
        "Programming",
        "Data Science",
        "System Design",
        "Competitive Coding",
        "Open Source",
        "Other",
      ],
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;

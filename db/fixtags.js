import mongoose from "mongoose";

// Replace with your actual MongoDB URI
const MONGO_URI = "mongodb+srv://root:root@cluster0.r5c7q0d.mongodb.net/";

const blogSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    content: String,
    author: String,
    wordCount: Number,
    readTime: String,
    tag: mongoose.Schema.Types.Mixed, // previously used
    tags: [String], // new structure
    category: String,
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

const fixBlogTags = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find blogs where tag is a string and tags field is not yet populated
    const stringTagDocs = await Blog.find({ tag: { $type: "string" } });

    console.log(
      `🔍 Found ${stringTagDocs.length} blog documents with string 'tag' field.`
    );

    for (const doc of stringTagDocs) {
      const tagArray = doc.tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await Blog.updateOne(
        { _id: doc._id },
        { $set: { tags: tagArray }, $unset: { tag: "" } }
      );
      console.log(`✅ Updated blog ${doc._id} → tags:`, tagArray);
    }

    console.log("🎉 Blog tag conversion complete.");
    mongoose.disconnect();
  } catch (err) {
    console.error("🔥 Error fixing blog tags:", err);
    mongoose.disconnect();
  }
};

fixBlogTags();

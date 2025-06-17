// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db/connection.js";
import blogRoutes from "./routes/blog.js";
import articleRoutes from "./routes/article.js";
import projectRoutes from "./routes/project.js";
import statsRoutes from "./routes/stats.js";
import lifeRoutes from "./routes/life.js";
import archiveStats from "./routes/archivestats.js";
import communityRoutes from "./routes/community.js";
import deleteRoute from "./routes/deleteRoute.js"; // ✅ Correct import

dotenv.config();

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await dbConnect();
    console.log("✅ Connected to MongoDB Atlas");

    app.use("/blog", blogRoutes);
    app.use("/article", articleRoutes);
    app.use("/stats", statsRoutes);
    app.use("/project", projectRoutes);
    app.use("/life", lifeRoutes);
    app.use("/archivestats", archiveStats);
    app.use("/community", communityRoutes);

    app.use("/api/delete", deleteRoute); // ✅ Only one registration

    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server listening at http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();

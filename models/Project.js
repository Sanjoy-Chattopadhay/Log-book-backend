import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    tags: [String],
    techStack: [String], // e.g., ["React", "Node", "MongoDB"]
    status: {
      type: String,
      default: "Ongoing",
      enum: ["Ongoing", "Completed", "Stalled"],
    },
    wordCount: Number,
    readTime: String,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;

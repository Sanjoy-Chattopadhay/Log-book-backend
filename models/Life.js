// models/Life.js
import mongoose from "mongoose";

const lifeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    snippet: { type: String, required: true },
    content: { type: String, required: true },
    mood: {
      type: String,
      required: true,
      enum: ["Happy", "Sad", "Reflective", "Excited", "Grateful", "Other"],
    },
  },
  { timestamps: true }
);

const Life = mongoose.model("Life", lifeSchema);
export default Life;

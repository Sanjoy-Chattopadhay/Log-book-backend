import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function dbConnect() {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas via Mongoose");
  } catch (err) {
    console.error("❌ Mongoose connection failed:", err.message);
  }
}

import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema({
  author: String,
  content: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }, // ✅ Make sure this is included
  createdAt: { type: Date, default: Date.now },
});

const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);
export default CommunityPost;

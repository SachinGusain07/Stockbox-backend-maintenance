import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  kind: { type: String, default: "blogger#post" },
  postId: { type: String, unique: true, required: true },
  blogId: { type: String, required: true },
  published: { type: Date, required: true },
  updated: { type: Date, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    id: { type: String },
     displayName: { type: String, default: "Stock Box" },
    url: { type: String },
    imageUrl: { type: String },
  },
  keywords: { type: [String], default: [] },
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  replies: {
    totalItems: { type: Number, default: 0 },
    selfLink: { type: String, default: "" },
  },
  etag: { type: String, required: true },
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;

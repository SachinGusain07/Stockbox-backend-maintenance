// import mongoose from "mongoose";

// const blogSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, unique: true },
//     slug: { type: String, required: true, unique: true },
//     thumbImage: {
//       public_id: { type: String, required: true },
//       secure_url: { type: String, required: true },
//     },
//     content: { type: String, required: true },
//     author: { type: String, required: true, default: "stock" },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "BlogCategory",
//       required: true,
//     },
//     date:{type:String, required:true},
//     //tags: [String], Can make different endpoint. Will do it later if needed.
//   },
//   {
//     timestamps: { createdAt: "publishedAt", updatedAt: "updatedAt" },
//   }
// );

// const Bloging = mongoose.model("Bloging", blogSchema);

// export default Bloging;

import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    
    // Media & Visuals
    thumbImage: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
    imageAlt: { 
      type: String, 
      required: [true, "Image alt text is required for SEO/Accessibility"],
      default: "StockBox Research & Analysis"
    },
    joditImages: [
      {
        url: { type: String },
        public_id: { type: String },
      }
    ],

    // Content Body & AI Extracts
    content: { type: String, required: true },
    tldr: { 
      type: String, 
      trim: true,
      maxlength: 500,
      description: "Key Takeaways / TL;DR for AEO & Quick summaries"
    },
    readTime: { type: Number, default: 3 }, // In minutes

    // Author & Taxonomy
    author: { type: String, required: true, default: "StockBox Research Analyst" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
      index: true,
    },
    tags: [{ type: String, trim: true }],

    // Essential SEO, AEO & GEO Metadata
    metaTitle: { 
      type: String, 
      trim: true,
      maxlength: 70 
    },
    metaDescription: { 
      type: String, 
      trim: true,
      maxlength: 160 
    },
    canonicalUrl: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    schemaType: {
      type: String,
      enum: ["BlogPosting", "NewsArticle", "TechArticle"],
      default: "BlogPosting",
    },
    faqs: [faqSchema],

    // Publishing States
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published",
      index: true,
    },
    publishedAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound index for category page lookups ordered by publication date
blogSchema.index({ category: 1, publishedAt: -1 });

// Helper to auto-calculate reading time if not supplied (~200 words per minute)
blogSchema.pre("save", function (next) {
  if (this.content && !this.readTime) {
    const cleanText = this.content.replace(/<[^>]*>?/gm, "");
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    this.readTime = Math.ceil(wordCount / 200) || 1;
  }
  next();
});

const Bloging = mongoose.models.Bloging || mongoose.model("Bloging", blogSchema);
export default Bloging;

// import Bloging from "../../models/blog/blog.js";
// import BlogCategory from "../../models/blog/blogCategory.js";
// import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../utils/Cloudinary.js";
  
// import ApiError from "../../utils/ErrorResponse/ApiError.js";
// import { ApiResponse } from "../../utils/ErrorResponse/ApiResponse.js";
// import { asyncHandler } from "../../utils/ErrorResponse/asyncHandler.js";
// import { paginate } from "../../utils/ErrorResponse/Pagination.js";
  
 
  
//   // Create a new blog post
//   export const createBlog = asyncHandler(async (req, res, next) => {
//     const thumbImage = req.file;
//     let thumbImageResponse = null;  
//     console.log(thumbImage, "thumbImage");
    
//     if (thumbImage) {
//       thumbImageResponse = await uploadFileToCloudinary(thumbImage, "Blogs"); // Res-> [{}]
//     }
//     console.log(thumbImageResponse.secure_url, "thumbImageResponse");
  
//     // Check if category exists
//     const categoryExists = await BlogCategory.findById(req.body.category);
//     if (!categoryExists) {
//       return next(new ApiError("Invalid category ID", 400));
//     }
  
//     // Create a new blog post
//     const blog = await Bloging.create({
//       ...req.body,
//       thumbImage:{
//         secure_url: thumbImageResponse.secure_url ,
//         public_id: thumbImageResponse.public_id,
//       } || null, // If no image null will set, undefined ignored the field
//     });
  
//     if (!blog) {
//       return next(new ApiError("Failed to create the blog post", 400));
//     }
  
//     return res
//       .status(201)
//       .json(new ApiResponse("Created the blog post successfully", blog));
//   });
  
//   // Get all blog posts
//   export const getAllBlogs = asyncHandler(async (req, res, next) => {
//     const page = parseInt(req.query.page || "1");
//     const limit = parseInt(req.query.limit || "10");
//     const { category, search } = req.query;
  
//     // Set up filter object for the paginate function
//     const filter = {};
//     if (category) {
//       filter.category = category; // Assuming category is stored as an ID reference in Blog model
//     }
  
//     // If a search term is provided, add it to the filter for title
//     if (search) {
//       filter.title = { $regex: search, $options: "i" };
//     }
  
//     // Use the pagination utility function
//     const { data: blogs, pagination } = await paginate(
//         Bloging,
//       page,
//       limit,
//       [
//         { path: "author", select: "fullName email" },
//         { path: "category", select: "blogCategoryName" },
//       ],
//       filter,
//     "-publishedAt"
//     );
  
//     // Check if no blogs found
//     if (!blogs || blogs.length === 0) {
//       return next(new ApiError("No blogs found", 404));
//     }
  
//     // Return paginated response with ApiResponse
//     return res
//       .status(200)
//       .json(
//         new ApiResponse("Fetched all blog posts successfully", blogs, pagination)
//       );
//   });
  
//   // Get a single blog post by ID
//   export const getBlogById = asyncHandler(async (req, res, next) => {
//     const blog = await Bloging.findById(req.params.id)
//       .populate("author", "fullName email role")
//       .populate("category", "blogCategoryName");
  
//     if (!blog) {
//       return next(new ApiError("Blog post not found", 404));
//     }
  
//     return res
//       .status(200)
//       .json(new ApiResponse("Fetched the blog post successfully", blog));
//   });


// export const getBlogBySlug = asyncHandler(async (req, res, next) => {
//   const blog = await Bloging.findOne({ slug: req.params.slug })
//     .populate("category", "blogCategoryName");

//   if (!blog) {
//     return next(new ApiError("Blog post not found with the given slug", 404));
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse("Fetched the blog post by slug successfully", blog));
// });


  
//   // Update a blog post
//   export const updateBlogById = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const thumbImage = req.file;
  
//     const existingBlog = await Bloging.findById(id);
//     if (!existingBlog) {
//       return next(new ApiError("Blog post not found", 404));
//     }
  
//     let thumbImageResponse = null;
  
//     if (thumbImage) {
//       try {
//         thumbImageResponse = await uploadFileToCloudinary(thumbImage, "Blogs");
//         console.log(thumbImageResponse, "thumbImageResponse");
  
//         if (existingBlog.thumbImage?.public_id) {
//           await deleteFileFromCloudinary(existingBlog.thumbImage.public_id);
//           console.log("Old image deleted from Cloudinary:", existingBlog.thumbImage.public_id);
//         }
//       } catch (error) {
//         console.error("Image handling error:", error);
//         return next(new ApiError("Error uploading or deleting image", 500));
//       }
//     }
  
//     const blogData = { ...req.body };
  
//     // If you store thumbImage as just a URL
//     if (thumbImageResponse) {
//       blogData.thumbImage ={
//         public_id: thumbImageResponse.public_id,
//         secure_url: thumbImageResponse.secure_url
//       }
//     }
  
//     const updatedBlog = await Bloging.findByIdAndUpdate(id, blogData, {
//       new: true,
//       runValidators: true,
//     });
  
//     if (!updatedBlog) {
//       return next(new ApiError("Blog post update failed", 404));
//     }
  
//     return res
//       .status(200)
//       .json(new ApiResponse("Updated the blog post successfully", updatedBlog));
//   });
  
  
//   // Delete a blog post
//   export const deleteBlogbyId = asyncHandler(async (req, res, next) => {
//     const deletedBlog = await Bloging.findByIdAndDelete(req.params.id);
  
//     if (!deletedBlog) {
//       return next(new ApiError("Blog post not found", 404));
//     }
  
//     // Delete images from Cloudinary
//     if (deletedBlog?.thumbImage)
//       await deleteFileFromCloudinary(deletedBlog.thumbImage);
  
//     return res
//       .status(200)
//       .json(new ApiResponse("Deleted the blog post successfully"));
//   });
  
//   // Get recent blog posts
//   export const getRecentBlogs = asyncHandler(async (req, res, next) => {
//     const { limit = 5 } = req.query; // Default limit to 5 if not provided
  
//     // Fetch recent blogs based on publication date
//     const recentBlogs = await Bloging.find()
//       .populate("author", "name email")
//       .populate("category", "blogCategoryName")
//       .sort({ publishedAt: -1 }) // Sort by latest published
//       .limit(Number(limit)); // Limit number of results
  
//     return res
//       .status(200)
//       .json(
//         new ApiResponse("Fetched recent blog posts successfully", recentBlogs)
//       );
//   });



// export const searchBlogsController = asyncHandler(async (req, res, next) => {
//   const page = parseInt(req.query.page || "1");
//   const limit = parseInt(req.query.limit || "10");
//   const query = req.query.q || "";

//   const filter = {
//     title: { $regex: query, $options: "i" }
//   };

//   const { data: blogs, pagination } = await paginate(
//     Bloging,
//     page,
//     limit,
//     [
//       { path: "author", select: "fullName" },
//       { path: "category", select: "blogCategoryName" },
//     ],
//     filter,
//     // "-publishedAt" // Newest first based on your schema timestamp
//   );

//   const data = {
//     data :blogs ,
//     metadata : pagination

//   }

//   return res.status(200).json(
//     new ApiResponse("Search results fetched", data)
//   );
// });


import Bloging from "../../models/blog/blog.js";
import BlogCategory from "../../models/blog/blogCategory.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../utils/Cloudinary.js";
import ApiError from "../../utils/ErrorResponse/ApiError.js";
import { ApiResponse } from "../../utils/ErrorResponse/ApiResponse.js";
import { asyncHandler } from "../../utils/ErrorResponse/asyncHandler.js";
import { paginate } from "../../utils/ErrorResponse/Pagination.js";

// Helper to safely parse JSON strings sent from FormData
const safeParse = (data, fallback = []) => {
  if (!data) return fallback;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

// 1. Create a new blog post
export const createBlog = asyncHandler(async (req, res, next) => {
  const thumbImage = req.file;
  if (!thumbImage) {
    return next(new ApiError("Thumbnail image is required for SEO & preview cards", 400));
  }

  // Validate category
  const categoryExists = await BlogCategory.findById(req.body.category);
  if (!categoryExists) {
    return next(new ApiError("Invalid category ID provided", 400));
  }

  // Upload thumbnail to Cloudinary
  const thumbImageResponse = await uploadFileToCloudinary(thumbImage, "Blogs");
  if (!thumbImageResponse?.secure_url) {
    return next(new ApiError("Thumbnail image upload failed", 500));
  }

  // Parse JSON/Array fields from FormData
  const faqs = safeParse(req.body.faqs, []);
  const tags = safeParse(req.body.tags, typeof req.body.tags === "string" ? req.body.tags.split(",").map(t => t.trim()) : []);
  const keywords = safeParse(req.body.keywords, typeof req.body.keywords === "string" ? req.body.keywords.split(",").map(k => k.trim()) : []);
  const joditImages = safeParse(req.body.joditImages, []);

  // Compute read time if content exists
  const cleanText = (req.body.content || "").replace(/<[^>]*>?/gm, "");
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const calculatedReadTime = Math.ceil(wordCount / 200) || 1;

  const blog = await Bloging.create({
    ...req.body,
    faqs,
    tags,
    keywords,
    joditImages,
    readTime: req.body.readTime || calculatedReadTime,
    metaTitle: req.body.metaTitle || req.body.title,
    metaDescription: req.body.metaDescription || (cleanText.substring(0, 155) + "..."),
    publishedAt: req.body.date ? new Date(req.body.date) : new Date(),
    thumbImage: {
      secure_url: thumbImageResponse.secure_url,
      public_id: thumbImageResponse.public_id,
    },
  });

  return res.status(201).json(new ApiResponse("Blog post created successfully", blog));
});

// 2. Get all blog posts (Supports category, pagination, newest first)
export const getAllBlogs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);
  const { category, search, status } = req.query;

  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const { data: blogs, pagination } = await paginate(
    Bloging,
    page,
    limit,
    [
      { path: "category", select: "blogCategoryName slug" },
    ],
    filter,
    "-publishedAt -createdAt"
  );

  return res.status(200).json(
    new ApiResponse("Fetched all blog posts successfully", blogs, pagination)
  );
});

// 3. Get single blog by Slug (Primary for SEO pages & crawlers)
export const getBlogBySlug = asyncHandler(async (req, res, next) => {
  const blog = await Bloging.findOne({ slug: req.params.slug })
    .populate("category", "blogCategoryName slug");

  if (!blog) {
    return next(new ApiError("Blog post not found with the given slug", 404));
  }

  return res.status(200).json(new ApiResponse("Fetched blog post successfully", blog));
});

// 4. Get single blog by ID (For Admin editor)
export const getBlogById = asyncHandler(async (req, res, next) => {
  const blog = await Bloging.findById(req.params.id)
    .populate("category", "blogCategoryName slug");

  if (!blog) {
    return next(new ApiError("Blog post not found", 404));
  }

  return res.status(200).json(new ApiResponse("Fetched blog post successfully", blog));
});

// 5. Update blog post
export const updateBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const thumbImage = req.file;

  const existingBlog = await Bloging.findById(id);
  if (!existingBlog) {
    return next(new ApiError("Blog post not found", 404));
  }

  const blogData = { ...req.body };

  // Handle Image Replacement
  if (thumbImage) {
    const thumbImageResponse = await uploadFileToCloudinary(thumbImage, "Blogs");
    if (existingBlog.thumbImage?.public_id) {
      await deleteFileFromCloudinary(existingBlog.thumbImage.public_id);
    }
    blogData.thumbImage = {
      public_id: thumbImageResponse.public_id,
      secure_url: thumbImageResponse.secure_url,
    };
  }

  // Parse structured data safely
  if (req.body.faqs) blogData.faqs = safeParse(req.body.faqs, existingBlog.faqs);
  if (req.body.tags) blogData.tags = safeParse(req.body.tags, existingBlog.tags);
  if (req.body.keywords) blogData.keywords = safeParse(req.body.keywords, existingBlog.keywords);
  if (req.body.joditImages) blogData.joditImages = safeParse(req.body.joditImages, existingBlog.joditImages);

  if (req.body.date) {
    blogData.publishedAt = new Date(req.body.date);
  }

  const updatedBlog = await Bloging.findByIdAndUpdate(id, blogData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(new ApiResponse("Updated blog post successfully", updatedBlog));
});

// 6. Delete blog post
export const deleteBlogbyId = asyncHandler(async (req, res, next) => {
  const deletedBlog = await Bloging.findByIdAndDelete(req.params.id);

  if (!deletedBlog) {
    return next(new ApiError("Blog post not found", 404));
  }

  if (deletedBlog?.thumbImage?.public_id) {
    await deleteFileFromCloudinary(deletedBlog.thumbImage.public_id);
  }

  return res.status(200).json(new ApiResponse("Deleted blog post successfully"));
});

// 7. Get Recent Blogs (Optimized for sidebar and widgets)
export const getRecentBlogs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit || "5", 10);

  const recentBlogs = await Bloging.find({ status: "published" })
    .select("title slug thumbImage imageAlt publishedAt author readTime category")
    .populate("category", "blogCategoryName")
    .sort({ publishedAt: -1 })
    .limit(limit);

  return res.status(200).json(
    new ApiResponse("Fetched recent blog posts successfully", recentBlogs)
  );
});

// 8. Sitemap Endpoint (Direct raw data feeder for XML crawlers)
export const getSitemapData = asyncHandler(async (req, res) => {
  const blogs = await Bloging.find({ status: "published" })
    .select("slug updatedAt publishedAt")
    .sort({ publishedAt: -1 });

  return res.status(200).json(new ApiResponse("Sitemap data fetched", blogs));
});







export const searchBlogsController = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");
  const query = req.query.q || "";

  const filter = {
    title: { $regex: query, $options: "i" }
  };

  const { data: blogs, pagination } = await paginate(
    Bloging,
    page,
    limit,
    [
      { path: "author", select: "fullName" },
      { path: "category", select: "blogCategoryName" },
    ],
    filter,
    // "-publishedAt" // Newest first based on your schema timestamp
  );

  const data = {
    data :blogs ,
    metadata : pagination

  }

  return res.status(200).json(
    new ApiResponse("Search results fetched", data)
  );
});


// controllers/blog/blogController.js

// // Get blogs by category with NEWEST FIRST sorting and server-side pagination
// export const getBlogsByCategory = asyncHandler(async (req, res, next) => {
//   const { categoryId } = req.params;
//   const page = parseInt(req.query.page || "1", 10);
//   const limit = parseInt(req.query.limit || "10", 10);

//   // Validate category existence
//   const categoryExists = await BlogCategory.findById(categoryId);
//   if (!categoryExists) {
//     return next(new ApiError("Blog category not found", 404));
//   }

//   const filter = {
//     category: categoryId,
//     status: "published", // Only return live articles
//   };

//   // CRITICAL FIX: Sort by publishedAt: -1 (newest date first)
//   // If publishedAt is identical, fallback to createdAt: -1 and _id: -1
//   const { data: blogs, pagination } = await paginate(
//     Bloging,
//     page,
//     limit,
//     [
//       { path: "category", select: "blogCategoryName slug" },
//     ],
//     filter,
//     "-publishedAt -createdAt -_id" // <--- SORTS NEWEST FIRST
//   );

//   return res.status(200).json(
//     new ApiResponse("Blogs fetched successfully", blogs, pagination)
//   );
// });

// Get blogs by category with fallback for status
export const getBlogsByCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);

  // Validate category existence
  const categoryExists = await BlogCategory.findById(categoryId);
  if (!categoryExists) {
    return next(new ApiError("Blog category not found", 404));
  }

  // Allow published or documents where status hasn't been set yet
  const filter = {
    category: categoryId,
    $or: [{ status: "published" }, { status: { $exists: false } }],
  };

  const { data: blogs, pagination } = await paginate(
    Bloging,
    page,
    limit,
    [{ path: "category", select: "blogCategoryName slug" }],
    filter,
    "-publishedAt -createdAt -_id"
  );

  return res.status(200).json(
    new ApiResponse("Blogs fetched successfully", blogs, pagination)
  );
});
export const getSitemapXml = asyncHandler(async (req, res) => {
  const BASE_URL = "https://www.stockboxtech.com";

  const blogs = await Bloging.find({ status: "published" })
    .select("slug updatedAt publishedAt")
    .sort({ publishedAt: -1 });

  const staticRoutes = [
    "/",
    "/blogs",
    "/about-us",
    "/contact-us",
    "/expert-advice",
    "/portfolio-screener",
    "/readymade-stockbox",
    "/stock-screener",
    "/portfolio-hedger",
    "/fii-dii-investments",
    "/researchReport",
    "/commodity",
    "/stockideas",
    "/options",
    "/trading-mentorship-program",
    "/advance-training/training",
    "/Download",
    "/careers",
    "/media",
    "/partner-with-us",
    "/comapny-ipos",
    "/FAQ",
    "/privacy-policy",
    "/terms-conditions",
    "/regulatory-details",
    "/grievancepolicy",
    "/compliance-audit-status",
    "/Stock-Market-Tips-Provider–Stockboxtech",
    "/Expert-Share-Market-Consultant–StockboxTech-for-Smart-Investments",
    "/Investment-Strategies-in-Stock-Market-Expert-Tips-by-StockBoxTech",
    "/Stock-Advisory-Services-Expert-Stock-Market-Guidance-by-StockboxTech",
    "/Trusted-Stock-Advisory-Services-in-India-Stockboxtech-Experts",
    "/Trusted-SEBI-Registered-Intraday-Tips-Provider-in-India-StockBoxTech"
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static Pages
  staticRoutes.forEach((route) => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${route === "/" ? "1.0" : "0.8"}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Dynamic Blogs
  blogs.forEach((blog) => {
    const lastMod = new Date(blog.updatedAt || blog.publishedAt || Date.now()).toISOString();
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blogs/${blog.slug}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  res.header("Content-Type", "application/xml; charset=utf-8");
  return res.status(200).send(xml);
});


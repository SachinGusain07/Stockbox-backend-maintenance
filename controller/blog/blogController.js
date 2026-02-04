
import Bloging from "../../models/blog/blog.js";
import BlogCategory from "../../models/blog/blogCategory.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../utils/Cloudinary.js";
  
import ApiError from "../../utils/ErrorResponse/ApiError.js";
import { ApiResponse } from "../../utils/ErrorResponse/ApiResponse.js";
import { asyncHandler } from "../../utils/ErrorResponse/asyncHandler.js";
import { paginate } from "../../utils/ErrorResponse/Pagination.js";
  
 
  
  // Create a new blog post
  export const createBlog = asyncHandler(async (req, res, next) => {
    const thumbImage = req.file;
    let thumbImageResponse = null;  
    console.log(thumbImage, "thumbImage");
    
    if (thumbImage) {
      thumbImageResponse = await uploadFileToCloudinary(thumbImage, "Blogs"); // Res-> [{}]
    }
    console.log(thumbImageResponse.secure_url, "thumbImageResponse");
  
    // Check if category exists
    const categoryExists = await BlogCategory.findById(req.body.category);
    if (!categoryExists) {
      return next(new ApiError("Invalid category ID", 400));
    }
  
    // Create a new blog post
    const blog = await Bloging.create({
      ...req.body,
      thumbImage:{
        secure_url: thumbImageResponse.secure_url ,
        public_id: thumbImageResponse.public_id,
      } || null, // If no image null will set, undefined ignored the field
    });
  
    if (!blog) {
      return next(new ApiError("Failed to create the blog post", 400));
    }
  
    return res
      .status(201)
      .json(new ApiResponse("Created the blog post successfully", blog));
  });
  
  // Get all blog posts
  export const getAllBlogs = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const { category, search } = req.query;
  
    // Set up filter object for the paginate function
    const filter = {};
    if (category) {
      filter.category = category; // Assuming category is stored as an ID reference in Blog model
    }
  
    // If a search term is provided, add it to the filter for title
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
  
    // Use the pagination utility function
    const { data: blogs, pagination } = await paginate(
        Bloging,
      page,
      limit,
      [
        { path: "author", select: "fullName email" },
        { path: "category", select: "blogCategoryName" },
      ],
      filter,
      "-publishedAt" // Newest one come first Can also write as {publishedAt: -1}
    );
  
    // Check if no blogs found
    if (!blogs || blogs.length === 0) {
      return next(new ApiError("No blogs found", 404));
    }
  
    // Return paginated response with ApiResponse
    return res
      .status(200)
      .json(
        new ApiResponse("Fetched all blog posts successfully", blogs, pagination)
      );
  });
  
  // Get a single blog post by ID
  export const getBlogById = asyncHandler(async (req, res, next) => {
    const blog = await Bloging.findById(req.params.id)
      .populate("author", "fullName email role")
      .populate("category", "blogCategoryName");
  
    if (!blog) {
      return next(new ApiError("Blog post not found", 404));
    }
  
    return res
      .status(200)
      .json(new ApiResponse("Fetched the blog post successfully", blog));
  });


export const getBlogBySlug = asyncHandler(async (req, res, next) => {
  const blog = await Bloging.findOne({ slug: req.params.slug })
    .populate("category", "blogCategoryName");

  if (!blog) {
    return next(new ApiError("Blog post not found with the given slug", 404));
  }

  return res
    .status(200)
    .json(new ApiResponse("Fetched the blog post by slug successfully", blog));
});


  
  // Update a blog post
  export const updateBlogById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const thumbImage = req.file;
  
    const existingBlog = await Bloging.findById(id);
    if (!existingBlog) {
      return next(new ApiError("Blog post not found", 404));
    }
  
    let thumbImageResponse = null;
  
    if (thumbImage) {
      try {
        thumbImageResponse = await uploadFileToCloudinary(thumbImage, "Blogs");
        console.log(thumbImageResponse, "thumbImageResponse");
  
        if (existingBlog.thumbImage?.public_id) {
          await deleteFileFromCloudinary(existingBlog.thumbImage.public_id);
          console.log("Old image deleted from Cloudinary:", existingBlog.thumbImage.public_id);
        }
      } catch (error) {
        console.error("Image handling error:", error);
        return next(new ApiError("Error uploading or deleting image", 500));
      }
    }
  
    const blogData = { ...req.body };
  
    // If you store thumbImage as just a URL
    if (thumbImageResponse) {
      blogData.thumbImage ={
        public_id: thumbImageResponse.public_id,
        secure_url: thumbImageResponse.secure_url
      }
    }
  
    const updatedBlog = await Bloging.findByIdAndUpdate(id, blogData, {
      new: true,
      runValidators: true,
    });
  
    if (!updatedBlog) {
      return next(new ApiError("Blog post update failed", 404));
    }
  
    return res
      .status(200)
      .json(new ApiResponse("Updated the blog post successfully", updatedBlog));
  });
  
  
  // Delete a blog post
  export const deleteBlogbyId = asyncHandler(async (req, res, next) => {
    const deletedBlog = await Bloging.findByIdAndDelete(req.params.id);
  
    if (!deletedBlog) {
      return next(new ApiError("Blog post not found", 404));
    }
  
    // Delete images from Cloudinary
    if (deletedBlog?.thumbImage)
      await deleteFileFromCloudinary(deletedBlog.thumbImage);
  
    return res
      .status(200)
      .json(new ApiResponse("Deleted the blog post successfully"));
  });
  
  // Get recent blog posts
  export const getRecentBlogs = asyncHandler(async (req, res, next) => {
    const { limit = 5 } = req.query; // Default limit to 5 if not provided
  
    // Fetch recent blogs based on publication date
    const recentBlogs = await Bloging.find()
      .populate("author", "name email")
      .populate("category", "blogCategoryName")
      .sort({ publishedAt: -1 }) // Sort by latest published
      .limit(Number(limit)); // Limit number of results
  
    return res
      .status(200)
      .json(
        new ApiResponse("Fetched recent blog posts successfully", recentBlogs)
      );
  });
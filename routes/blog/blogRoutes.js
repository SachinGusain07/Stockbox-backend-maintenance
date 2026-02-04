import express from "express";
import {
  createBlogCategory,
  deleteBlogCategoryById,
  getBlogCategoryById,
  getBlogCategories,
  updateBlogCategoryById,
} from "../../controller/blog/blogCategoryController.js";
import {
    createBlog,
  deleteBlogbyId,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getRecentBlogs,
  updateBlogById,
} from "../../controller/blog/blogController.js";
import { upload } from "../../middleware/multerMiddleware.js";
import Bloging from "../../models/blog/blog.js";

const router = express.Router();

// BLOG CATEGORY ROUTES
router.route("/categories").get(getBlogCategories).post(createBlogCategory); // Create a blog category // Get all blog categories
router
  .route("/categories/:id")
  .get(getBlogCategoryById) // Get a blog category by ID
  .delete(deleteBlogCategoryById) // Delete a blog category by ID
  .put(updateBlogCategoryById); // Update a blog category by ID

// BLOG ROUTES
router
  .route("/")
  .post(upload.single("thumbImage"), createBlog) // Create a blog post
  .get(getAllBlogs); // Get all blog posts
router.route("/recent").get(getRecentBlogs); // By default 5 recent blog will be fetched
 router.get("/slug/:slug", getBlogBySlug);
router
  .route("/:id")
  .get(getBlogById) // Get a blog post by ID
  .delete(deleteBlogbyId) // Delete a blog post by ID
  .put(upload.single("thumbImage"), updateBlogById); // Update a blog post by ID

 
  

router.get("/categories/:categoryId/blogs", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const blogs = await Bloging.find({ category: categoryId }).populate("category", "blogCategoryName");
    res.status(200).json({ message: "Blogs fetched successfully", data: blogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
});

export default router;
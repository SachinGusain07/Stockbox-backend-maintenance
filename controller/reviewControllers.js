import gplay from "google-play-scraper";
import Review from "../models/review.js";

const reviewController = async (req, res) => {
  let page = 1;
  let totalFetched = 0;
  let totalInserted = 0;

  try {
    while (true) {
      const result = await gplay.reviews({
        appId: "com.stock.stockbox",
        page: page,
        sort: gplay.sort.NEWEST,
        num: 50,
      });

      if (!result.data || result.data.length === 0) {
        console.log("No more reviews to fetch.");
        break; // Exit loop when no reviews are returned
      }

      totalFetched += result.data.length;

      // Extract review IDs from fetched data
      const reviewIds = result.data.map((review) => review.id);

      // Find existing reviews in the database
      const existingReviews = await Review.find({ id: { $in: reviewIds } }).select("id");
      const existingIds = new Set(existingReviews.map((review) => review.id));

      // Filter out already existing reviews
      const newReviews = result.data
        .filter((review) => !existingIds.has(review.id))
        .map((review) => ({
          id: review.id,
          userName: review.userName,
          userImage: review.userImage || null,
          date: review.date ? new Date(review.date).toISOString() : null,
          score: review.score,
          text: review.text,
        }));

      if (newReviews.length > 0) {
        await Review.insertMany(newReviews); // Bulk insert new reviews
        totalInserted += newReviews.length;
      } else {
        console.log("No new reviews found. Stopping...");
        break; // Exit loop when no new reviews are found
      }

      console.log(`Fetched: ${totalFetched}, Inserted: ${totalInserted}`);
      page++; // Move to the next page
    }

    res.json({
      success: true,
      totalFetched,
      totalInserted,
      message: "Reviews fetched and stored successfully",
    });
  } catch (error) {
    console.error("Error fetching or saving reviews:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews from Google Play Store",
      error: error.message,
    });
  }
};

export default reviewController;

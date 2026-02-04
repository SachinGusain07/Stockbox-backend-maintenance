import Review from "../models/review.js";


const getReview= async(req,res)=>{


    try {
        const blogs = await Review.find();
        res.status(200).json(blogs);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching blogs" });
      }
}
export default getReview;
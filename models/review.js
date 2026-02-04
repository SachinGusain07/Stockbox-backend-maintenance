import mongoose from "mongoose";
import { text } from "stream/consumers";

const reviewSchema = new mongoose.Schema({
    id: { type: String, required: true },
    userName: { type: String, required: true },
    userImage: { type: String},
    date: { type: String},
    score: { type: Number},
    text: { type: String},
    
})

const Review = mongoose.model("review", reviewSchema);
export default Review;
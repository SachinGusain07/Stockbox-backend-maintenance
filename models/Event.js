import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);

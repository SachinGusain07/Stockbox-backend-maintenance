// models/ipoListingModel.js
import mongoose from "mongoose";

const ipoListingSchema = new mongoose.Schema(
  {
    ipoListingsToday: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const IPOListing = mongoose.model("IPOListing", ipoListingSchema);
export default IPOListing;

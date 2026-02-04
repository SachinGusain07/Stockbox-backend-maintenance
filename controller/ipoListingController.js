// controllers/ipoListingController.js
import IPOListing from "../models/ipoListingModel.js";

// Add listings
export const addIPOListing = async (req, res) => {
  try {
    const { ipoListingsToday } = req.body;

    if (!ipoListingsToday || !Array.isArray(ipoListingsToday)) {
      return res.status(400).json({ message: "ipoListingsToday must be an array" });
    }

    const savedListings = [];

    for (const listing of ipoListingsToday) {
      const newEntry = new IPOListing({ ipoListingsToday: listing });
      const saved = await newEntry.save();
      savedListings.push(saved);
    }

    res.status(201).json(savedListings);
  } catch (error) {
    console.error("Error saving IPO listings:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all listings
export const getIPOListings = async (req, res) => {
  try {
    const listings = await IPOListing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Delete entire document by ID
export const deleteListingById = async (req, res) => {
  try {
    const id = req.params.id;
    await IPOListing.findByIdAndDelete(id);
    res.status(200).json({ message: "IPO listing entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

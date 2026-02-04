import Event from "../models/Event.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure 'uploads/' folder exists
const UPLOADS_DIR = path.resolve("uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Multer Storage (For Image Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage }).single("image");

// Upload or Update the Event Image

export const uploadEvent = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) return res.status(500).json({ message: "File upload failed", error: err });

      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const imageUrl = `${process.env.VITE_BACKEND_URL}/uploads/${req.file.filename}`;
      

      let existingEvent = await Event.findOne();

      if (existingEvent) {
        // Delete old image
        const oldImagePath = path.resolve("uploads", existingEvent.image.split("/").pop());
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);

        // Update new image
        existingEvent.image = `/uploads/${req.file.filename}`;
        await existingEvent.save();

        console.log("Populated Image URL (updated event):", imageUrl);

        return res.status(200).json({ 
          message: "Event updated successfully", 
          event: { image: imageUrl } 
        });
      }

      // Create new event
      const newEvent = new Event({ image: `/uploads/${req.file.filename}` });
      await newEvent.save();

      console.log("Populated Image URL (new event):", imageUrl);

      res.status(201).json({ 
        message: "Event uploaded successfully", 
        event: { image: imageUrl } 
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading event", error });
  }
};



// Get the Event Image (Only One Exists)
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne();
    if (!event) return res.status(404).json({ message: "No event found" });

    // Ensure no double slashes
    const imagePath = `${process.env.VITE_BACKEND_URL}${event.image.startsWith('/') ? '' : '/'}${event.image}`;

    res.json({ image: imagePath });
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};


// Delete the Event Image
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne();
    if (!event) return res.status(404).json({ message: "No event to delete" });

    // Extract file name safely
    const fileName = path.basename(event.image); // safer than split("/")
    const imagePath = path.resolve("uploads", fileName);

    // Delete the image if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Deleted image at: ${imagePath}`);
    }

    // Delete the event document
    await Event.deleteOne();

    res.status(200).json({ message: "Event and associated image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};

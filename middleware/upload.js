import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pdfs", // Folder in Cloudinary
    format: async () => "pdf", // Ensure the format is PDF
    public_id: (req, file) => file.originalname.split(".")[0], // Use the original filename
  },
});

const upload = multer({ storage });

export default upload;

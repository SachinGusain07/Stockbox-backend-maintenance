import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Function to upload a PDF to Cloudinary
export const uploadPDFToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: file.originalname.split(".")[0], // Use the original file name (without extension)
        resource_type: "raw", // Ensure it works for PDFs
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    ).end(file.buffer); // Use file.buffer for the upload
  });
};

export const deleteFileFromCloudinaryPdf = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
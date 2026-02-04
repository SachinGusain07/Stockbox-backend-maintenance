import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadFileToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: file.originalname.split(".")[0], // Use the original file name (without extension)
        resource_type: "image", // Ensure it works for images
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    ).end(file.buffer); // Use file.buffer for the upload
  });
};

// Function to delete a file from Cloudinary
export const deleteFileFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
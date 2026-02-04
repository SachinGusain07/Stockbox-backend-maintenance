import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Use memory storage to keep the file in memory as a buffer
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
});
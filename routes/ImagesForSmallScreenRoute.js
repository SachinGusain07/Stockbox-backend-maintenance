import express from "express";
import multer from "multer";
import {
  activateImage,
  addImg,
  delete_images,
  getActiveImage,
  getAll_Images,
  updateImg,
} from "../controller/CrousalUploadImages/CrousalImagesForSmallScreen.js";
import protectRoute from "../utils/protectRoute.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const CrousalImagesForSmallScreen = express.Router();

// Corrected Upload Middleware
CrousalImagesForSmallScreen.post(
  "/addImg",
  protectRoute,
  upload.array("images", 4),
  addImg
);
CrousalImagesForSmallScreen.patch(
  "/updateImg/:id/:imgKey",
  protectRoute,
  upload.single("image"),
  updateImg
);
CrousalImagesForSmallScreen.get("/getall_images", getAll_Images);
CrousalImagesForSmallScreen.get("/get-active-image", getActiveImage);


CrousalImagesForSmallScreen.delete("/delete/:id", protectRoute, delete_images);
CrousalImagesForSmallScreen.post(
  "/activateimg/:id",
  protectRoute,
  activateImage
);

export default CrousalImagesForSmallScreen;

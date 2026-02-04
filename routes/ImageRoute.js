import express from "express";
import multer from "multer";
import {
  activateImage,
  addImg,
  delete_images,
  getAll_Images,
  updateImg,
} from "../controller/CrousalUploadImages/Crousal.js";
import protectRoute from "../utils/protectRoute.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imgRouter = express.Router();

// Corrected Upload Middleware
imgRouter.post("/addImg", protectRoute, upload.array("images", 4), addImg);
imgRouter.patch(
  "/updateImg/:id/:imgKey",
  protectRoute,
  upload.single("image"),
  updateImg
);
imgRouter.get("/getall_images", getAll_Images);
imgRouter.delete("/delete/:id", protectRoute, delete_images);
imgRouter.post("/activateimg/:id", protectRoute, activateImage);

export default imgRouter;

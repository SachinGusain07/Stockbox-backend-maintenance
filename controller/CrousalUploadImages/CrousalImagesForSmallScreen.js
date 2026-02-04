import CrousalImagesForSmallScreen from "../../models/ImagesSmallScreen.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../utils/Cloudinary.js";

export const addImg = async (req, res) => {
  try {
    const files = req.files; // Access uploaded files
    if (!files || files.length === 0) {
      return res.status(400).json({ status: "error", message: "No files uploaded" });
    }

    // Upload images to Cloudinary
    const uploadedFiles = await Promise.all(
      files.map((file) => uploadFileToCloudinary(file, "carousel_images_small_screen"))
    );

    // Store images in MongoDB
    const storeData = new CrousalImagesForSmallScreen({
      img1: uploadedFiles[0] || { secure_url: "", public_id: "" },
      img2: uploadedFiles[1] || { secure_url: "", public_id: "" },
      img3: uploadedFiles[2] || { secure_url: "", public_id: "" },
      img4: uploadedFiles[3] || { secure_url: "", public_id: "" },
    });

    await storeData.save(); // Save to MongoDB

    return res.json({
      status: "success",
      message: "Images uploaded & stored successfully!",
      uploadedFiles,
      savedData: storeData,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      status: "error",
      message: "Image upload failed!",
      error,
    });
  }
};
  export const updateImg = async (req, res) => {
    try {
      const { id, imgKey } = req.params; // `id` = MongoDB ID, `imgKey` = "img1", "img2", etc.
      const newFile = req.file; // New image from request
  
      if (!newFile) {
        return res
          .status(400)
          .json({ status: "error", message: "No new image provided" });
      }
  
      const imageDoc = await CrousalImagesForSmallScreen.findById(id);
      if (!imageDoc) {
        return res
          .status(404)
          .json({ status: "error", message: "Image document not found" });
      }
  
      const oldPublicId = imageDoc[imgKey]?.public_id;
  
      // Update Cloudinary
      const deleteImage = await deleteFileFromCloudinary(oldPublicId);
      const updateImage = await uploadFileToCloudinary(req.file);
  
      // Update MongoDB
      imageDoc[imgKey] = updateImage;
      await imageDoc.save();
  
      return res.json({
        status: "success",
        message: "Image updated successfully!",
        updateImage,
      });
    } catch (error) {
      console.error("Image update error:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Image update failed!", error });
    }
  };
  
  export const getAll_Images = async (req, res) => {
    try {
      const data = await CrousalImagesForSmallScreen.find({});
      return res.status(200).json({
        status: " sucessFully fetch all images",
        data,
      });
    } catch (err) {
      console.error("Error fetching the image:", err);
      return res
        .status(500)
        .json({
          status: "error",
          message: "Failed to fetching image",
          error: err,
        });
    }
  };
  
  export const delete_images = async (req, res) => {
    console.log("hey")
    try {
      const { id } = req.params;
      const image = await CrousalImagesForSmallScreen.findById(id);
      if (!image) {
        return res
          .status(404)
          .json({ status: "error", message: "Image not found" });
      }
      const ids = [image.img1.public_id, image.img2.public_id, image.img3.public_id, image.img4.public_id];
      for (const public_id of ids) {
        deleteFileFromCloudinary(public_id); // Deletes from Cloudinary
    }
      const deleteImg = await CrousalImagesForSmallScreen.findByIdAndDelete(id);
    } catch (err) {
      console.error("Error deleting the image:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to delete image", error: err });
    }
  };
  export const activateImage = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await CrousalImagesForSmallScreen.updateMany(
        { Active: true },
        { $set: { Active: false } }
      );
  
      const findToActivate = await CrousalImagesForSmallScreen.findById(id);
      if (!findToActivate) {
        return res.status(404).json({
          status: "error",
          message: "data not found",
        });
      }
      findToActivate.Active = true;
      await findToActivate.save();
      res.status(200).json({
        status: "success",
        message: "image activated successfully",
      });
    } catch (err) {
      console.log("Error in activating image", err);
      res.status(500).json({
        status: "error",
        message: "failed to activate image",
      });
    }
  };

  export const getActiveImage = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await CrousalImagesForSmallScreen.findOne(
        { Active: true },
        
      );
      res.status(200).json({
         data,
        status: "success",
        message: "image activated successfully",
      });
    } catch (err) {
      console.log("Error in activating image", err);
      res.status(500).json({
        status: "error",
        message: "failed to activate image",
      });
    }
  };
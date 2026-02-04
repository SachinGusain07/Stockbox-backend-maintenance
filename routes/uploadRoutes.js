import express from "express";
import multer from "multer";
import PdfModel from "../models/PdfModel.js";
import { uploadPDFToCloudinary } from "../utils/CloudinaryPDF.js";
import { deleteFileFromCloudinaryPdf } from "../utils/CloudinaryPDF.js";
import protectRoute from "../utils/protectRoute.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

// Upload PDF
router.post("/upload", protectRoute ,  upload.single("pdf"), async (req, res) => {
  const { title } = req.body;

  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload to Cloudinary
    const { secure_url } = await uploadPDFToCloudinary(req.file, "monthly_reports");

    // Save to database
    const newPdf = new PdfModel({
      pdfUrl: secure_url, // Save only the secure URL
      title,
      originalName: req.file.originalname, // Save the original file name
    });
    await newPdf.save();

    res.status(201).json({ message: "PDF uploaded successfully", pdf: newPdf });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
});

// Fetch all PDFs grouped by title
router.get("/all", async (req, res) => {
  try {
    const pdfs = await PdfModel.find();
    const groupedPdfs = pdfs.reduce((acc, pdf) => {
      if (!acc[pdf.title]) acc[pdf.title] = [];
      acc[pdf.title].push(pdf);
      return acc;
    }, {});
    res.json(groupedPdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

// Delete PDF by ID
router.delete("/:id", protectRoute , async (req, res) => {
  const { id } = req.params;

  try {
    // Find the PDF in the database
    const pdf = await PdfModel.findById(id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Delete the file from Cloudinary
    const publicId = pdf.pdfUrl.split("/").pop().split(".")[0]; // Extract public ID from the URL
    await deleteFileFromCloudinaryPdf(publicId);

    // Delete the PDF from the database
    await PdfModel.findByIdAndDelete(id);

    res.status(200).json({ message: "PDF deleted successfully" });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    res.status(500).json({ error: "Failed to delete PDF" });
  }
});

export default router;

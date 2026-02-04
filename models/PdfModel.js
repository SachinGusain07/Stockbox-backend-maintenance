// filepath: c:\Users\HP\OneDrive\Desktop\Ayush\stockboxfull\Server\models\PdfModel.js
import mongoose from "mongoose";

const PdfSchema = new mongoose.Schema({
  pdfUrl: { type: String, required: true }, // Save only the secure URL
  title: { type: String, required: true }, // Container title
  originalName: { type: String, required: true }, // Original file name
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Pdf", PdfSchema);
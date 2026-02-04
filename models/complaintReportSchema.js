// models/ComplaintReport.js
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    pendingEndLastMonth: String,
    received: String,
    resolved: String,
    totalPending: String,
    pendingOver3Months: String,
    avgResolutionTime: String,
  },
  { _id: false }
); // embedded sub-documents, no extra _id

const complaintReportSchema = new mongoose.Schema(
  {
    monthEnding: {
      type: String,
      required: true,
      unique: true,
    },
    directlyFromInvestors: complaintSchema,
    sebiScores: complaintSchema,
    otherSources: complaintSchema,
    grandTotal: complaintSchema,
    isActive: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default mongoose.model("ComplaintReport", complaintReportSchema);

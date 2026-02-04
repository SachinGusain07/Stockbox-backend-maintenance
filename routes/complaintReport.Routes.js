import express from "express";
import {
  Activate,
  createComplaintReport,
  deleteReport,
  deleteReportByMonth,
  getActiveReport,
  getAllReports,
  getReportByMonth,
  updateReportByMonth,
} from "../controller/complaintReport.controller.js";

const complaintReportRoutes = express.Router();

complaintReportRoutes.post("/", createComplaintReport);
complaintReportRoutes.get("/", getAllReports);
// complaintReportRoutes.get("/:month", getReportByMonth);
// complaintReportRoutes.put("/:month", updateReportByMonth);
// complaintReportRoutes.delete("/:month", deleteReportByMonth);
complaintReportRoutes.put("/:id/activate", Activate);
complaintReportRoutes.delete("/:id", deleteReport);
complaintReportRoutes.get("/active", getActiveReport); // Get the active report

export default complaintReportRoutes;

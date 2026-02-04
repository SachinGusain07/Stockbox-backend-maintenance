import ComplaintReport from "../models/complaintReportSchema.js";

// Create report
export const createComplaintReport = async (req, res) => {
  try {
    const report = await ComplaintReport.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await ComplaintReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get report by monthEnding
export const getReportByMonth = async (req, res) => {
  try {
    const report = await ComplaintReport.findOne({
      monthEnding: req.params.month,
    });
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update report by month
export const updateReportByMonth = async (req, res) => {
  try {
    const report = await ComplaintReport.findOneAndUpdate(
      { monthEnding: req.params.month },
      req.body,
      { new: true }
    );
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete report by month
export const deleteReportByMonth = async (req, res) => {
  try {
    const deleted = await ComplaintReport.findOneAndDelete({
      monthEnding: req.params.month,
    });
    if (!deleted) return res.status(404).json({ error: "Report not found" });
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const Activate = async (req, res) => {
  try {
    await ComplaintReport.updateMany({}, { $set: { isActive: false } });

    const updated = await ComplaintReport.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to activate report" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    await ComplaintReport.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete report" });
  }
};

// controller

export const getActiveReport = async (req, res) => {
  try {
    const active = await ComplaintReport.findOne({ isActive: true });

    if (!active) {
      return res.status(404).json({ message: "No active report found." });
    }

    return res.status(200).json({active});
  } catch (error) {
    console.error("Error fetching active report:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

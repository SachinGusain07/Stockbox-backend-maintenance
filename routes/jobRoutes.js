import express from "express";
import Job from "../models/JobModel.js"; // Create a Job model
import protectRoute from "../utils/protectRoute.js";
const router = express.Router();

// Route to add a new job
router.post("/add", protectRoute , async (req, res) => {
  try {
    const { title, description, salary, googleFormLink } = req.body;
    const newJob = new Job({ title, description, salary, googleFormLink });
    await newJob.save();
    res.status(201).json({ success: true, message: "Job added successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add job", error });
  }
});

// Route to delete a job
router.delete("/delete/:id", protectRoute , async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Job deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete job", error });
  }
});

// Route to get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch jobs", error });
  }
});

export default router;
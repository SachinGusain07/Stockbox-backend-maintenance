import express from "express";
import sendAssessment from "./advanceTraining.controller.js";

const router = express.Router();



// Your new dedicated assessment route
router.post("/send-assessment", sendAssessment);

export default router;
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: Number, required: true },
  googleFormLink: { type: String, required: true },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;
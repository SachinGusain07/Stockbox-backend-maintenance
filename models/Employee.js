// models/Employee.js

import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // File path or base64 string
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;

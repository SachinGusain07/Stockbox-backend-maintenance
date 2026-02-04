import express from "express";

import multer from "multer";
import fs from "fs";
import path from "path";
import { addEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from "../controller/EmployeeController/EmployeeController.js";
import protectRoute from "../utils/protectRoute.js";
const EmployeeRoute = express.Router();

// ✅ Ensure folder exists
const uploadDir = path.join(process.cwd(), "/uploads/employee");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // use absolute path
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Routes
EmployeeRoute.post("/add", protectRoute , upload.single("image"), addEmployee);
EmployeeRoute.get("/",  getEmployees);
EmployeeRoute.get("/:id", getEmployeeById);
EmployeeRoute.put("/update/:id",protectRoute , upload.single("image"), updateEmployee); // include multer here too
EmployeeRoute.delete("/delete/:id", protectRoute ,deleteEmployee);

export default EmployeeRoute;

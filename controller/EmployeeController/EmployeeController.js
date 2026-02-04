import fs from "fs";
import path from "path";
import Employee from "../../models/Employee.js";

const uploadPath = path.join(process.cwd(), "uploads/employee");
// Add new employee
export const addEmployee = async (req, res) => {
  try {
    const { name, designation, description } = req.body;
    console.log(req.body);
    console.log(name, designation, description);
    const image = req.file ? `/uploads/employee/${req.file.filename}` : null;

    const newEmployee = new Employee({ name, designation, description, image });
    await newEmployee.save();

    res
      .status(201)
      .json({ message: "Employee added successfully", employee: newEmployee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding employee", error: error.message });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    console.log("Fetching all employees");
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employees", error: error.message });
  }
};

// Get single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  }
};

// Update employee by ID
// Update employee by ID
export const updateEmployee = async (req, res) => {
  try {
    const { name, designation, description } = req.body;
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Remove old image if a new one is uploaded
    if (req.file) {
      if (employee.image) {
        const oldImagePath = path.join(process.cwd(), employee.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted:", oldImagePath);
        } else {
          console.log("Old image not found:", oldImagePath);
        }
      }

      // Set new image path (same as in addEmployee)
      employee.image = `/uploads/employee/${req.file.filename}`;
    }

    // Update other fields
    employee.name = name || employee.name;
    employee.designation = designation || employee.designation;
    employee.description = description || employee.description;

    await employee.save();
    res
      .status(200)
      .json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
};


// Delete employee by ID
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Remove image file from disk
    if (employee.image) {
      const imagePath = path.join(process.cwd(), employee.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await employee.deleteOne();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
};

import TableData from "../../models/TableData.js";

// ✅ Get All Entries
export const getAllData = async (req, res) => {
  try {
    const data = await TableData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add New Entry
export const addEntry = async (req, res) => {
  try {
    const newEntry = new TableData(req.body);
    await newEntry.save();
    res.status(201).json({ message: "Entry added successfully", data: newEntry });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Update an Entry
export const updateEntry = async (req, res) => {
  try {
    const updatedEntry = await TableData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Entry updated successfully", data: updatedEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete an Entry
export const deleteEntry = async (req, res) => {
  try {
    await TableData.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/ipoController.js
import IPO from "../models/iposModel.js";

export const addIPOs = async (req, res) => {
  try {
    const { upcomingIpos } = req.body;
    if (!Array.isArray(upcomingIpos)) {
      return res.status(400).json({ message: "upcomingIpos must be an array" });
    }

    const newIPO = new IPO({ upcomingIpos });
    await newIPO.save();
    res.status(201).json(newIPO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIPOs = async (req, res) => {
  try {
    const ipos = await IPO.find();
    res.status(200).json(ipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIPOName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await IPO.updateMany({}, { $pull: { upcomingIpos: name } });
    res.status(200).json({ message: `Deleted IPO name: ${name}`, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIPOEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await IPO.findByIdAndDelete(id);
    res.status(200).json({ message: "IPO record deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

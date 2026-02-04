import Issue from '../models/Issue.js';

// Add a new issue
export const addIssue = async (req, res) => {
  try {
    const {
      category,
      heading,
      status,
      issuePrice,
      issueDate,
      issueMonth,
      issueYear,
    } = req.body;

    const newIssue = new Issue({
      category,
      heading,
      status,
      issuePrice,
      issueDate,
      issueMonth,
      issueYear,
    });

    await newIssue.save();
    res.status(201).json({ message: 'Issue added successfully', issue: newIssue });
  } catch (error) {
    res.status(500).json({ message: 'Error adding issue', error: error.message });
  }
};

// Get all issues
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issues', error: error.message });
  }
};

// Get issue by ID
export const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issue', error: error.message });
  }
};

// Update an issue
export const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category,
      heading,
      status,
      issuePrice,
      issueDate,
      issueMonth,
      issueYear,
    } = req.body;

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      {
        category,
        heading,
        status,
        issuePrice,
        issueDate,
        issueMonth,
        issueYear,
      },
      { new: true }
    );

    if (!updatedIssue) return res.status(404).json({ message: 'Issue not found' });

    res.status(200).json({ message: 'Issue updated successfully', issue: updatedIssue });
  } catch (error) {
    res.status(500).json({ message: 'Error updating issue', error: error.message });
  }
};

// Delete an issue
export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIssue = await Issue.findByIdAndDelete(id);
    if (!deletedIssue) return res.status(404).json({ message: 'Issue not found' });

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting issue', error: error.message });
  }
};

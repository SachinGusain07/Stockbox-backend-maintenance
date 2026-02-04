import express from 'express';
import {
  addIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from '../controller/issueController.js';

const Issuerouter = express.Router();

// @route   POST /api/issues
// @desc    Add a new issue
Issuerouter.post('/', addIssue);

// @route   GET /api/issues
// @desc    Get all issues
Issuerouter.get('/', getAllIssues);

// @route   GET /api/issues/:id
// @desc    Get issue by ID
Issuerouter.get('/:id', getIssueById);

// @route   PUT /api/issues/:id
// @desc    Update issue by ID
Issuerouter.put('/:id', updateIssue);

// @route   DELETE /api/issues/:id
// @desc    Delete issue by ID
Issuerouter.delete('/:id', deleteIssue);

export default Issuerouter;

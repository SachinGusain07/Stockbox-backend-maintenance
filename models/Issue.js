import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['small-cap', 'mid-cap', 'large-cap'],
    required: true
  },
  heading: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['buy', 'sell'],
    default: 'buy',
  },
  issuePrice: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  issueMonth: {
    type: String,
    required: true,
  },
  issueYear: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;

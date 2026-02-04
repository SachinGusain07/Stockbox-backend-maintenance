import mongoose from 'mongoose';

const ipoSchema = new mongoose.Schema({
  company: { type: String, required: true },
  openingDate: { type: Date },
  closingDate: { type: Date },
  listingAt: { type: String },
  listingDate: { type: String },
  issuePrice: { type: String },
  issueAmountCr: { type: String },
  blogLink: { type: String },
  status:String,
  iposManager:String,
  review:String,
  ipoManager:String
});

export default mongoose.model('Iposlist', ipoSchema);

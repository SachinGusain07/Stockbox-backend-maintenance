
import mongoose from "mongoose";

const ipoSchema = new mongoose.Schema({
  upcomingIpos: {
    type: [String],
    required: true,
    default: [],
  },
}, { timestamps: true });

const IPO = mongoose.model("IPO", ipoSchema);
export default IPO;

import mongoose from "mongoose";

const tableDataSchema = new mongoose.Schema({
  Year: {
    type: String,
    
  },
  carriedForward: {
    type: String,
    
  },
  received: {
    type: String,
   
  },
  resolved: {
    type: String,
   
  },
  pending: {
    type: String,
    
  },
}, { timestamps: true });

const TableYearly = mongoose.model("TableDataYearly", tableDataSchema);

export default TableYearly;

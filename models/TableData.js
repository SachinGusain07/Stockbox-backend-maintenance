import mongoose from "mongoose";

const tableDataSchema = new mongoose.Schema({
  month: {
    type: String,
    
  },
  carriedForward: {
    type: Number,
    
  },
  received: {
    type: Number,
   
  },
  resolved: {
    type: Number,
   
  },
  pending: {
    type: Number,
    
  },
}, { timestamps: true });

const TableData = mongoose.model("TableData", tableDataSchema);

export default TableData;

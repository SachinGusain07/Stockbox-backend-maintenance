import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectdb;

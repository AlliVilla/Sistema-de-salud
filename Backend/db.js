import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://mongo:mongo@localhost:27017/cine_mongo?authSource=admin");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
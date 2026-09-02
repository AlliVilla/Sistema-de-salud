import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error(
            "MONGO_URI no está configurado. Copia Backend/.env.example a Backend/.env y " +
            "define la cadena de conexión. El arranque se detiene por seguridad."
        );
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;

import "dotenv/config"
import express from "express";
import connectDB from "./db.js";
import userRoutes from "./src/routes/users.route.js"

const app = express();

app.use(express.json())

app.use('/user', userRoutes);

await connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {console.log(`http://localhost:${PORT}`)})
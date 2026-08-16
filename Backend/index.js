import "dotenv/config"
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import userRoutes from "./src/routes/users.route.js"
import reportRoutes from "./src/routes/reports.route.js"
import diagnosticRoutes from "./src/routes/diagnostics.route.js"

const app = express();

app.use(cors());
app.use(express.json())

app.use('/user', userRoutes);
app.use('/report', reportRoutes);
app.use('/diagnostic', diagnosticRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("UNHANDLED ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
});

await connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {console.log(`http://localhost:${PORT}`)})
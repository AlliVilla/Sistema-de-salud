import "dotenv/config"
import express from "express";
import connectDB from "./db.js";
import userRoutes from "./src/routes/users.route.js"
import reportRoutes from "./src/routes/reports.route.js"
import diagnosticRoutes from "./src/routes/diagnostics.route.js"

const app = express();

app.use(express.json())

app.use('/user', userRoutes);
app.use('/report', reportRoutes);
app.use('/diagnostic', diagnosticRoutes);

await connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {console.log(`http://localhost:${PORT}`)})
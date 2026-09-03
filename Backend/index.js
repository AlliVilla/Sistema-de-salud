import "dotenv/config"
import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express"
import connectDB from "./db.js";
import { apiLimiter } from "./src/middlewares/rateLimit.middleware.js"
import userRoutes from "./src/routes/users.route.js"
import reportRoutes from "./src/routes/reports.route.js"
import diagnosticRoutes from "./src/routes/diagnostics.route.js"
import { version } from "mongoose";

const app = express();

app.use(cors());
app.use(apiLimiter);
app.use(express.json())

const PORT = process.env.PORT;

const swagger = {
    definition: {
        openapi: "3.0.0",
        info : {
            title: "Documentacion de APIs",
            version: "1.0.0",
            description: "API para proyecto de Salud Wearable."
        },

        servers: [{
            url: `http://localhost:${PORT}`,
            description: "localhost"
        }],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ["./src/routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(swagger)

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

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

app.listen(PORT, () => {console.log(`http://localhost:${PORT}`)})
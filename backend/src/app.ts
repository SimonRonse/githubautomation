import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

// CORS - Cross Origin Resource Sharing
app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
        credentials: true,
    })
);

// Security + parsers
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Errors
app.use(errorHandler);

export default app;

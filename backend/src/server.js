import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { seedUsers } from "./utils/seedUsers.js";

dotenv.config();

const app = express();
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isProduction = process.env.NODE_ENV === "production";

/**
 * Allows Vite dev servers to move ports locally while keeping production locked to CLIENT_URL.
 * @param {string} origin Request origin.
 * @returns {boolean} Whether the origin is a local development frontend.
 */
const isLocalDevelopmentOrigin = (origin) => {
  if (isProduction || !origin) {
    return false;
  }

  try {
    const { hostname } = new URL(origin);
    return ["localhost", "127.0.0.1"].includes(hostname);
  } catch (_error) {
    return false;
  }
};

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "leave-management-system" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

/**
 * Starts the HTTP server after MongoDB is connected and seed data is ready.
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required to start the server.");
    }

    await connectDB();

    if (process.env.SEED_USERS !== "false") {
      await seedUsers();
    }

    // Render expects the service to listen on the assigned host/port pair.
    app.listen(port, host, () => {
      console.log(`API server running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

startServer();

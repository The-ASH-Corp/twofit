import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router1 from "./routes/index.js";
import cors from "cors";
import { connectRedis } from "./redis/redisClient.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import initSocket from "./utils/socket.js";
import { startImageCleanupTask } from "./utils/cronJobs.js";
import { startNotificationCron } from "./utils/notification.cron.js";
import { ensureNotificationIndexes } from "./modules/notification/notification.service.js";
import { activateExtensionsCron } from "./utils/extensionActivation.cron.js";
import "./utils/payroll.cron.js";
import "./utils/SOPLog.cron.js";
import { seedReminders } from "./modules/autoReminder/reminder.service.js";





const app = express();
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5000",
  "https://ash-fitness-six.vercel.app"
];

if (process.env.FRONTEND_URL_PROD) {
  const prodUrl = process.env.FRONTEND_URL_PROD.replace(/\/$/, "");
  allowedOrigins.push(prodUrl);
  // Add www variant if not already present
  if (prodUrl.includes("https://") && !prodUrl.includes("www.")) {
    allowedOrigins.push(prodUrl.replace("https://", "https://www."));
  }
}
if (process.env.BACKEND_URL_PROD) {
  allowedOrigins.push(process.env.BACKEND_URL_PROD);
}

// CORS MUST COME VERY EARLY
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-access-token",
      "Accept",
      "X-Requested-With",
      "Range"
    ],
    credentials: true,
    exposedHeaders: ["x-access-token", "Content-Range"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// BODY PARSER MUST COME AFTER CORS
app.use(express.json());
app.use(cookieParser())

app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));

app.use("/api/v1", router1);

const server = http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"]
})

initSocket(io);

const mongoUri = process.env.MONGOURI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("Mongo URI is missing. Set MONGOURI or MONGO_URI in environment variables.");
  process.exit(1);
}

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    const redisConnected = await connectRedis();
    if (!redisConnected) {
      console.warn("Starting server without Redis. Some auth/session features may be degraded.");
    }

    await seedReminders();
    ensureNotificationIndexes();
    startImageCleanupTask();
    startNotificationCron();
    activateExtensionsCron();

    const port = Number(process.env.PORT) || 5000;
    server.listen(port, () => {
      console.log(`server is running at port ${port}`);
    });
  } catch (error) {
    console.error("Startup failed:", error?.message || error);
    process.exit(1);
  }
};

startServer();

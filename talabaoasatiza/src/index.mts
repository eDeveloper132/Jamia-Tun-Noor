// src/index.mts
import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db/db.js"; // your DB connect fn
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import attendanceRoutes from "./routes/attendance.js";
import taskRoutes from "./routes/tasks.js";
import examRoutes from "./routes/exams.js";
import ServerlessHttp from "serverless-http";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join("public")));

app.get("/", (req: Request, res: Response) => {
  res.send("talabaoasatiza Service is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/exams", examRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).send("Route not found");
});

// Only start a listener in development so you can run locally via `node dist/dev-server.mjs`
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT ?? 4000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`talabaoasatiza Service (dev) running on port ${PORT}`);
  });
}

/**
 * DATABASE CONNECT-ON-DEMAND
 * We'll connect lazily before the first request. If connection fails, we return 500 and log the error.
 */
let dbConnected = false;
async function ensureDbConnected() {
  if (dbConnected) return;
  try {
    await connectToDatabase(); // should throw on failure
    dbConnected = true;
    // eslint-disable-next-line no-console
    console.log("Database connected");
  } catch (err) {
    // rethrow so caller can handle and return 500
    // eslint-disable-next-line no-console
    console.error("Database connection failed:", err);
    throw err;
  }
}

const lambdaHandler = ServerlessHttp(app);

/**
 * Export a wrapped handler that ensures DB connection before dispatching to serverless-http.
 * This keeps initialization inside request lifecycle and avoids crashing at import time.
 */
export default async function handler(req: any, res: any) {
  try {
    await ensureDbConnected();
  } catch (err) {
    // If DB failed, respond 500 instead of crashing the function
    try {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.end("Internal Server Error: database connection failed");
    } catch (_) {
      // If response fails, just log
      // eslint-disable-next-line no-console
      console.error("Failed to send 500 response", _);
    }
    return;
  }

  // Dispatch to the serverless handler
  return lambdaHandler(req, res);
}

// global safety logging so unhandled errors show up in Vercel logs
process.on("unhandledRejection", (reason) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.error("Uncaught Exception:", err);
});

import "dotenv/config";
import path from "path";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from "./config/db/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import attendanceRoutes from "./routes/attendance.js";
import taskRoutes from "./routes/tasks.js";
import examRoutes from "./routes/exams.js";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
await connectToDatabase();
app.use(cookieParser());
app.use(express.static(path.join('public')));
app.get("/", (req, res) => {
    res.send("talabaoasatiza Service is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/exams", examRoutes);
app.use((req, res) => {
    res.status(404).send("Route not found");
});
app.listen(PORT, () => {
    console.log(`talabaoasatiza Service is running on port ${PORT}`);
});
//# sourceMappingURL=index.mjs.map
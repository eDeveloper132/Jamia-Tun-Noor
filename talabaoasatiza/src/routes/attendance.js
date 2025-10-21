import express from "express";
import { markAttendance, bulkAttendance, getUserAttendance } from "../controllers/attendanceController.js";
import { requireAuth, requireRole } from "../utils/authMiddleware.js";
const router = express.Router();
router.post("/mark", requireAuth, requireRole(["teacher", "nazim"]), markAttendance);
router.post("/bulk", requireAuth, requireRole(["teacher", "nazim"]), bulkAttendance);
router.get("/user/:userId", requireAuth, getUserAttendance);
export default router;
//# sourceMappingURL=attendance.js.map
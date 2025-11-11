import express from "express";
import { assignTaskToClass, createTask, getTasksForUser, updateTaskStatus } from "../controllers/taskController.js";
import { requireAuth, requireRole } from "../utils/authMiddleware.js";
const router = express.Router();
router.post("/", requireAuth, requireRole(["teacher"]), createTask);
router.post("/class", requireAuth, requireRole(["teacher"]), assignTaskToClass);
router.get("/user/:userId", requireAuth, getTasksForUser);
router.patch("/:id/status", requireAuth, updateTaskStatus);
export default router;
//# sourceMappingURL=tasks.js.map
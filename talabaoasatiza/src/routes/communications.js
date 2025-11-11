import express from "express";
import { listStudentsForTeacher, sendStudentEmail } from "../controllers/communicationController.js";
import { requireAuth, requireRole } from "../utils/authMiddleware.js";
const router = express.Router();
router.get("/students", requireAuth, requireRole(["teacher"]), listStudentsForTeacher);
router.post("/email", requireAuth, requireRole(["teacher"]), sendStudentEmail);
export default router;
//# sourceMappingURL=communications.js.map
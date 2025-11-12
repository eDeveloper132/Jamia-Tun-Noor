import express from "express";
import { listClassesForTeacher, sendClassEmail } from "../controllers/communicationController.js";
import { requireAuth, requireRole } from "../utils/authMiddleware.js";
const router = express.Router();
router.get("/classes", requireAuth, requireRole(["teacher"]), listClassesForTeacher);
router.post("/email", requireAuth, requireRole(["teacher"]), sendClassEmail);
export default router;
//# sourceMappingURL=communications.js.map
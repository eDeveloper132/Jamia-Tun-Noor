import express from "express";
import { createExam, getExamsForClass } from "../controllers/examController.js";
import { requireAuth, requireRole } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, requireRole(["nazim"]), createExam);
router.get("/class/:className", requireAuth, getExamsForClass);

export default router;

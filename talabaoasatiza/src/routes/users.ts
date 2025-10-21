import express from "express";
import { listUsers, createUser, getUser, updateUser } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole(["nazim"]), listUsers);
router.post("/", requireAuth, requireRole(["nazim"]), createUser);
router.get("/:id", requireAuth, getUser);
router.patch("/:id", requireAuth, requireRole(["nazim"]), updateUser);

export default router;

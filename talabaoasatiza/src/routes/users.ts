import express from "express";
import { listUsers, createUser, getUser, updateUser, deleteUser, updateUserClass, updateProfile } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../utils/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole(["nazim"]), listUsers);
router.post("/", requireAuth, requireRole(["nazim"]), createUser);
router.get("/:id", requireAuth, getUser);
router.patch("/:id", requireAuth, requireRole(["nazim"]), updateUser);
router.patch("/profile/:id", requireAuth, updateProfile);
router.delete("/:id", requireAuth, requireRole(["nazim"]), deleteUser); // Assuming deleteUser is also needed
router.patch("/:id/class", requireAuth, requireRole(["student"]), updateUserClass);

export default router;

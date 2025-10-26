import express from "express";
import { registerController, loginController, adminLoginController, adminRegisterController } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/admin/login", adminLoginController);
router.post("/admin/register", adminRegisterController);

export default router;

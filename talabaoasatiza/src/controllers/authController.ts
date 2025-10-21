import type { Request, Response } from "express";
import { UserModel } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";

export async function registerController(req: Request, res: Response) {
  try {
    const { email, password, name, role, className, subjects } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ error: "Missing fields" });
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const passwordHash = await hashPassword(password);
    const user = await UserModel.create({ email, passwordHash, name, role, className, subjects });
    const token = signJwt({ userId: user._id });
    return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role, className: user.className }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid field types" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = signJwt({ userId: user._id });
    return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role, className: user.className }, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

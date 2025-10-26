import type { Request, Response } from "express";
import { UserModel, type IUser } from "../models/User.js";
import { hashPassword } from "../utils/hash.js";

export async function listUsers(req: Request, res: Response) {
  const { role, className, page = "1", limit = "50" } = req.query;
  const q: any = {};
  if (role) q.role = role;
  if (className) q.className = className;
  const p = Math.max(1, Number(page));
  const l = Math.min(500, Number(limit));
  const users = await UserModel.find(q).skip((p - 1) * l).limit(l).select("-passwordHash");
  return res.json({ users });
}

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, name, role, className, subjects, approvedBy } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ error: "Missing fields" });
    if (await UserModel.findOne({ email })) return res.status(400).json({ error: "Email exists" });
    const passwordHash = await hashPassword(password);
    const user: IUser = await UserModel.create({ email, passwordHash, name, role, className, subjects });
    return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role, adminApproved: true, approvedBy } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getUser(req: Request, res: Response) {
  const user = await UserModel.findById(req.params.id).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "Not found" });
  return res.json({ user });
}

export async function updateUser(req: Request, res: Response) {
  const update = req.body;
  if (update.password) delete update.password; // don't allow raw password change here
  const user = await UserModel.findByIdAndUpdate(req.params.id, update, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ error: "Not found" });
  return res.json({ user });
}

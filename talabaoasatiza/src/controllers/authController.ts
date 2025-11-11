import type { Request, Response } from "express";
import { UserModel, type IUser } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";
import { sendVerificationEmail, sendAdminNotificationEmail } from "../utils/mailer.js";
import { v4 as uuidv4 } from "uuid";

export async function registerController(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const role: string = "student";
    if (!email || !password || !name || !role) return res.status(400).json({ error: "Missing fields" });
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const passwordHash = await hashPassword(password);
    const token = uuidv4();
    const hashedToken = await hashPassword(token);

    const user: IUser = await UserModel.create({ email, passwordHash, name, role, verificationToken: hashedToken, verificationTokenExpiry: new Date(Date.now() + 3600000) });
    console.log('🆕 User registered',user);
    await sendVerificationEmail(email, hashedToken);
    await sendAdminNotificationEmail(process.env.ADMIN_EMAIL as string, email);
    console.log("A verification link has been sent to the user's email.");
    // const token = signJwt({ userId: user._id });
    return res.status(201).json({ message: 'Registration successful, Verification email sent' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    return res.status(500).json({ message: 'Internal server error' });
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
    if (!user.isEmailVerified) {
      return res.status(400).json({ error: "Email not verified" });
    }
    if(!user.isAdminApproved) {
      return res.status(400).json({ error: "Account not approved by admin" });
    }
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    // const id = user._id;
    // const namee = user.name;
    // const emaile = user.email;
    // const role = user.role;
    // res.cookie(
    //   'user',
    //   JSON.stringify({ id, namee, emaile, role }),  // <-- note the _id
    //   {
    //     httpOnly: false,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'lax',
    //     maxAge: 1000 * 60 * 60 * 24 * 7,
    //     path: '/',
    //   }
    // )

    const token = signJwt({ userId: user._id });
    console.log("Token Found In Login Controller:", token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // adjust as needed
      maxAge: 24 * 60 * 60 * 1000, // 1 day (match JWT_EXPIRES_IN)
      path: "/",
    });

    const safeUser = user.toObject();
    delete (safeUser as any).passwordHash;
    return res.status(200).json({ token, user: safeUser });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function adminLoginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid field types" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    if (!user.isEmailVerified) {
      return res.status(400).json({ error: "Email not verified" });
    }
    if(!user.isAdminApproved) {
      return res.status(400).json({ error: "Account not approved by admin" });
    }
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    // const token = signJwt({ userId: user._id });
    return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role, className: user.className }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function adminRegisterController(req: Request, res: Response) {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ error: "Missing fields" });
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const passwordHash = await hashPassword(password);
    const user: IUser = await UserModel.create({ email, passwordHash, name, role });
    // const token = signJwt({ userId: user._id });
    return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

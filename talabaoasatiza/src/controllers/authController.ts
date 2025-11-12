import type { Request, Response } from "express";
import { UserModel, type IUser } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";
import { sendVerificationEmail, sendAdminNotificationEmail } from "../utils/mailer.js";
import { v4 as uuidv4 } from "uuid";

export async function registerController(req: Request, res: Response) {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ error: "Missing fields" });
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const passwordHash = await hashPassword(password);
    const token = uuidv4();
    const hashedToken = await hashPassword(token);
    const profileImage: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAV1BMVEX6+vqPj4////+Li4u5ubn8/PyIiIiFhYWJiYnk5OShoaGnp6fT09Pn5+eRkZHu7u7Z2dn19fXCwsKamprHx8exsbHOzs7X19eurq6/v7+jo6Pe3t6WlpZaNtXmAAAE3UlEQVR4nO2d25aqOhBFsUIRbgqI4AX//zsP0fa0vUfbBoKm4ljzpfvROapIIGSFKAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIEWamG+P/vn/Owhi5Juu3XZHnp6Lblutm1PT9q5aDKRriVulEqZVBqUSr9pjxh0gyrWOlr273KL05Vh/gyDTkv+jdJIsscEemrNUP9K7oU0W+f6UD1Bz+9rs4xuEOrFSrR/15T7rJwiwjU/y8gF9l3IWoyHxKLAVHxS68AYej1qZDbyRFaIocbaYIjhNHHlajTqygIS2CUqRiquDYqHFAinS0H2S+0WUwijzYThP/KFahjDY8vUWvtIEUkeK5hkkYMz9X83rUoJsQ+pTy2YIrFcJ4ytn8EoZRRCocBEMoostVeFH0LfAUOs4dSK8kpfQ2pbOT4Gp1Et6mvHZr0vEOXPhYQ7vU0TCphRueHAXFj6bsKij95pSrOY9N/xQxktymPLgbJqKfobh3HWhGw0GyIW3d5vuLoeg5f/6j4TdpL9qwczdUoh+DYWhDuhPdpY5PFhdD2dfhboGxdC/ZkMsFZvxMtOH64+9pGnfDjWTBBR7xxT/ku08XqejpcGzTvWub6rXsLnW/EIVfhu7LGNIXMdxnRC16NjRw5FZD2as0F9xuTWU//l7hxmVNeCO/hKaI89dqdAAljBxe4wdxFRp4P7dPpc/2/zNnv5AhFT8X3uBonuE5FMG57/IT4e/VfkDldEU9hFPCyCx+T1XU+6AEzaw4TVH3gQmaZbcpisFV0DDlWkzD3K1Pa8ud0EnbBClotut3NmXUx9B2sd9B2fmZo86DjgVFTOXmr4d+fa4DLuAV4rJ9EF5TOg/fz2ACiBud/rRUiT5vPyF+eIWJ1v3hnGidGMY/566sPione00CR1U21HU9rCs2YWffP+kV8A3fPwQAAIAP7k/1WApJkwpTM/THeFmOfRYJuelhGgo13nYuTaJX3VqCI1W5awDhIUof/K+hzlkZneKY+F7Bmb4uOhXPq3DUv1rQ85t916CaHcrjtegSF51gePDWp1y/o4Q+X5y+p4RjETtPRVxiq6UlnmrovkvPFl9tusS2dTt87SNaInpgh68IBh3eJLhSWxjCcK7h265DX4afP9IsEDa0w1cUaomQkx2+olBLhJwsDT09IrqfEGFt6CkKxY17cNsOb3ujqX2Tobfj+N41mCbeUqVzT56bis+T6t4i6HN/+3va1Gde7z3zhdfd0e4H7jzHb5rN7fg5OzwfUjc3WmGPOvp9NeOW47Iy9P16jXavvf3W/o/+ovyVfeptufsO19Do34IiwmxLnO/1EP8vuQ30sttTJeWIjFcpihE0W/Jf0KhqI0fQbDmZeIz+c9JWxjV4g7lYtlN1LGGz0A+of/jBnOkoJTGMSM1iZdSdzNMhmYbzEiOObkVsZ/sVpv7PDJCdn+wcDfH+UQbIhiByQkzZQc8qpEqSWG5/3sMUlYVOJn5nRieHOpxPzfEoWXcbW0uT8oqHcPS+GH9wVXZ33wT81c18JzCP96F+DfGS5lrvt4d8oy65tTS9bJZOr/k1dc67XV1Foae8Lrv4uamqoS77frfd7nZ9X9ZZ1TQsbEe+E1+Zte+gARJsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJP/AAFSQ7wNy+LTAAAAAElFTkSuQmCC";
    const user: IUser = await UserModel.create({ email, passwordHash, name, role, profilePicture: profileImage,verificationToken: hashedToken, verificationTokenExpiry: new Date(Date.now() + 3600000) });
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

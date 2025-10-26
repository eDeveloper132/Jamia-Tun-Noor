import mongoose from "mongoose";

export type Role = "student" | "teacher" | "nazim";

export interface IUser extends mongoose.Document {
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  className?: string;
  subjects?: string[];
  isEmailVerified?: boolean;
  isAdminApproved?: boolean;
  approvedBy?: mongoose.Schema.Types.ObjectId;
  forgotPassword?: boolean;
  forgotPasswordToken?: string | null;
  forgotPasswordExpiry?: Date | null;
  verificationToken?: string | null;
  verificationTokenExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "nazim"], required: true },
  className: { type: String },
  subjects: [String],
  isEmailVerified: { type: Boolean, default: false },
  isAdminApproved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: false },
  forgotPassword: { type: Boolean, default: false },
  forgotPasswordToken: { type: String, default: null },
  forgotPasswordExpiry: { type: Date, default: null },
  verificationToken: { type: String, default: null },
  verificationTokenExpiry: { type: Date, default: null },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>("User", UserSchema);

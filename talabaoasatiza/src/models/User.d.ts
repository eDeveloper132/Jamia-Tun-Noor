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
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map
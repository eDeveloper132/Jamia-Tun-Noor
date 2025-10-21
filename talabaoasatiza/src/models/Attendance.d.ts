import mongoose from "mongoose";
export type AttendanceStatus = "present" | "absent" | "leave" | "late";
export interface IAttendance extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    userRole: "student" | "teacher";
    className?: string;
    subject?: string;
    date: string;
    entryTime?: string;
    exitTime?: string;
    status: AttendanceStatus;
    markedBy: mongoose.Types.ObjectId;
    notes?: string;
}
export declare const AttendanceModel: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance, {}, {}> & IAttendance & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Attendance.d.ts.map
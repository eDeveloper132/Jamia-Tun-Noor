import mongoose from "mongoose";

export type AttendanceStatus = "present" | "absent" | "leave" | "late";

export interface IAttendance extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  userRole: "student" | "teacher";
  className?: string;
  subject?: string;
  date: string;        // YYYY-MM-DD
  entryTime?: string;  // e.g. "08:00"
  exitTime?: string;
  status: AttendanceStatus;
  markedBy: mongoose.Types.ObjectId;
  notes?: string;
}

const AttendanceSchema = new mongoose.Schema<IAttendance>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userRole: { type: String, enum: ["student", "teacher"], required: true },
  className: String,
  subject: String,
  date: { type: String, required: true, index: true },
  entryTime: String,
  exitTime: String,
  status: { type: String, enum: ["present","absent","leave","late"], default: "present" },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notes: String
}, { timestamps: true });

AttendanceSchema.index({ user: 1, date: 1 });

export const AttendanceModel = mongoose.model<IAttendance>("Attendance", AttendanceSchema);

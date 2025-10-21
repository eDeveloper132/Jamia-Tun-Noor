import mongoose from "mongoose";
const AttendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userRole: { type: String, enum: ["student", "teacher"], required: true },
    className: String,
    subject: String,
    date: { type: String, required: true, index: true },
    entryTime: String,
    exitTime: String,
    status: { type: String, enum: ["present", "absent", "leave", "late"], default: "present" },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notes: String
}, { timestamps: true });
AttendanceSchema.index({ user: 1, date: 1 });
export const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
//# sourceMappingURL=Attendance.js.map
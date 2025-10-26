import { AttendanceModel } from "../models/Attendance.js";
import { AuditLogModel } from "../models/AuditLog.js";
export async function markAttendance(req, res) {
    try {
        const { userId, userRole, date, entryTime, exitTime, status, subject, className } = req.body;
        if (!userId || !userRole || !date)
            return res.status(400).json({ error: "Missing fields" });
        const attendance = await AttendanceModel.create({
            user: userId,
            userRole,
            date,
            entryTime,
            exitTime,
            status: status || "not-entered",
            subject,
            className,
            markedBy: req.user._id
        });
        await AuditLogModel.create({ actor: req.user._id, action: "mark_attendance", collectionName: "Attendance", documentId: attendance._id, after: attendance });
        return res.json({ attendance });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
export async function bulkAttendance(req, res) {
    try {
        const entries = req.body.entries; // array of attendance objects
        if (!Array.isArray(entries))
            return res.status(400).json({ error: "entries must be array" });
        const docs = entries.map((e) => ({ ...e, markedBy: req.user._id }));
        const created = await AttendanceModel.insertMany(docs);
        await AuditLogModel.create({ actor: req.user._id, action: "bulk_attendance", collectionName: "Attendance", after: created.slice(0, 5) });
        return res.json({ createdCount: created.length, created });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
export async function getUserAttendance(req, res) {
    try {
        const userId = req.params.userId;
        const { start, end } = req.query;
        const q = { user: userId };
        if (start && end)
            q.date = { $gte: start, $lte: end };
        const records = await AttendanceModel.find(q).sort({ date: 1 });
        // basic percentage
        const total = records.length;
        const present = records.filter(r => r.status === "present").length;
        const percentage = total === 0 ? 0 : Math.round((present / total) * 10000) / 100;
        return res.json({ total, present, percentage, records });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
//# sourceMappingURL=attendanceController.js.map
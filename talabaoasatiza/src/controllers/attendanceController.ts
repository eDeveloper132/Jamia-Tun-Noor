import type { Request, Response } from "express";
import { AttendanceModel, type IAttendance } from "../models/Attendance.js";
import { AuditLogModel } from "../models/AuditLog.js";

export async function markAttendance(req: Request, res: Response) {
  try {
    const { userId, userRole, date, entryTime, exitTime, status, subject, className } = req.body;
    if (!userId || !userRole || !date) return res.status(400).json({ error: "Missing fields" });
    const attendance: IAttendance = await AttendanceModel.create({
      user: userId,
      userRole,
      date,
      entryTime,
      exitTime,
      status: status || "not-entered",
      subject,
      className,
      markedBy: (req as any).user._id
    });
    await AuditLogModel.create({ actor: (req as any).user._id, action: "mark_attendance", collectionName: "Attendance", documentId: attendance._id, after: attendance });
    return res.json({ attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function bulkAttendance(req: Request, res: Response) {
  try {
    const entries = req.body.entries; // array of attendance objects
    if (!Array.isArray(entries)) return res.status(400).json({ error: "entries must be array" });
    const docs = entries.map((e: any) => ({ ...e, markedBy: (req as any).user._id }));
    const created = await AttendanceModel.insertMany(docs);
    await AuditLogModel.create({ actor: (req as any).user._id, action: "bulk_attendance", collectionName: "Attendance", after: created.slice(0, 5) });
    return res.json({ createdCount: created.length, created });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getUserAttendance(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const { start, end } = req.query;
    const q: any = { user: userId };
    if (start && end) q.date = { $gte: start, $lte: end };
    const records = await AttendanceModel.find(q).sort({ date: 1 });
    // basic percentage
    const total = records.length;
    const present = records.filter(r => r.status === "present").length;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 10000) / 100;
    return res.json({ total, present, percentage, records });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getMyAttendance(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayRecord = await AttendanceModel.findOne({ user: userId, date: today });

    const records = await AttendanceModel.find({ user: userId }).sort({ date: -1 }).limit(30);
    
    return res.json({ today: todayRecord, recent: records });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function markOrUpdateMyAttendance(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { date, entryTime, exitTime, status } = req.body;

    if (!date) return res.status(400).json({ error: "Date is required" });

    let attendance = await AttendanceModel.findOne({ user: userId, date });

    if (attendance) {
      // Update existing record
      const before = attendance.toObject();
      attendance.entryTime = entryTime || attendance.entryTime;
      attendance.exitTime = exitTime || attendance.exitTime;
      attendance.status = status || attendance.status;
      await attendance.save();
      await AuditLogModel.create({ actor: userId, action: "update_my_attendance", collectionName: "Attendance", documentId: attendance._id, before, after: attendance });
    } else {
      // Create new record
      attendance = await AttendanceModel.create({
        user: userId,
        userRole: 'teacher',
        date,
        entryTime,
        exitTime,
        status: status || 'present',
        markedBy: userId,
      });
      await AuditLogModel.create({ actor: userId, action: "mark_my_attendance", collectionName: "Attendance", documentId: attendance._id, after: attendance });
    }

    return res.json({ attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

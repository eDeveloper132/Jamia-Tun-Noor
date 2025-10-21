import type { Request, Response } from "express";
import { ExamModel } from "../models/Exam.js";

export async function createExam(req: Request, res: Response) {
  try {
    const { title, subject, className, date, startTime, endTime } = req.body;
    if (!title || !className || !date) return res.status(400).json({ error: "Missing fields" });
    const exam = await ExamModel.create({ title, subject, className, date, startTime, endTime, createdBy: (req as any).user._id });
    return res.json({ exam });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getExamsForClass(req: Request, res: Response) {
  const className = req.params.className;
  const exams = await ExamModel.find({ className }).sort({ date: 1 });
  return res.json({ exams });
}

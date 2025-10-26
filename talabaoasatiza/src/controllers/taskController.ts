import type { Request, Response } from "express";
import { TaskModel, type ITask } from "../models/Task.js";

export async function createTask(req: Request, res: Response) {
  try {
    const { title, description, subject, assignedTo, assignedDate, dueDate } = req.body;
    if (!title || !subject || !assignedTo || !assignedDate) return res.status(400).json({ error: "Missing fields" });
    const task: ITask = await TaskModel.create({
      title, description, subject, assignedTo, assignedBy: (req as any).user._id, assignedDate, dueDate
    });
    return res.json({ task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getTasksForUser(req: Request, res: Response) {
  const userId = req.params.userId;
  const tasks = await TaskModel.find({ assignedTo: userId }).sort({ createdAt: -1 });
  return res.json({ tasks });
}

export async function updateTaskStatus(req: Request, res: Response) {
  const { status } = req.body;
  const task = await TaskModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!task) return res.status(404).json({ error: "Not found" });
  return res.json({ task });
}

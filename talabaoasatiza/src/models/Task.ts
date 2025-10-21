import mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  title: string;
  description?: string;
  subject: string;
  assignedBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId[]; // students
  assignedDate: string;
  dueDate?: string;
  status: "pending" | "done" | "overdue";
  attachments?: string[];
}

const TaskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  description: String,
  subject: { type: String, required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignedDate: { type: String, required: true },
  dueDate: String,
  status: { type: String, enum: ["pending","done","overdue"], default: "pending" },
  attachments: [String]
}, { timestamps: true });

export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);

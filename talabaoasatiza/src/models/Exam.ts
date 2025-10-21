import mongoose from "mongoose";

export interface IExamResult {
  student: mongoose.Types.ObjectId;
  marks: number;
  total: number;
}

export interface IExam extends mongoose.Document {
  title: string;
  subject: string;
  className: string;
  date: string;
  startTime?: string;
  endTime?: string;
  createdBy?: mongoose.Types.ObjectId;
  results?: IExamResult[];
}

const ExamSchema = new mongoose.Schema<IExam>({
  title: { type: String, required: true },
  subject: String,
  className: String,
  date: String,
  startTime: String,
  endTime: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  results: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, marks: Number, total: Number }]
}, { timestamps: true });

export const ExamModel = mongoose.model<IExam>("Exam", ExamSchema);

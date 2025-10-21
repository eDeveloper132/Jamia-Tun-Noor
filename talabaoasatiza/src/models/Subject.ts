import mongoose from "mongoose";

export interface ISubject extends mongoose.Document {
  name: string;
  className?: string;
}

const SubjectSchema = new mongoose.Schema<ISubject>({
  name: { type: String, required: true },
  className: String
}, { timestamps: true });

export const SubjectModel = mongoose.model<ISubject>("Subject", SubjectSchema);

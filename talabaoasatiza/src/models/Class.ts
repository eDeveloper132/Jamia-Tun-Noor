import mongoose from "mongoose";

export interface IClass extends mongoose.Document {
  name: string;
  description?: string;
}

const ClassSchema = new mongoose.Schema<IClass>({
  name: { type: String, required: true, unique: true },
  description: String
}, { timestamps: true });

export const ClassModel = mongoose.model<IClass>("Class", ClassSchema);

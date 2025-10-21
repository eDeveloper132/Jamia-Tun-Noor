import mongoose from "mongoose";
const ExamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: String,
    className: String,
    date: String,
    startTime: String,
    endTime: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    results: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, marks: Number, total: Number }]
}, { timestamps: true });
export const ExamModel = mongoose.model("Exam", ExamSchema);
//# sourceMappingURL=Exam.js.map
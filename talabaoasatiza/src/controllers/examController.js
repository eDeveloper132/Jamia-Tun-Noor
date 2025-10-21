import { ExamModel } from "../models/Exam.js";
export async function createExam(req, res) {
    try {
        const { title, subject, className, date, startTime, endTime } = req.body;
        if (!title || !className || !date)
            return res.status(400).json({ error: "Missing fields" });
        const exam = await ExamModel.create({ title, subject, className, date, startTime, endTime, createdBy: req.user._id });
        return res.json({ exam });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
export async function getExamsForClass(req, res) {
    const className = req.params.className;
    const exams = await ExamModel.find({ className }).sort({ date: 1 });
    return res.json({ exams });
}
//# sourceMappingURL=examController.js.map
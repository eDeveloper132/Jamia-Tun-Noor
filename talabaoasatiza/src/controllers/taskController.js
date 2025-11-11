import { TaskModel } from "../models/Task.js";
import { UserModel } from "../models/User.js";
export async function createTask(req, res) {
    try {
        const { title, description, subject, assignedTo, assignedDate, dueDate } = req.body;
        if (!title || !subject || !assignedTo || !assignedDate)
            return res.status(400).json({ error: "Missing fields" });
        const task = await TaskModel.create({
            title, description, subject, assignedTo, assignedBy: req.user._id, assignedDate, dueDate
        });
        return res.json({ task });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
export async function assignTaskToClass(req, res) {
    try {
        const { className, title, description, subject, dueDate } = req.body;
        if (!className || !title || !subject) {
            return res.status(400).json({ error: "className, title, and subject are required." });
        }
        const students = await UserModel.find({ role: 'student', className: className }).select('_id');
        if (!students || students.length === 0) {
            return res.status(404).json({ error: "No students found in this class." });
        }
        const studentIds = students.map(student => student._id);
        const task = await TaskModel.create({
            title,
            description,
            subject,
            assignedTo: studentIds,
            assignedBy: req.user?._id,
            assignedDate: new Date().toISOString(),
            dueDate,
        });
        return res.status(201).json({ message: "Task assigned to class successfully.", task });
    }
    catch (error) {
        console.error("Error assigning task to class:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
export async function getTasksForUser(req, res) {
    const userId = req.params.userId;
    const tasks = await TaskModel.find({ assignedTo: userId }).sort({ createdAt: -1 });
    return res.json({ tasks });
}
export async function updateTaskStatus(req, res) {
    const { status } = req.body;
    const task = await TaskModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task)
        return res.status(404).json({ error: "Not found" });
    return res.json({ task });
}
//# sourceMappingURL=taskController.js.map
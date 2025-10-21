import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    subject: { type: String, required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedDate: { type: String, required: true },
    dueDate: String,
    status: { type: String, enum: ["pending", "done", "overdue"], default: "pending" },
    attachments: [String]
}, { timestamps: true });
export const TaskModel = mongoose.model("Task", TaskSchema);
//# sourceMappingURL=Task.js.map
import mongoose from "mongoose";
export interface ITask extends mongoose.Document {
    title: string;
    description?: string;
    subject: string;
    assignedBy: mongoose.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId[];
    assignedDate: string;
    dueDate?: string;
    status: "pending" | "done" | "overdue";
    attachments?: string[];
}
export declare const TaskModel: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Task.d.ts.map
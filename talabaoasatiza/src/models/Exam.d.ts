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
export declare const ExamModel: mongoose.Model<IExam, {}, {}, {}, mongoose.Document<unknown, {}, IExam, {}, {}> & IExam & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Exam.d.ts.map
import mongoose from "mongoose";
export interface ISubject extends mongoose.Document {
    name: string;
    className?: string;
}
export declare const SubjectModel: mongoose.Model<ISubject, {}, {}, {}, mongoose.Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Subject.d.ts.map
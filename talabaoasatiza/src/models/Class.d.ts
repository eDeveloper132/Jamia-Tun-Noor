import mongoose from "mongoose";
export interface IClass extends mongoose.Document {
    name: string;
    description?: string;
}
export declare const ClassModel: mongoose.Model<IClass, {}, {}, {}, mongoose.Document<unknown, {}, IClass, {}, {}> & IClass & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Class.d.ts.map
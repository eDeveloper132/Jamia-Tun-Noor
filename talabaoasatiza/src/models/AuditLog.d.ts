import mongoose from "mongoose";
export interface IAuditLog extends mongoose.Document {
    actor?: mongoose.Types.ObjectId;
    action: string;
    collectionName?: string;
    documentId?: any;
    before?: any;
    after?: any;
}
export declare const AuditLogModel: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, {}> & IAuditLog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=AuditLog.d.ts.map
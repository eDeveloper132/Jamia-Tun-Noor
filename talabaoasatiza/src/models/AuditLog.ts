import mongoose from "mongoose";

export interface IAuditLog extends mongoose.Document {
  actor?: mongoose.Types.ObjectId;
  action: string;
  collectionName?: string;
  documentId?: any;
  before?: any;
  after?: any;
}

const AuditLogSchema = new mongoose.Schema<IAuditLog>({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String,
  collectionName: String,
  documentId: mongoose.Schema.Types.Mixed,
  before: mongoose.Schema.Types.Mixed,
  after: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export const AuditLogModel = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

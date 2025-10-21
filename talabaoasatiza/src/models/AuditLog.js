import mongoose from "mongoose";
const AuditLogSchema = new mongoose.Schema({
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    collectionName: String,
    documentId: mongoose.Schema.Types.Mixed,
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
}, { timestamps: true });
export const AuditLogModel = mongoose.model("AuditLog", AuditLogSchema);
//# sourceMappingURL=AuditLog.js.map
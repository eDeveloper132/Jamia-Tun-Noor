import mongoose from "mongoose";
const SubjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    className: String
}, { timestamps: true });
export const SubjectModel = mongoose.model("Subject", SubjectSchema);
//# sourceMappingURL=Subject.js.map
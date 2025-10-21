import mongoose from "mongoose";
const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String
}, { timestamps: true });
export const ClassModel = mongoose.model("Class", ClassSchema);
//# sourceMappingURL=Class.js.map
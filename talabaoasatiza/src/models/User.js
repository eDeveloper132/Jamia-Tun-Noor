import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "nazim"], required: true },
    className: { type: String },
    subjects: [String],
    isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });
export const UserModel = mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map
import { UserModel } from "../models/User.js";
import { hashPassword } from "../utils/hash.js";
export async function listUsers(req, res) {
    const { role, className, page = "1", limit = "50" } = req.query;
    const q = {};
    if (role)
        q.role = role;
    if (className)
        q.className = className;
    const p = Math.max(1, Number(page));
    const l = Math.min(500, Number(limit));
    const users = await UserModel.find(q).skip((p - 1) * l).limit(l).select("-passwordHash");
    return res.json({ users });
}
export async function createUser(req, res) {
    try {
        const { email, password, name, role, className, subjects } = req.body;
        if (!email || !password || !name || !role)
            return res.status(400).json({ error: "Missing fields" });
        if (await UserModel.findOne({ email }))
            return res.status(400).json({ error: "Email exists" });
        const passwordHash = await hashPassword(password);
        const user = await UserModel.create({ email, passwordHash, name, role, className, subjects });
        return res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
export async function getUser(req, res) {
    const user = await UserModel.findById(req.params.id).select("-passwordHash");
    if (!user)
        return res.status(404).json({ error: "Not found" });
    return res.json({ user });
}
export async function updateUser(req, res) {
    const update = req.body;
    if (update.password)
        delete update.password; // don't allow raw password change here
    const user = await UserModel.findByIdAndUpdate(req.params.id, update, { new: true }).select("-passwordHash");
    if (!user)
        return res.status(404).json({ error: "Not found" });
    return res.json({ user });
}
//# sourceMappingURL=userController.js.map
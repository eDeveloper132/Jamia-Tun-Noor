import { verifyJwt } from "./jwt.js";
import { UserModel } from "../models/User.js";
export async function requireAuth(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer "))
            return res.status(401).json({ error: "Unauthorized" });
        const token = auth.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const payload = verifyJwt(token);
        const user = await UserModel.findById(payload.userId).select("-passwordHash");
        if (!user)
            return res.status(401).json({ error: "Unauthorized" });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
export function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        if (!roles.includes(req.user.role))
            return res.status(403).json({ error: "Forbidden" });
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map
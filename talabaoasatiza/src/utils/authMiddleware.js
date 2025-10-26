import { verifyJwt } from "./jwt.js";
import { UserModel } from "../models/User.js";
export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        // Also support a cookie named 'token' (useful for browser requests)
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }
        if (!token) {
            return res.status(401).redirect("/login");
        }
        const payload = verifyJwt(token);
        const user = await UserModel.findById(payload.userId).select("-passwordHash");
        if (!user)
            return res.status(401).redirect("/login");
        req.user = user;
        next();
    }
    catch (err) {
        console.error("Authentication error:", err);
        return res.status(401).json({ error: "Invalid token" });
    }
}
export function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" }).redirect("/login");
        if (!roles.includes(String(req.user.role)))
            return res.status(403).json({ error: "Forbidden" });
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map
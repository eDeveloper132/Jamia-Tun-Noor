import { verifyJwt } from "./jwt.js";
import { UserModel } from "../models/User.js";
export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        let token;
        console.log("Auth header:", authHeader);
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
            console.log("Token Found Require Auth (header):", token);
        }
        // cookie fallback
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
            console.log("Token Found Require Auth (cookie):", token);
        }
        if (!token) {
            // If this is an API client prefer JSON; for browser route you might want redirect:
            if (req.headers.accept && req.headers.accept.includes("application/json")) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            return res.status(401).redirect("/login");
        }
        const payload = verifyJwt(token);
        const user = await UserModel.findById(payload.userId).select("-passwordHash");
        if (!user) {
            if (req.headers.accept && req.headers.accept.includes("application/json")) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            return res.status(401).redirect("/login");
        }
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
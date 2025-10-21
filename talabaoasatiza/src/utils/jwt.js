import jwt from "jsonwebtoken";
const JWT_SECRET = (process.env.JWT_SECRET ?? "CHANGE_ME");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d"; // keep as string
export function signJwt(payload) {
    const expiresIn = JWT_EXPIRES_IN ? Number(JWT_EXPIRES_IN) : undefined;
    const options = expiresIn ? { expiresIn } : undefined;
    return jwt.sign(payload, JWT_SECRET, options);
}
export function verifyJwt(token) {
    return jwt.verify(token, JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map
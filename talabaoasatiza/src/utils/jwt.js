// ./src/utils/jwt.ts
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
const RAW_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d";
function parseExpiresIn(value) {
    if (/^\d+$/.test(value)) {
        return Number(value);
    }
    return value;
}
export function signJwt(payload) {
    const expiresIn = parseExpiresIn(RAW_EXPIRES_IN);
    const options = { expiresIn }; // no error now
    return jwt.sign(payload, JWT_SECRET, options);
}
export function verifyJwt(token) {
    return jwt.verify(token, JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map
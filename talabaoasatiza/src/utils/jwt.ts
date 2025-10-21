import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET ?? "CHANGE_ME") as Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d"; // keep as string

export function signJwt(payload: object) {
  const expiresIn: number | undefined = JWT_EXPIRES_IN ? Number(JWT_EXPIRES_IN) : undefined;
  const options: SignOptions | undefined = expiresIn ? { expiresIn } : undefined;

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}

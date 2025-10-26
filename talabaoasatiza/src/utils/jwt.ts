// ./src/utils/jwt.ts
import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "dev-secret";
const RAW_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d";

function parseExpiresIn(value: string): NonNullable<SignOptions["expiresIn"]> {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }
  return value as unknown as NonNullable<SignOptions["expiresIn"]>;
}

export function signJwt(payload: object) {
  const expiresIn = parseExpiresIn(RAW_EXPIRES_IN);
  const options: SignOptions = { expiresIn }; // no error now
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}

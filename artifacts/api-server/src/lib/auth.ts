import jwt from "jsonwebtoken";
import { createHash, timingSafeEqual } from "node:crypto";
import { env } from "./env.js";

export function signToken(): string {
  return jwt.sign({ role: "admin" }, env.sessionSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, env.sessionSecret);
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const provided = createHash("sha256").update(password).digest();
  const expected = createHash("sha256").update(env.adminPassword).digest();
  return timingSafeEqual(provided, expected);
}

export function requireAuth(req: any, res: any, next: any): void {
  const auth = req.headers?.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  if (!verifyToken(token)) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  next();
}

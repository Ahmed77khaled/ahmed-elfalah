import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";

const SECRET = process.env.SESSION_SECRET ?? "dev-secret";

export function signToken(): string {
  return jwt.sign({ role: "admin" }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
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

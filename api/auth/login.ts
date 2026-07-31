import jwtPkg from "jsonwebtoken";
import { createHash, timingSafeEqual } from "crypto";

const jwt = (jwtPkg as any).default || jwtPkg;

export default function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { password } = body;
    const expectedPassword = process.env.ADMIN_PASSWORD || "ahmedkhaled18102005";
    const sessionSecret = process.env.SESSION_SECRET || "a9f8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8";

    if (!password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const providedHash = createHash("sha256").update(String(password)).digest();
    const expectedHash = createHash("sha256").update(String(expectedPassword)).digest();

    if (providedHash.length !== expectedHash.length || !timingSafeEqual(providedHash, expectedHash)) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ role: "admin" }, sessionSecret, { expiresIn: "7d" });
    return res.status(200).json({ token });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}

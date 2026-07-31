import jwt from "jsonwebtoken";

export default function handler(req: any, res: any) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = auth.slice(7);
  const sessionSecret = process.env.SESSION_SECRET || "a9f8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8";
  try {
    jwt.verify(token, sessionSecret);
    return res.status(200).json({ authenticated: true });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

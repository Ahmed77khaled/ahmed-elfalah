import { Router } from "express";
import { signToken, verifyAdminPassword, verifyToken } from "../lib/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password || !verifyAdminPassword(password)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = signToken();
  res.json({ token });
});

router.get("/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (!verifyToken(auth.slice(7))) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  res.json({ authenticated: true });
});

export default router;

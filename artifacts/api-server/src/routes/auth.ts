import { Router } from "express";
import { signToken } from "../lib/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    res.status(500).json({ error: "Admin password not configured" });
    return;
  }

  if (!password || password !== adminPassword) {
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
  res.json({ authenticated: true });
});

export default router;

import { requireAdmin } from "./_jwt.js";

export default function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  return res.status(200).json({ authenticated: true, role: "admin" });
}

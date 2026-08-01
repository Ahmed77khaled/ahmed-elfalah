import { signAdminToken } from "./_jwt.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
  body = body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !process.env.SESSION_SECRET) {
    return res.status(503).json({ error: "Admin authentication is not configured" });
  }
  if (body.password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }
  return res.status(200).json({ token: signAdminToken() });
}

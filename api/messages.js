import { query, sendDatabaseError } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name = "", email = "", subject = "", message = "" } = req.body || {};
  if (![name, email, subject, message].every((value) => typeof value === "string" && value.trim())) return res.status(400).json({ error: "All message fields are required" });
  try {
    await query("INSERT INTO messages (name,email,subject,message) VALUES ($1,$2,$3,$4)", [name.trim(), email.trim(), subject.trim(), message.trim()]);
    return res.status(201).json({ success: true, data: { ok: true } });
  } catch (error) { return sendDatabaseError(res, error); }
}

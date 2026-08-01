import { requireAdmin } from "./auth/_jwt.js";
import { query, sendDatabaseError } from "./_db.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === "GET") {
      const { rows } = await query("SELECT key, value FROM settings ORDER BY key");
      return res.status(200).json({ success: true, data: Object.fromEntries(rows.map((row) => [row.key, row.value])) });
    }
    if (req.method === "PUT") {
      const entries = Object.entries(req.body || {}).filter(([key, value]) => typeof key === "string" && typeof value === "string");
      await Promise.all(entries.map(([key, value]) => query("INSERT INTO settings (key,value,updated_at) VALUES ($1,$2,NOW()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=NOW()", [key, value])));
      return res.status(200).json({ success: true, data: { ok: true } });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

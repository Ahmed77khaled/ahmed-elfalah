import { requireAdmin } from "./auth/_jwt.js";
import { messageColumns } from "./_cms.js";
import { query, sendDatabaseError } from "./_db.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const id = Number(req.query?.id);
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${messageColumns} FROM messages ORDER BY created_at DESC`)).rows });
    if (req.method === "PUT" && req.query?.action === "read" && Number.isInteger(id)) { const row = (await query(`UPDATE messages SET read=true WHERE id=$1 RETURNING ${messageColumns}`, [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Message not found" }); }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM messages WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Message not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

import { requireAdmin } from "./auth/_jwt.js";
import { projectColumns, saveProject } from "./_cms.js";
import { query, sendDatabaseError } from "./_db.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const id = Number(req.query?.id);
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${projectColumns} FROM projects ORDER BY display_order, id`)).rows });
    if (req.method === "POST") return res.status(201).json({ success: true, data: (await saveProject(req.body || {})).rows[0] });
    if (req.method === "PUT" && Number.isInteger(id)) { const row = (await saveProject(req.body || {}, id)).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Project not found" }); }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM projects WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Project not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

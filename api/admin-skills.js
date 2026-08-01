import { requireAdmin } from "./auth/_jwt.js";
import { skillColumns } from "./_cms.js";
import { query, sendDatabaseError } from "./_db.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const id = Number(req.query?.id); const body = req.body || {};
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${skillColumns} FROM skills ORDER BY display_order, id`)).rows });
    if (req.method === "POST") return res.status(201).json({ success: true, data: (await query(`INSERT INTO skills (name,icon,percentage,category,visible,display_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${skillColumns}`, [body.name || "", body.icon || "", body.percentage || 0, body.category || "", body.visible ?? true, body.displayOrder || 0])).rows[0] });
    if (req.method === "PUT" && Number.isInteger(id)) { const row = (await query(`UPDATE skills SET name=$1,icon=$2,percentage=$3,category=$4,visible=$5,display_order=$6 WHERE id=$7 RETURNING ${skillColumns}`, [body.name || "", body.icon || "", body.percentage || 0, body.category || "", body.visible ?? true, body.displayOrder || 0, id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Skill not found" }); }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM skills WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Skill not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

import { requireAdmin } from "./auth/_jwt.js";
import { experienceColumns } from "./_cms.js";
import { query, sendDatabaseError } from "./_db.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const id = Number(req.query?.id); const body = req.body || {}; const values = [body.company || "", body.position || "", body.description || "", body.startDate || "", body.endDate || "", body.currentPosition ?? false, body.companyLogo || "", body.displayOrder || 0];
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${experienceColumns} FROM experience ORDER BY display_order, id`)).rows });
    if (req.method === "POST") return res.status(201).json({ success: true, data: (await query(`INSERT INTO experience (company,position,description,start_date,end_date,current_position,company_logo,display_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${experienceColumns}`, values)).rows[0] });
    if (req.method === "PUT" && Number.isInteger(id)) { const row = (await query(`UPDATE experience SET company=$1,position=$2,description=$3,start_date=$4,end_date=$5,current_position=$6,company_logo=$7,display_order=$8 WHERE id=$9 RETURNING ${experienceColumns}`, [...values, id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Experience not found" }); }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM experience WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Experience not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

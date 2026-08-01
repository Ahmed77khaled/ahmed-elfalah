import { skillColumns } from "./_cms.js";
import { query, sendDatabaseError } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { rows } = await query(`SELECT ${skillColumns} FROM skills WHERE visible = true ORDER BY display_order, id`);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) { return sendDatabaseError(res, error); }
}

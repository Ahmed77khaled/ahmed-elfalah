import { requireAdmin } from "./auth/_jwt.js";
import { query, sendDatabaseError } from "./_db.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const { rows: [stats] } = await query(`SELECT (SELECT count(*)::int FROM projects) AS projects, (SELECT count(*)::int FROM skills) AS skills, (SELECT count(*)::int FROM experience) AS experience, (SELECT count(*)::int FROM messages) AS messages, (SELECT count(*)::int FROM messages WHERE read=false) AS "unreadMessages"`);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) { return sendDatabaseError(res, error); }
}
